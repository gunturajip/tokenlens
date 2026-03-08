import { create } from 'zustand';
import { LLMModel, CostBreakdown, EstimationResult } from '../types';

interface CalculatorState {
    inputText: string;
    images: { id: string; name: string; tokens: number; preview: string }[];
    files: { id: string; name: string; tokens: number; type: string }[];
    selectedModel: LLMModel | null;
    allModels: LLMModel[];
    estimation: EstimationResult | null;
    isLoading: boolean;
    isSaving: boolean;

    // Actions
    setInputText: (text: string) => void;
    addImage: (image: { id: string; name: string; tokens: number; preview: string }) => void;
    removeImage: (id: string) => void;
    addFile: (file: { id: string; name: string; tokens: number; type: string }) => void;
    removeFile: (id: string) => void;
    setSelectedModel: (model: LLMModel) => void;
    setAllModels: (models: LLMModel[]) => void;
    setEstimation: (estimation: EstimationResult) => void;
    setLoading: (loading: boolean) => void;
    clearAll: () => void;
    saveCalculation: (requestsPerDay?: number) => Promise<boolean>;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
    inputText: '',
    images: [],
    files: [],
    selectedModel: null,
    allModels: [],
    estimation: null,
    isLoading: false,
    isSaving: false,

    setInputText: (text) => set({ inputText: text }),

    addImage: (image) => set((state) => ({
        images: [...state.images, image]
    })),

    removeImage: (id) => set((state) => ({
        images: state.images.filter((img) => img.id !== id)
    })),

    addFile: (file) => set((state) => ({
        files: [...state.files, file]
    })),

    removeFile: (id) => set((state) => ({
        files: state.files.filter((f) => f.id !== id)
    })),

    setSelectedModel: (model) => set({ selectedModel: model }),

    setAllModels: (models) => set({ allModels: models }),

    setEstimation: (estimation) => set({ estimation }),

    setLoading: (loading) => set({ isLoading: loading }),

    clearAll: () => set({
        inputText: '',
        images: [],
        files: [],
        estimation: null,
        isLoading: false
    }),

    saveCalculation: async (requestsPerDay = 1) => {
        const state = get();
        const { selectedModel, estimation } = state;
        
        if (!selectedModel || !estimation) {
            return false;
        }

        set({ isSaving: true });

        try {
            const dailyCost = estimation.totalCost * requestsPerDay;
            const monthlyCost = dailyCost * 30;

            const response = await fetch('/api/calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_id: selectedModel.model_id,
                    model_name: selectedModel.name,
                    provider: selectedModel.provider,
                    input_tokens: estimation.inputTokens,
                    output_tokens: estimation.outputTokens,
                    requests_per_day: requestsPerDay,
                    input_cost: estimation.breakdown.inputCost,
                    output_cost: estimation.breakdown.outputCost,
                    total_cost: estimation.totalCost,
                    daily_cost: dailyCost,
                    monthly_cost: monthlyCost,
                }),
            });

            set({ isSaving: false });
            return response.ok;
        } catch (error) {
            console.error('Failed to save calculation:', error);
            set({ isSaving: false });
            return false;
        }
    },
}));
