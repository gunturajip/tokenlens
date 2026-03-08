"use client";

import React, { useEffect, useState } from "react";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { LLMModel } from "@/types";
import { Search, ChevronDown, Check, Zap, Layers, Globe, Cpu } from "lucide-react";
import { 
  Tabs, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-[#74AA9C]",
  Anthropic: "text-[#CC785C]",
  Google: "text-[#4285F4]",
  Meta: "text-[#0668E1]",
  xAI: "text-white",
  DeepSeek: "text-[#4D6FFF]",
  Mistral: "text-[#FF7000]",
  Alibaba: "text-[#FF6A00]",
};

export function ModelSelector() {
  const { allModels, setAllModels, selectedModel, setSelectedModel } = useCalculatorStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        setAllModels(data);
        if (data.length > 0 && !selectedModel) {
          setSelectedModel(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
      }
    }
    fetchModels();
  }, [setAllModels, selectedModel, setSelectedModel]);

  const filteredModels = allModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) || 
                         model.provider.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "frontier") return matchesSearch && model.rank <= 10;
    if (filter === "value") return matchesSearch && model.input_price_per_mtok < 1;
    if (filter === "vision") return matchesSearch && model.supports_vision;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6 bg-card border border-border rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-xl font-bold text-foreground">Model Selection</h2>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All Models
          </button>
          <button 
            onClick={() => setFilter("frontier")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === "frontier" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Frontier (Top 10)
          </button>
          <button 
            onClick={() => setFilter("value")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === "value" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Best Value
          </button>
          <button 
            onClick={() => setFilter("vision")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === "vision" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Vision Support
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredModels.map((model) => (
            <div 
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${selectedModel?.id === model.id ? "border-primary bg-primary/5 shadow-inner" : "border-border bg-background/50 hover:border-muted-foreground/50 hover:bg-muted/20"}`}
            >
              {selectedModel?.id === model.id && (
                <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                  <Check size={18} />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-background border border-border ${PROVIDER_COLORS[model.provider] || "text-foreground"}`}>
                  {model.provider === "OpenAI" ? <Zap size={18} /> : 
                   model.provider === "Anthropic" ? <Layers size={18} /> : 
                   model.provider === "Google" ? <Globe size={18} /> : 
                   <Cpu size={18} />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{model.provider}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Input</p>
                  <p className="text-xs font-mono font-semibold text-foreground">${model.input_price_per_mtok.toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground">/MTok</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Output</p>
                  <p className="text-xs font-mono font-semibold text-foreground">${model.output_price_per_mtok.toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground">/MTok</span></p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 bg-background/50">
                  {model.context_window.toLocaleString()} ctx
                </Badge>
                {model.supports_vision && (
                  <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-blue-500/10 text-blue-500 border-none">
                    VISION
                  </Badge>
                )}
                {model.is_reasoning_model && (
                  <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-purple-500/10 text-purple-500 border-none">
                    REASONING
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
