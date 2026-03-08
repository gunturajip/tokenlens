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
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
    inputText: '',
    images: [],
    files: [],
    selectedModel: null,
    allModels: [],
    estimation: null,
    isLoading: false,

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
}));
