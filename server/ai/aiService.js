import "dotenv/config";
import { GoogleGenAI } from "@google/genai";


const GEMINI_API_KEY = "AIzaSyDGupjX7BwtmsMrhUrJLW2AvF64cYBcaFA"  //process.env.GEMINI_API_KEY;
console.log("Gemini API Key:", GEMINI_API_KEY);

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export const generateReplySuggestions = async (message, history) => {

    try {

        
        const contextMessages = history
        .map(m =>
            `${m.senderId.toString() === history[0].senderId.toString()
                ? "User"
                : "Friend"}: ${m.text || ""}`
            )
            .join("\n");

            const prompt = `
            You are an AI chat assistant.
            
            Conversation:
            ${contextMessages}
            
            Latest message:
            ${message}
            
            Generate 3 short smart reply suggestions.
            
            Rules:
            - Maximum 8 words
            - Natural casual replies
            - Do NOT number replies
            - Each reply on new line
            `;
            
            const result = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });

        const text = result.text
        
        console.log("Gemini Raw Response:", text);

        return text
            .split("\n")
            .filter(r => r.trim() !== "");

    } catch (err) {
        console.error("Gemini Error:", err);
        return [];
    }
};


