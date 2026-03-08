"use client";

import React from "react";
import { InputPanel } from "@/components/calculator/InputPanel";
import { ResultsPanel } from "@/components/calculator/ResultsPanel";
import { ModelSelector } from "@/components/calculator/ModelSelector";
import { CostChart } from "@/components/calculator/CostChart";
import { ComparisonTable } from "@/components/calculator/ComparisonTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Table as TableIcon, BarChart3, Info, Sparkles, BrainCircuit } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Page Header */}
      <header className="space-y-3 relative group">
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-inner">
            <Calculator size={24} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            Token Cost <span className="text-primary">Simulator</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Input your prompt text, images, or documents and simulate precise token costs across <span className="text-primary font-bold">40+ frontier AI models</span>. Use AI-powered estimation for highly accurate output predictions.
        </p>
      </header>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Models Tracked</p>
          <p className="text-2xl font-black text-white font-mono">42 <span className="text-xs text-primary">+2 NEW</span></p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Cheapest Frontier</p>
          <p className="text-2xl font-black text-white font-mono">GPT-4o Mini</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Avg Accuracy</p>
          <p className="text-2xl font-black text-white font-mono">98.4%</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-center bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Estimation Mode</p>
          <p className="text-2xl font-black text-white flex items-center gap-2">
            AI-Enhanced <BrainCircuit className="text-primary" size={18} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-8 space-y-8">
          <InputPanel />
          <ResultsPanel />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                Cost Visualization
              </h3>
            </div>
            <CostChart />
          </div>
        </div>

        {/* Right Column: Model Selection & Analysis */}
        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          <ModelSelector />
          
          <div className="p-6 bg-muted/20 border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Info size={16} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white">How it works</h4>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Enter your content or upload files. We count tokens client-side using <span className="text-foreground font-bold">tiktoken</span>.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Select a model. We apply real-time pricing from our global database.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Run <span className="text-foreground font-bold">AI Estimate</span> to predict output tokens based on task complexity.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Comparison Matrix Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-inner">
              <TableIcon size={24} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Global <span className="text-primary">Comparison</span> Matrix
            </h2>
          </div>
        </div>
        <ComparisonTable />
      </section>

      {/* Footer Info */}
      <footer className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase">Pricing Updated: Mar 2026</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <p className="text-[10px] font-bold uppercase">42 Models Tracked</p>
        </div>
        <p className="text-[10px] font-medium italic">
          Disclaimer: Actual tokenization may vary slightly by model. Prices subject to provider change.
        </p>
      </footer>
    </div>
  );
}
