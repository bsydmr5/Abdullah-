import React, { useState, useRef } from 'react';
import { analyzeVideo } from '../services/gemini';
import Markdown from 'react-markdown';
import { UploadCloud, Video, AlertCircle, Loader2 } from 'lucide-react';

export default function VideoAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('حجم الفيديو يجب أن يكون أقل من 20 ميجابايت.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const result = await analyzeVideo(base64String, file.type);
          setAnalysis(result);
        } catch (err: any) {
          setError(err.message || 'حدث خطأ أثناء تحليل الفيديو.');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('فشل في قراءة الملف.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError('حدث خطأ غير متوقع.');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">تحليل محتوى الفيديو</h2>
        <p className="text-gray-500 mt-2">قم برفع فيديو لتحليله واستخراج الأفكار والمشاعر والنقاط الرئيسية.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              file ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile && droppedFile.type.startsWith('video/')) {
                if (droppedFile.size > 20 * 1024 * 1024) {
                  setError('حجم الفيديو يجب أن يكون أقل من 20 ميجابايت.');
                  return;
                }
                setFile(droppedFile);
                setError(null);
                setAnalysis(null);
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center cursor-pointer">
              {file ? (
                <Video className="w-12 h-12 text-indigo-600 mb-4" />
              ) : (
                <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              )}
              <p className="text-lg font-medium text-gray-900 mb-1">
                {file ? file.name : 'اسحب وأفلت الفيديو هنا'}
              </p>
              <p className="text-sm text-gray-500">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'أو انقر لاختيار ملف (الحد الأقصى 20 ميجابايت)'}
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                تحليل الفيديو
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-l-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-300 mb-4" />
              <p className="text-lg">يقوم الذكاء الاصطناعي بتحليل الفيديو...</p>
              <p className="text-sm mt-2 text-gray-500">قد يستغرق هذا بضع ثوانٍ</p>
            </div>
          ) : analysis ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo max-w-none rtl:prose-p:text-right rtl:prose-headings:text-right rtl:prose-li:text-right">
              <div className="markdown-body" dir="rtl">
                <Markdown>{analysis}</Markdown>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 border-dashed p-8 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
              <Video className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">نتيجة التحليل ستظهر هنا</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
