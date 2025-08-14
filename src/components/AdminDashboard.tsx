'use client';
import React, { useState, useEffect } from 'react';
import { Star, BarChart3, MessageSquare, Clock, Filter, Sparkles } from 'lucide-react';
import FeedbackWidget from './FeedbackWidget';

interface FeedbackItem {
  id: string;
  category: string;
  rating: number;
  comment: string;
  userEmail: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  total: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [filterCat, setFilterCat] = useState('All');

  const loadData = () => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        setItems(data.feedback);
        setAnalytics(data.analytics);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Feedback SDK Analytics</h1>
          </div>
          <p className="text-xs text-slate-400">Embeddable customer feedback telemetry and NPS monitor</p>
        </div>
      </header>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Submissions</span>
            <div className="text-3xl font-extrabold text-white mt-1">{analytics.total}</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow">
            <span className="text-xs text-slate-400 uppercase font-semibold">Average Rating</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1 flex items-center gap-1.5">
              <span>{analytics.averageRating}</span>
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow">
            <span className="text-xs text-slate-400 uppercase font-semibold">5-Star Satisfaction</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {analytics.total ? Math.round((analytics.ratingDistribution[5] / analytics.total) * 100) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-400 mr-1" />
        {['All', 'General', 'Feature', 'Bug', 'Praise'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filterCat === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feedback Stream */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-indigo-400 border border-slate-700">
                  {item.category}
                </span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-mono">{item.userEmail}</span>
              </div>
              <p className="text-sm text-slate-300">{item.comment}</p>
            </div>
            <div className="text-right flex-shrink-0 text-xs text-slate-500 flex sm:flex-col items-center sm:items-end justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                {item.status}
              </span>
              <span className="text-[11px] mt-1 text-slate-600">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Demo Widget */}
      <FeedbackWidget onSubmitted={loadData} />
    </div>
  );
}
