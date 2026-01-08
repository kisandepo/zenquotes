
import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from "../types";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const fetchRandomQuote = async (): Promise<Quote> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a unique, profound, and inspiring quote. It can be a real quote or a realistically synthesized one from a deep thinker (real or imaginary). Provide the quote, author, a brief context/explanation, and a category.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          author: { type: Type.STRING },
          context: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["text", "author", "category"]
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  return data as Quote;
};

export const generateVisualPrompt = async (quote: Quote): Promise<string> => {
  const ai = getGeminiClient();
  const prompt = `Create a serene, high-quality cinematic background image description for the following quote: "${quote.text}". The style should be abstract, ethereal, and artistic. No text in the image. Description:`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "A serene abstract background with soft lighting.";
};

export const generateQuoteImage = async (visualPrompt: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: visualPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image");
};
