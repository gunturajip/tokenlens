"use client";

import React from "react";
import Link from "next/link";
import {
  Zap, ArrowRight, BrainCircuit, Sparkles,
  CheckCircle2, Globe, Shield, Rocket,
  Menu, X, Play, Calculator, Layers, Cpu, Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Zap className="text-primary-foreground" size={20} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              Token<span className="text-primary">Lens</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Features</Link>
            <Link href="#models" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Models</Link>
            <Link href="#pricing" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">Pricing</Link>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Link href="/auth" className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-black uppercase rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 group">
              Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] pt-24 px-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            <Link href="#features" className="text-xl font-black uppercase tracking-tighter text-white">Features</Link>
            <Link href="#models" className="text-xl font-black uppercase tracking-tighter text-white">Models</Link>
            <Link href="#pricing" className="text-xl font-black uppercase tracking-tighter text-white">Pricing</Link>
            <Link href="/auth" className="w-full py-4 bg-primary text-primary-foreground text-lg font-black uppercase rounded-2xl text-center">Get Started</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="text-primary" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Now tracking 42+ AI Models</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Know your AI costs <span className="text-primary">before</span> you build.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            The world's most accurate token cost simulator. Predict, analyze, and optimize your LLM spend across 40+ frontier models with AI-powered estimation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/auth" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground text-lg font-black uppercase rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-3 group">
              Launch Simulator <Rocket size={20} className="group-hover:-translate-y-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white text-lg font-black uppercase rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Play size={20} /> Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-white font-mono">1.2M+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tokens Simulated</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-white font-mono">42</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Models</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-white font-mono">98.4%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cost Accuracy</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-white font-mono">15k</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Powerful Intelligence</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Everything you need to optimize AI spend.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-6 hover:bg-white/[0.07] transition-all group">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary w-fit group-hover:scale-110 transition-transform">
                <BrainCircuit size={32} />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight">AI-Powered Estimation</h4>
              <p className="text-muted-foreground font-medium leading-relaxed">Our proprietary Claude-powered engine predicts likely output tokens based on your specific task complexity and data.</p>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-6 hover:bg-white/[0.07] transition-all group">
              <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500 w-fit group-hover:scale-110 transition-transform">
                <Layers size={32} />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight">Multimodal Analysis</h4>
              <p className="text-muted-foreground font-medium leading-relaxed">Support for high-precision image tokenization and document parsing (PDF, DOCX, CSV) directly in your browser.</p>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-6 hover:bg-white/[0.07] transition-all group">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 w-fit group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight">Global Price Matrix</h4>
              <p className="text-muted-foreground font-medium leading-relaxed">Side-by-side cost comparison across OpenAI, Anthropic, Google, Meta, and deep-budget open source providers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Model Grid Section */}
      <section id="models" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-primary">Extensive Coverage</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">All your favorite <br /> models in one place.</h3>
            </div>
            <Link href="/auth" className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-4 transition-all">
              View Comparison Matrix <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['GPT-4o', 'Claude Opus', 'Gemini Pro', 'Llama 4', 'DeepSeek V3', 'Mistral Large', 'Grok 4', 'Qwen 2.5', 'Command R+', 'Phi-4', 'Gemma 3', 'GLM-4'].map((model) => (
              <div key={model} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-center hover:bg-white/10 transition-all cursor-default group">
                <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">{model}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Simple Pricing</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Choose your plan</h3>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-sm text-muted-foreground">Perfect for trying things out</p>
              </div>
              <div>
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> 5 uses/day
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> All 42+ models
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Basic estimation
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> History (7 days)
                </li>
              </ul>
              <Link href="/auth" className="w-full py-3 border border-white/20 text-white font-bold rounded-xl text-center hover:bg-white/10 transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-primary/10 border border-primary/30 rounded-3xl space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-black uppercase rounded-full">
                Most Popular
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Pro</h4>
                <p className="text-sm text-muted-foreground">For developers & small teams</p>
              </div>
              <div>
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> 100 uses/day
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> All 42+ models
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> AI-enhanced estimation
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> History (90 days)
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> File upload (PDF, DOCX)
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Export results
                </li>
              </ul>
              <Link href="/auth" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-center hover:bg-primary/90 transition-all">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Enterprise</h4>
                <p className="text-sm text-muted-foreground">For organizations at scale</p>
              </div>
              <div>
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Unlimited uses
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> All 42+ models
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Priority API access
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Unlimited history
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Team collaboration
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Custom integrations
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary" size={16} /> Dedicated support
                </li>
              </ul>
              <Link href="#" className="w-full py-3 border border-white/20 text-white font-bold rounded-xl text-center hover:bg-white/10 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">
            Stop guessing. <br /> Start <span className="text-primary">calculating</span>.
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            Join 5,000+ developers and businesses saving an average of 35% on AI token costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth" className="px-12 py-6 bg-primary text-primary-foreground text-xl font-black uppercase rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3">
              Get Started for Free <Rocket size={24} />
            </Link>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No credit card required • 5 free uses per day</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Zap className="text-primary-foreground" size={20} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">
                Token<span className="text-primary">Lens</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium max-w-xs leading-relaxed">
              Empowering developers to build cost-efficient AI applications with precision token simulation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Product</h5>
              <ul className="space-y-2">
                <li><Link href="/calculator" className="text-xs text-muted-foreground hover:text-primary transition-colors">Simulator</Link></li>
                <li><Link href="#features" className="text-xs text-muted-foreground hover:text-primary transition-colors">AI Estimation</Link></li>
                <li><Link href="#models" className="text-xs text-muted-foreground hover:text-primary transition-colors">API Directory</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Legal</h5>
              <ul className="space-y-2">
                <li><Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Company</h5>
              <ul className="space-y-2">
                <li><Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">© 2026 TokenLens SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Shield size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Code size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Globe size={20} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
