export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  usedIngredients: string[];
  missingIngredients: string[];
  steps: string[];
}

export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  keto: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

export type ViewMode = 'upload' | 'recipes' | 'cooking' | 'shopping';

export interface AnalysisResult {
  recipes: Recipe[];
  identifiedIngredients: string[];
}