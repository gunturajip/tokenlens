"use client";

import React, { useMemo, useState } from "react";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { calculateCost } from "@/lib/costCalculator";
import { countTokens } from "@/lib/tokenizer";
import { LLMModel } from "@/types";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, ChevronDown, CheckCircle, Info, Download, Trash2 } from "lucide-react";

export function ComparisonTable() {
  const { allModels, inputText, images, files, estimation, selectedModel, setSelectedModel } = useCalculatorStore();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'totalCost', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState("");

  const inputTokens = countTokens(inputText) + 
    images.reduce((acc, img) => acc + img.tokens, 0) + 
    files.reduce((acc, f) => acc + f.tokens, 0);

  const outputTokens = estimation?.estimated_output_tokens || 500; // Fallback for table comparison

  const tableData = useMemo(() => {
    return allModels.map(model => {
      const cost = calculateCost(inputTokens, outputTokens, model);
      return {
        ...model,
        ...cost
      };
    }).filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      model.provider.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [allModels, inputTokens, outputTokens, sortConfig, searchTerm]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getCostColor = (totalCost: number) => {
    if (totalCost < 0.01) return "text-emerald-500 font-bold";
    if (totalCost < 0.10) return "text-yellow-500 font-bold";
    if (totalCost < 1.00) return "text-orange-500 font-bold";
    return "text-rose-500 font-bold";
  };

  const handleExportCSV = () => {
    const headers = ["Rank", "Provider", "Model Name", "Input Cost", "Output Cost", "Total Cost"];
    const rows = tableData.map(m => [
      m.rank, m.provider, m.name, m.inputCost.toFixed(4), m.outputCost.toFixed(4), m.totalCost.toFixed(4)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tokenlens_comparison.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Model Comparison Matrix
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
            Based on {inputTokens.toLocaleString()} input / {outputTokens.toLocaleString()} predicted output
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Filter by name/provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground border border-border rounded-lg text-sm font-bold transition-all"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-background/50">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar relative">
          <Table>
            <TableHeader className="bg-muted/80 backdrop-blur sticky top-0 z-20">
              <TableRow>
                <TableHead className="w-[80px] font-bold text-xs uppercase tracking-widest text-muted-foreground">Rank</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Provider</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground min-w-[200px]">Model Name</TableHead>
                <TableHead 
                  className="font-bold text-xs uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort('inputCost')}
                >
                  <div className="flex items-center justify-end gap-1">Input Cost <ArrowUpDown size={12} /></div>
                </TableHead>
                <TableHead 
                  className="font-bold text-xs uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort('outputCost')}
                >
                  <div className="flex items-center justify-end gap-1">Output Cost <ArrowUpDown size={12} /></div>
                </TableHead>
                <TableHead 
                  className="font-bold text-xs uppercase tracking-widest text-primary text-right cursor-pointer hover:text-primary-foreground transition-colors"
                  onClick={() => requestSort('totalCost')}
                >
                  <div className="flex items-center justify-end gap-1 font-black">Total Cost <ArrowUpDown size={12} /></div>
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((model) => (
                <TableRow 
                  key={model.id}
                  className={`group transition-colors ${selectedModel?.id === model.id ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"}`}
                >
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground">#{model.rank}</TableCell>
                  <TableCell className="font-bold text-[10px] uppercase tracking-tighter text-muted-foreground">{model.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{model.name}</span>
                      {model.is_reasoning_model && (
                        <Badge variant="secondary" className="text-[8px] font-black px-1 py-0 bg-purple-500/10 text-purple-500 border-none">R</Badge>
                      )}
                      {model.supports_vision && (
                        <Badge variant="secondary" className="text-[8px] font-black px-1 py-0 bg-blue-500/10 text-blue-500 border-none">V</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground">${model.inputCost.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground">${model.outputCost.toFixed(4)}</TableCell>
                  <TableCell className={`text-right font-mono text-sm ${getCostColor(model.totalCost)}`}>
                    ${model.totalCost.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${selectedModel?.id === model.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100"}`}
                    >
                      {selectedModel?.id === model.id ? "Selected" : "Use"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex gap-4 p-4 bg-muted/20 border border-border rounded-lg">
        <div className="p-2 bg-background border border-border rounded">
          <Info size={16} className="text-primary" />
        </div>
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
          Cost estimation assumes standard pricing. Large batch discounts or specialized usage (e.g. prompt caching) are not reflected here. Actual token counts for specific providers may vary.
        </p>
      </div>
    </div>
  );
}
