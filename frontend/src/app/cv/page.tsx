"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { UploadCloud, FileText, ArrowLeft, Loader2, Briefcase, FileOutput, CheckCircle2 } from "lucide-react";

export default function CVPage() {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedSections, setParsedSections] = useState<Record<string, string> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [format, setFormat] = useState<'docx' | 'pdf'>('docx');
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    const { data, error } = await supabase.storage.from("user_templates").list(`${user?.id}/`);
    if (!error && data) {
      const files = data.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => f.name);
      setTemplates(files);
      if (files.length > 0) setSelectedTemplate(files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.md')) {
      alert("Please upload a Markdown (.md) file.");
      return;
    }
    
    setFile(selectedFile);
    setIsUploading(true);
    setParsedSections(null);
    
    try {
      // Auto-extract job title and company from the md structure
      const fileText = await selectedFile.text();
      const titleMatch = fileText.match(/\*\*Application for (.*?)\*\*/i) || fileText.match(/Application for (.*)/i);
      if (titleMatch) setJobTitle(titleMatch[1].trim());
      else setJobTitle("Target Role");
      
      const lines = fileText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('*'));
      if (lines.length > 0) setCompany(lines[0]);
      else setCompany("Target Company");

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

  const handleGenerate = async () => {
    if (!file || !user) return;
    if (!selectedTemplate) {
      alert("Please select a template.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("doc_type", "cv");
      formData.append("format", format);
      formData.append("user_id", user.id);
      formData.append("template_name", selectedTemplate);
      formData.append("job_title", jobTitle);
      formData.append("company", company);

      const res = await fetch("/api/generate", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) throw new Error("Failed to generate CV");
      
      // Handle binary blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Generated_CV_${company.replace(/\s+/g, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error(err);
      alert("Error generating CV");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setParsedSections(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-brand-500" />
          Create CV
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Provide job details and upload your markdown file to generate a tailored CV.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        
        {/* Step 1: Details */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface">
          <div className="space-y-1.5 max-w-md mx-auto">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">Base Template *</label>
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
            >
              <option value="" disabled>Select a template</option>
              {templates.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: File Upload */}
        {!file && !isUploading && (
          <div
            className={`relative group flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-2xl transition-all duration-200 bg-surface ${
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
            
            <div className="w-20 h-20 mb-6 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
              Upload CV Content
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8 text-center max-w-md">
              Drag and drop your markdown (.md) file containing your experience tailored to the specific job.
            </p>
            
            <input 
              type="file" 
              accept=".md" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
              }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="relative px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Browse Files
            </button>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center p-24 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-surface">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-zinc-400 font-medium text-lg">Parsing Content...</p>
          </div>
        )}

        {file && parsedSections && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={resetFlow}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    {file.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Content ready
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg shrink-0">
                  <button
                    onClick={() => setFormat('docx')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${format === 'docx' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                  >
                    DOCX
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${format === 'pdf' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                  >
                    PDF
                  </button>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedTemplate}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all shadow-sm disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileOutput className="w-4 h-4" />}
                  Generate
                </button>
              </div>
            </div>

            {/* Parsed Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface overflow-hidden">
              <div className="bg-slate-50 dark:bg-zinc-900/50 px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Parsed Content Preview</h3>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto space-y-6">
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
          </div>
        )}
      </div>
    </div>
  );
}
