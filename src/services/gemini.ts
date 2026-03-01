import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSocialMediaTrends() {
  const prompt = `ابحث عن أهم الترندات والمواضيع الشائعة حالياً في وسائل التواصل الاجتماعي (تيك توك، تويتر/X، إنستغرام) في العالم العربي أو عالمياً. 
قدم تقريراً مفصلاً عن كل ترند، سبب انتشاره، وكيف يمكن لصناع المحتوى استغلاله.
استخدم أدوات البحث للحصول على أحدث المعلومات.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}

export async function analyzeVideo(base64Data: string, mimeType: string) {
  const prompt = `قم بتحليل هذا الفيديو بالتفصيل. استخرج:
1. ملخص المحتوى.
2. المشاعر العامة (Sentiment).
3. النقاط الرئيسية.
4. نصائح لتحسين الفيديو أو أفكار لمحتوى مشابه لزيادة التفاعل على وسائل التواصل الاجتماعي.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  return response.text;
}
