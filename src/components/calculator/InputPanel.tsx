"use client";

import React, { useCallback, useRef } from "react";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { countTokens } from "@/lib/tokenizer";
import { estimateImageTokens } from "@/lib/costCalculator";
import { FileUp, Image as ImageIcon, X, Trash2, FileText, Loader2 } from "lucide-react";

export function InputPanel() {
  const { 
    inputText, setInputText, 
    images, addImage, removeImage, 
    files, addFile, removeFile, 
    clearAll, selectedModel 
  } = useCalculatorStore();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const tokens = estimateImageTokens(img.width, img.height, selectedModel?.provider || 'OpenAI');
          addImage({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            tokens,
            preview: event.target?.result as string,
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    for (const file of Array.from(uploadedFiles)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/parse-file', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        addFile({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          tokens: data.tokens,
          type: file.type,
        });
      } catch (error) {
        console.error("File upload failed", error);
      }
    }
  };

  const totalTokens = countTokens(inputText) + 
    images.reduce((acc, img) => acc + img.tokens, 0) + 
    files.reduce((acc, f) => acc + f.tokens, 0);

  return (
    <div className="space-y-6 p-6 bg-card border border-border rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Input Analysis</h2>
        <button 
          onClick={clearAll}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Prompt Text</label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="Type or paste your prompt here..."
            className="w-full min-h-[200px] p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground transition-all"
          />
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded text-xs font-mono text-muted-foreground">
            {countTokens(inputText).toLocaleString()} tokens
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => imageInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Add Images</span>
          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <FileUp className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Add Files</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.docx,.txt,.csv,.md" 
            multiple 
            className="hidden" 
          />
        </button>
      </div>

      {(images.length > 0 || files.length > 0) && (
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">Multimodal Assets</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted/50 p-2">
                <img src={img.preview} alt={img.name} className="w-full h-20 object-cover rounded-md mb-2" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[60%]">{img.name}</span>
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">
                    {img.tokens}
                  </span>
                </div>
                <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-destructive/80 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {files.map((file) => (
              <div key={file.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted/50 p-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-primary" size={16} />
                  <span className="text-[10px] font-mono text-muted-foreground truncate">{file.name}</span>
                </div>
                <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-bold self-start">
                  {file.tokens.toLocaleString()} tokens
                </span>
                <button 
                  onClick={() => removeFile(file.id)}
                  className="absolute top-1 right-1 p-1 bg-destructive/80 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border flex justify-between items-center">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Input Tokens</div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {totalTokens.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
