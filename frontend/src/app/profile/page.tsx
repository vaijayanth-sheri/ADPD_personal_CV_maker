"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { User, Sparkles, FolderOpen, Briefcase, Plus, Loader2, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingExp, setLoadingExp] = useState(true);
  const [loadingProj, setLoadingProj] = useState(true);

  // New Experience State
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', role: '', start_date: '', end_date: '', description: '' });
  const [addingExp, setAddingExp] = useState(false);

  // New Project State
  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', role: '', tech_stack: '', description: '' });
  const [addingProj, setAddingProj] = useState(false);

  useEffect(() => {
    if (user) {
      loadExperiences();
      loadProjects();
    }
  }, [user]);

  const loadExperiences = async () => {
    setLoadingExp(true);
    const { data } = await supabase.from('experiences').select('*').eq('user_id', user?.id).order('start_date', { ascending: false });
    if (data) setExperiences(data);
    setLoadingExp(false);
  };

  const loadProjects = async () => {
    setLoadingProj(true);
    const { data } = await supabase.from('projects').select('*').eq('user_id', user?.id).order('id', { ascending: false });
    if (data) setProjects(data);
    setLoadingProj(false);
  };

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddingExp(true);
    const { error } = await supabase.from('experiences').insert({ ...newExp, user_id: user.id });
    if (!error) {
      setShowAddExp(false);
      setNewExp({ company: '', role: '', start_date: '', end_date: '', description: '' });
      loadExperiences();
    } else {
      alert("Failed to add experience");
    }
    setAddingExp(false);
  };

  const handleAddProj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddingProj(true);
    const { error } = await supabase.from('projects').insert({ ...newProj, user_id: user.id });
    if (!error) {
      setShowAddProj(false);
      setNewProj({ title: '', role: '', tech_stack: '', description: '' });
      loadProjects();
    } else {
      alert("Failed to add project");
    }
    setAddingProj(false);
  };

  const deleteExp = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await supabase.from('experiences').delete().eq('id', id);
    loadExperiences();
  };

  const deleteProj = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-brand-500" />
          Your Profile
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your personal details and content libraries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* User Information Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 ring-4 ring-white dark:ring-zinc-950 shadow-sm">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {user?.email?.split('@')[0] || "User"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                {user?.email}
              </p>
            </div>
            
            <hr className="my-6 border-slate-200 dark:border-zinc-800" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-zinc-400">Account Type</span>
                <span className="font-medium text-slate-900 dark:text-zinc-100">Standard</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-zinc-400">Joined</span>
                <span className="font-medium text-slate-900 dark:text-zinc-100">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Libraries */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Experience Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-500" />
                Experience Library
              </h3>
              <button 
                onClick={() => setShowAddExp(!showAddExp)}
                className="p-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {showAddExp ? 'Cancel' : 'Add Entry'}
              </button>
            </div>
            
            {showAddExp && (
              <form onSubmit={handleAddExp} className="p-5 rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Company</label>
                    <input required value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Role</label>
                    <input required value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. Software Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Start Date</label>
                    <input type="month" required value={newExp.start_date} onChange={e => setNewExp({...newExp, start_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">End Date</label>
                    <input type="month" value={newExp.end_date} onChange={e => setNewExp({...newExp, end_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="Leave empty if current" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Description</label>
                  <textarea required value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500 resize-none" placeholder="Describe your responsibilities..."></textarea>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={addingExp} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70">
                    {addingExp && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Experience
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4">
              {loadingExp ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
              ) : experiences.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 text-center text-slate-500 dark:text-zinc-400 text-sm bg-surface">
                  You haven't added any experiences yet.
                </div>
              ) : (
                experiences.map(exp => (
                  <div key={exp.id} className="group p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-300 dark:hover:border-brand-700 transition-colors relative">
                    <button onClick={() => deleteExp(exp.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <h4 className="font-semibold text-slate-900 dark:text-zinc-100">{exp.role}</h4>
                      <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md shrink-0">
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 mb-3">{exp.company}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Project Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-brand-500" />
                Project Library
              </h3>
              <button 
                onClick={() => setShowAddProj(!showAddProj)}
                className="p-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {showAddProj ? 'Cancel' : 'Add Project'}
              </button>
            </div>
            
            {showAddProj && (
              <form onSubmit={handleAddProj} className="p-5 rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Project Title</label>
                    <input required value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. E-Commerce Redesign" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Your Role</label>
                    <input required value={newProj.role} onChange={e => setNewProj({...newProj, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. Lead Designer" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Tech Stack (comma separated)</label>
                  <input required value={newProj.tech_stack} onChange={e => setNewProj({...newProj, tech_stack: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. React, Node.js, PostgreSQL" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">Description</label>
                  <textarea required value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-brand-500 resize-none" placeholder="Describe the project and outcomes..."></textarea>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={addingProj} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70">
                    {addingProj && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Project
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadingProj ? (
                <div className="col-span-2 flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
              ) : projects.length === 0 ? (
                <div className="col-span-2 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 text-center text-slate-500 dark:text-zinc-400 text-sm bg-surface">
                  You haven't added any projects yet.
                </div>
              ) : (
                projects.map(proj => (
                  <div key={proj.id} className="group p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-300 dark:hover:border-brand-700 transition-colors relative flex flex-col">
                    <button onClick={() => deleteProj(proj.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 mb-1 pr-8">{proj.title}</h4>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-2">{proj.role}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4 flex-1 whitespace-pre-wrap">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {proj.tech_stack.split(',').map((tech: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
