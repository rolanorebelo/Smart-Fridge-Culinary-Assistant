import { GoogleGenAI, Type } from "@google/genai";
import { DietaryPreferences, Recipe } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFridgeImage = async (
  base64Image: string,
  preferences: DietaryPreferences
): Promise<Recipe[]> => {
  const ai = createClient();
  
  // Construct dietary restriction string
  const restrictions = Object.entries(preferences)
    .filter(([_, active]) => active)
    .map(([key]) => key)
    .join(", ");

  const dietPrompt = restrictions 
    ? `IMPORTANT: strict adherence to these dietary restrictions: ${restrictions}.` 
    : "No specific dietary restrictions.";

  const prompt = `
    Analyze this image of a fridge or food items. 
    Identify the visible ingredients.
    Based on these ingredients, suggest 4 distinct recipes.
    ${dietPrompt}
    
    For each recipe, list:
    1. The title
    2. A short appetizing description (1 sentence)
    3. Difficulty (Easy, Medium, or Hard)
    4. Estimated prep time (e.g., "20 mins")
    5. Estimated calories per serving
    6. Ingredients from the image used
    7. Missing essential ingredients needed to complete the dish
    8. Step-by-step cooking instructions (array of strings)

    Return the response in valid JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg", 
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            prepTime: { type: Type.STRING },
            calories: { type: Type.INTEGER },
            usedIngredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            missingIngredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ["title", "description", "difficulty", "prepTime", "calories", "usedIngredients", "missingIngredients", "steps"],
        },
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("No data returned from Gemini");
  }

  try {
    const data = JSON.parse(jsonText);
    // Ensure IDs exist
    return data.map((r: any, idx: number) => ({
      ...r,
      id: r.id || `recipe-${Date.now()}-${idx}`,
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to parse recipe data");
  }
};