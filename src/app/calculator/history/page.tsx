"use client";

import React, { useEffect, useState } from "react";
import { History as HistoryIcon, Trash2, Download, Filter, Search, Calendar, Loader2, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Calculation {
    id: string;
    model_id: string;
    model_name: string;
    provider: string;
    input_tokens: number;
    output_tokens: number;
    requests_per_day: number;
    input_cost: number;
    output_cost: number;
    total_cost: number;
    daily_cost: number | null;
    monthly_cost: number | null;
    created_at: string;
}

export default function HistoryPage() {
    const [calculations, setCalculations] = useState<Calculation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            
            // Check if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
            
            setIsAuthenticated(true);
            
            // Fetch calculations
            const response = await fetch('/api/calculations');
            if (response.ok) {
                const data = await response.json();
                setCalculations(data.calculations || []);
            }
            
            setIsLoading(false);
        }
        
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/calculations?id=${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setCalculations(prev => prev.filter(calc => calc.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete calculation:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatCost = (cost: number) => {
        if (cost < 0.01) {
            return `$${cost.toFixed(6)}`;
        }
        return `$${cost.toFixed(4)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filteredCalculations = calculations.filter(calc => 
        calc.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <header className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <HistoryIcon size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">
                            Calculation <span className="text-primary">History</span>
                        </h2>
                    </div>
                </header>
                
                <Card className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                        <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Sign in to view history</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your calculation history will be saved when you sign in.
                        </p>
                        <Link 
                            href="/auth/login"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <LogIn size={16} />
                            Sign In
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <HistoryIcon size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">
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
                        placeholder="Search by model or provider..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

            {filteredCalculations.length === 0 ? (
                <Card className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                        <HistoryIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-bold text-foreground mb-2">No calculations yet</h3>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery 
                                ? "No calculations match your search."
                                : "Start calculating token costs to see your history here."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredCalculations.map((item) => (
                        <Card key={item.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <HistoryIcon className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{item.model_name}</p>
                                            <p className="text-xs text-muted-foreground">{item.provider} &bull; {formatDate(item.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Input</p>
                                            <p className="text-sm font-mono font-bold text-foreground">{item.input_tokens.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Output</p>
                                            <p className="text-sm font-mono font-bold text-foreground">{item.output_tokens.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Cost</p>
                                            <p className="text-sm font-mono font-bold text-primary">{formatCost(item.total_cost)}</p>
                                        </div>
                                        {item.monthly_cost && (
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Monthly</p>
                                                <p className="text-sm font-mono font-bold text-accent">{formatCost(item.monthly_cost)}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                                <Download size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === item.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
