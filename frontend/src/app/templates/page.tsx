"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { UploadCloud, FileText, Loader2, Trash2 } from "lucide-react";

type TemplateFile = {
  name: string;
  id: string | null;
  created_at: string | null;
  size: number;
};

export default function TemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TemplateFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("user_templates")
      .list(`${user?.id}/`);
      
    if (error) {
      console.error("Error loading templates:", error);
    } else {
      // Filter out standard placeholder if present
      const files = data.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => ({
        name: f.name,
        id: f.id,
        created_at: f.created_at,
        size: f.metadata?.size || 0
      }));
      setTemplates(files);
    }
    setLoading(false);
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    if (!file.name.endsWith(".docx")) {
      alert("Only .docx files are supported for templates.");
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${file.name}`;
    
    const { error } = await supabase.storage
      .from("user_templates")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      alert("Failed to upload template.");
    } else {
      await loadTemplates();
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    const { error } = await supabase.storage
      .from("user_templates")
      .remove([`${user.id}/${fileName}`]);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete template.");
    } else {
      await loadTemplates();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Templates
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your DOCX templates for CVs and cover letters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-8 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-surface flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
              {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-1">
              Upload Template
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Select a .docx file to use as a base for your generations.
            </p>
            <input 
              type="file" 
              accept=".docx" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUpload(e.target.files[0]);
                }
              }}
            />
            <button 
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="relative px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Browse Files'}
            </button>
          </div>
        </div>

        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            Your Templates
          </h2>
          
          <div className="space-y-3">
            {loading ? (
              <div className="p-8 flex justify-center text-brand-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface text-center text-slate-500 dark:text-zinc-400 text-sm">
                No templates uploaded yet.
              </div>
            ) : (
              templates.map((template) => (
                <div 
                  key={template.name} 
                  className="group p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface flex items-center justify-between transition-all hover:border-brand-300 dark:hover:border-brand-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        {template.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {formatBytes(template.size)} • Uploaded {template.created_at ? new Date(template.created_at).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(template.name)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
