"use client";

import React from "react";
import { BarChart3, ArrowRightLeft, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MODEL_COMPARISONS = [
  { name: "GPT-4o", inputCost: 2.5, outputCost: 10, speed: "Fast", quality: "Excellent", bestFor: "General Purpose" },
  { name: "Claude 3.5 Sonnet", inputCost: 3.0, outputCost: 15, speed: "Medium", quality: "Excellent", bestFor: "Reasoning & Analysis" },
  { name: "Gemini 1.5 Pro", inputCost: 1.25, outputCost: 5, speed: "Fast", quality: "Good", bestFor: "Long Context" },
  { name: "GPT-4 Turbo", inputCost: 10.0, outputCost: 30, speed: "Slow", quality: "Excellent", bestFor: "Complex Tasks" },
  { name: "Claude 3 Opus", inputCost: 15.0, outputCost: 75, speed: "Slow", quality: "Best", bestFor: "Complex Reasoning" },
];

export default function ComparePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
            Model <span className="text-primary">Comparison</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Compare pricing, speed, and quality across different AI models
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cheapest Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingDown className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-lg font-black text-white">Gemini 1.5 Pro</p>
                <p className="text-xs text-muted-foreground">$1.25/1M input tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fastest Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Zap className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-lg font-black text-white">GPT-4o / Gemini</p>
                <p className="text-xs text-muted-foreground">~50 tokens/sec</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Best Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-lg font-black text-white">Claude 3 Opus</p>
                <p className="text-xs text-muted-foreground">Highest reasoning scores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Model</th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Input ($/M)</th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Output ($/M)</th>
                  <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Speed</th>
                  <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Quality</th>
                  <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Best For</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_COMPARISONS.map((model) => (
                  <tr key={model.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-foreground">{model.name}</p>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-sm text-foreground">${model.inputCost}</td>
                    <td className="py-4 px-4 text-right font-mono text-sm text-foreground">${model.outputCost}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant="outline" className="text-xs">
                        {model.speed}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                        {model.quality}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{model.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
