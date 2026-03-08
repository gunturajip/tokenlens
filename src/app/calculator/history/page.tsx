"use client";

import React from "react";
import { History as HistoryIcon, Trash2, Download, Filter, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_HISTORY = [
    { id: 1, date: "2026-03-08", model: "GPT-4o", tokens: 12500, cost: "$0.0375", type: "Text Analysis" },
    { id: 2, date: "2026-03-07", model: "Claude 3.5 Sonnet", tokens: 8200, cost: "$0.0246", type: "Code Review" },
    { id: 3, date: "2026-03-07", model: "Gemini 1.5 Pro", tokens: 15000, cost: "$0.0150", type: "Document Summary" },
    { id: 4, date: "2026-03-06", model: "GPT-4 Turbo", tokens: 5600, cost: "$0.0308", type: "Translation" },
    { id: 5, date: "2026-03-05", model: "Claude 3 Opus", tokens: 22000, cost: "$0.1320", type: "Complex Reasoning" },
];

export default function HistoryPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <HistoryIcon size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                        Calculation <span className="text-primary">History</span>
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                    View and manage your past token cost calculations
                </p>
            </header>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search history..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Filter size={16} />
                    Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Calendar size={16} />
                    Date Range
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_HISTORY.map((item) => (
                    <Card key={item.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <HistoryIcon className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{item.type}</p>
                                        <p className="text-xs text-muted-foreground">{item.model} • {item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Tokens</p>
                                        <p className="text-sm font-mono font-bold text-foreground">{item.tokens.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Cost</p>
                                        <p className="text-sm font-mono font-bold text-primary">{item.cost}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                            <Download size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
