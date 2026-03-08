"use client";

import React from "react";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { calculateCost } from "@/lib/costCalculator";
import { countTokens } from "@/lib/tokenizer";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "#74AA9C",
  Anthropic: "#CC785C",
  Google: "#4285F4",
  Meta: "#0668E1",
  xAI: "#FFFFFF",
  DeepSeek: "#4D6FFF",
  Mistral: "#FF7000",
  Alibaba: "#FF6A00",
};

export function CostChart() {
  const { allModels, inputText, images, files, estimation } = useCalculatorStore();

  const inputTokens = countTokens(inputText) + 
    images.reduce((acc, img) => acc + img.tokens, 0) + 
    files.reduce((acc, f) => acc + f.tokens, 0);

  const outputTokens = estimation?.estimated_output_tokens || 500;

  const chartData = allModels.slice(0, 15).map(model => {
    const { totalCost, inputCost, outputCost } = calculateCost(inputTokens, outputTokens, model);
    return {
      name: model.name,
      provider: model.provider,
      totalCost,
      inputCost,
      outputCost,
      color: PROVIDER_COLORS[model.provider] || "#3B82F6"
    };
  }).sort((a, b) => a.totalCost - b.totalCost);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.provider}</p>
          <p className="text-sm font-bold text-foreground mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-6">
              <span className="text-[10px] font-bold uppercase text-emerald-500">Input</span>
              <span className="text-xs font-mono font-bold text-foreground">${payload[0].payload.inputCost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-[10px] font-bold uppercase text-amber-500">Output</span>
              <span className="text-xs font-mono font-bold text-foreground">${payload[0].payload.outputCost.toFixed(4)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-center gap-6">
              <span className="text-xs font-black uppercase text-primary">Total</span>
              <span className="text-sm font-mono font-black text-primary">${payload[0].payload.totalCost.toFixed(4)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border rounded-xl shadow-lg h-[500px]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Top Models Comparison</h2>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 bg-muted rounded">
          Sorted by total cost
        </div>
      </div>
      
      <div className="h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#9ca3af" 
              fontSize={10} 
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#9ca3af" 
              fontSize={10} 
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar 
              dataKey="totalCost" 
              radius={[0, 4, 4, 0]}
              barSize={20}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {Object.entries(PROVIDER_COLORS).slice(0, 4).map(([provider, color]) => (
          <div key={provider} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{provider}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
