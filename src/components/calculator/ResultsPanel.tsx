"use client";

import React, { useState } from "react";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { calculateCost } from "@/lib/costCalculator";
import { countTokens } from "@/lib/tokenizer";
import { CostBreakdown } from "@/types";
import { 
  TrendingUp, TrendingDown, DollarSign, Brain, BarChart4, 
  ArrowRight, Sparkles, CheckCircle, Info, Loader2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ResultsPanel() {
  const { 
    inputText, images, files, selectedModel, 
    estimation, setEstimation, isLoading, setLoading 
  } = useCalculatorStore();

  const handleEstimate = async () => {
    setLoading(true);
    const content = `${inputText} ${files.map(f => f.name).join(' ')}`;
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setEstimation(data);
    } catch (error) {
      console.error("Estimation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const inputTokens = countTokens(inputText) + 
    images.reduce((acc, img) => acc + img.tokens, 0) + 
    files.reduce((acc, f) => acc + f.tokens, 0);

  const outputTokens = estimation?.estimated_output_tokens || 0;
  
  const cost: CostBreakdown | null = selectedModel 
    ? calculateCost(inputTokens, outputTokens, selectedModel)
    : null;

  if (!selectedModel) return null;

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-110" />
        
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-primary animate-pulse" size={20} />
                Cost Breakdown
              </CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                Using {selectedModel.name}
              </CardDescription>
            </div>
            {!estimation && (
              <button 
                onClick={handleEstimate}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
                Run AI Estimate
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground tracking-widest">
                <TrendingDown className="text-emerald-500" size={14} />
                Input Tokens
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center group/item">
                  <span className="text-xs text-muted-foreground font-medium transition-colors group-hover/item:text-foreground">Text Content</span>
                  <span className="text-sm font-mono font-bold">{countTokens(inputText).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-xs text-muted-foreground font-medium transition-colors group-hover/item:text-foreground">Images ({images.length})</span>
                  <span className="text-sm font-mono font-bold">{images.reduce((acc, img) => acc + img.tokens, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-xs text-muted-foreground font-medium transition-colors group-hover/item:text-foreground">Files ({files.length})</span>
                  <span className="text-sm font-mono font-bold">{files.reduce((acc, f) => acc + f.tokens, 0).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground">Total Input</span>
                  <span className="text-base font-mono font-black text-emerald-500">{inputTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground tracking-widest">
                <TrendingUp className="text-amber-500" size={14} />
                Output Estimate
              </div>
              {estimation ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Estimated</span>
                    <span className="text-sm font-mono font-bold">{estimation.estimated_output_tokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Range</span>
                    <span className="text-xs font-mono font-semibold">{estimation.output_token_range.min.toLocaleString()} - {estimation.output_token_range.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Complexity</span>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0 border-none ${
                      estimation.complexity === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
                      estimation.complexity === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                      estimation.complexity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {estimation.complexity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Predicted Total</span>
                    <span className="text-base font-mono font-black text-amber-500">{outputTokens.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-6 bg-muted/30 rounded-lg border border-dashed border-border group/btn cursor-pointer" onClick={handleEstimate}>
                  <Brain className="text-muted-foreground group-hover/btn:text-primary transition-all group-hover/btn:scale-110" size={24} />
                  <p className="text-[10px] text-muted-foreground font-bold text-center px-4">Run AI Estimation for more accurate output prediction</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground tracking-widest">
                <DollarSign className="text-primary" size={14} />
                Estimated Cost
              </div>
              {cost && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Input Cost</span>
                    <span className="text-sm font-mono font-bold">${cost.inputCost.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Output Cost</span>
                    <span className="text-sm font-mono font-bold">${cost.outputCost.toFixed(4)}</span>
                  </div>
                  <div className="pt-2 border-t border-border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">Total Cost</span>
                      <div className="text-right">
                        <div className="text-2xl font-mono font-black text-primary leading-none">${cost.totalCost.toFixed(4)}</div>
                        {cost.totalCost < 0.001 && (
                          <div className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter mt-1 animate-bounce">
                            💸 UNDER $0.001!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {estimation?.reasoning && (
            <div className="mt-4 p-4 bg-muted/50 border border-border rounded-xl flex gap-3">
              <div className="mt-0.5">
                <Info size={16} className="text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">AI Reasoning</p>
                <p className="text-xs text-foreground font-medium leading-relaxed italic">"{estimation.reasoning}"</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">1k Requests/mo</p>
              <p className="text-lg font-mono font-black text-foreground">${cost?.monthlyEstimate1k.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">10k Requests/mo</p>
              <p className="text-lg font-mono font-black text-foreground">${cost?.monthlyEstimate10k.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
