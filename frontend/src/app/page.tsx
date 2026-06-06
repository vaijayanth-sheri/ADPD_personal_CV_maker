"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, ChevronRight, FileOutput, FilePlus, ChevronDown, CheckCircle2, Loader2, Download, ArrowLeft } from "lucide-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedSections, setParsedSections] = useState<Record<string, string> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.md')) {
      alert("Please upload a Markdown (.md) file.");
      return;
    }
    
    setFile(selectedFile);
    setIsUploading(true);
    setParsedSections(null);
    setDownloadUrl(null);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/parse-markdown", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to parse markdown");
      const data = await res.json();
      setParsedSections(data.parsed_sections || {});
    } catch (err) {
      console.error(err);
      alert("Error parsing markdown file. Check console for details.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async (docType: 'cv' | 'cover_letter') => {
    if (!file) return;
    setIsGenerating(docType);
    setDownloadUrl(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", docType);
      const res = await fetch("/api/generate", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to generate document");
      const data = await res.json();
      setDownloadUrl(data.download_url);
    } catch (err) {
      console.error(err);
      alert("Error generating document");
    } finally {
      setIsGenerating(null);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setParsedSections(null);
    setDownloadUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Upload content and generate personalized documents.
        </p>
      </div>

      {/* Main Action Area */}
      <div className="max-w-4xl mx-auto mt-8">
        
        {/* Main Column: Upload or Preview */}
        <div className="space-y-4">
          
          {!file && !isUploading && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                  New Personalization
                </h2>
              </div>
              
              <div
                className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-200 bg-surface ${
                  isDragging
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-slate-300 dark:border-zinc-700 hover:border-brand-400 dark:hover:border-brand-500"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                
                <div className="w-16 h-16 mb-4 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-1">
                  Upload Custom Content
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 text-center max-w-sm">
                  Upload a markdown (.md) file with custom job specific content to merge with your templates.
                </p>
                
                <input 
                  type="file" 
                  accept=".md" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                >
                  Browse Files
                </button>
              </div>
            </>
          )}

          {isUploading && (
            <div className="flex flex-col items-center justify-center p-24 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-surface">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-zinc-400 font-medium">Parsing Markdown...</p>
            </div>
          )}

          {file && parsedSections && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={resetFlow}
                    className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-500" />
                    {file.name}
                  </h2>
                </div>
              </div>

              {/* Parsed Preview */}
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface overflow-hidden">
                <div className="bg-slate-50 dark:bg-zinc-900/50 px-6 py-3 border-b border-slate-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Parsed Sections Preview</h3>
                </div>
                <div className="p-6 max-h-[400px] overflow-y-auto space-y-6">
                  {Object.entries(parsedSections).length === 0 && (
                    <p className="text-slate-500 dark:text-zinc-400 italic">No sections could be parsed from the file.</p>
                  )}
                  {Object.entries(parsedSections).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-2 uppercase tracking-wide">{key}</h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 whitespace-pre-wrap bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                        {value as string}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generation Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleGenerate('cv')}
                  disabled={isGenerating !== null}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-500 dark:hover:border-brand-500 transition-all font-medium text-slate-700 dark:text-zinc-200 disabled:opacity-50"
                >
                  {isGenerating === 'cv' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileOutput className="w-5 h-5 text-brand-500" />}
                  {isGenerating === 'cv' ? 'Generating CV...' : 'Generate CV'}
                </button>
                <button 
                  onClick={() => handleGenerate('cover_letter')}
                  disabled={isGenerating !== null}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-500 dark:hover:border-brand-500 transition-all font-medium text-slate-700 dark:text-zinc-200 disabled:opacity-50"
                >
                  {isGenerating === 'cover_letter' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FilePlus className="w-5 h-5 text-brand-500" />}
                  {isGenerating === 'cover_letter' ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
                </button>
              </div>

              {downloadUrl && (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-emerald-900 dark:text-emerald-100 font-semibold mb-1">Generation Complete!</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mb-4">Your document is ready to download.</p>
                  <a 
                    href={downloadUrl} 
                    download
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
