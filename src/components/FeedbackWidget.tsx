'use client';
import React, { useState } from 'react';
import { MessageSquarePlus, X, Star, Send, CheckCircle2 } from 'lucide-react';

export default function FeedbackWidget({ onSubmitted }: { onSubmitted?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'Bug' | 'Feature' | 'Praise' | 'General'>('General');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, category, comment, userEmail: email }),
      });
      setIsSubmitted(true);
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setComment('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold shadow-2xl transition hover:scale-105 z-50 text-sm"
      >
        <MessageSquarePlus className="h-4 w-4" />
        <span>Feedback</span>
      </button>

      {/* Slide-over Widget Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-50 text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Send Feedback</span>
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Thank you for your feedback!</p>
              <p className="text-xs text-slate-400 mt-1">Our engineering team has received your submission.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Experience Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`h-5 w-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['General', 'Feature', 'Bug', 'Praise'] as const).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-1 text-center rounded-lg text-[11px] font-medium border transition ${
                        category === cat
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Thoughts</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What worked well or what can we improve?"
                  rows={3}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Optional Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
