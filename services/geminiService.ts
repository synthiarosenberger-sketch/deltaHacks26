
import { GoogleGenAI, Type } from "@google/genai";
import { Task, EcoFact } from "../types";

export const getEcoFact = async (task: Task): Promise<EcoFact | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a surprising eco-fact and the environmental impact related to the task: "${task.title} - ${task.description}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING, description: "A short, engaging fact about this sustainable action." },
            impact: { type: Type.STRING, description: "A quantification or description of the positive environmental impact." }
          },
          required: ["fact", "impact"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
