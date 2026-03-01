import React, { useState, useEffect } from 'react';
import { getSocialMediaTrends } from '../services/gemini';
import Markdown from 'react-markdown';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Trends() {
  const [trends, setTrends] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSocialMediaTrends();
      setTrends(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء جلب الترندات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">الترندات الحالية</h2>
          <p className="text-gray-500 mt-2">اكتشف أحدث المواضيع الشائعة على منصات التواصل الاجتماعي.</p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          تحديث الترندات
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-8 rounded-l-xl flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : trends ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo prose-lg max-w-none rtl:prose-p:text-right rtl:prose-headings:text-right rtl:prose-li:text-right">
          <div className="markdown-body" dir="rtl">
            <Markdown>{trends}</Markdown>
          </div>
        </div>
      ) : null}
    </div>
  );
}
