import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, ChefHat, Plus, AlertCircle } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onAddToShoppingList: (items: string[]) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, onAddToShoppingList }) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12 text-slate-400">
        <ChefHat className="w-16 h-16 mb-4 text-slate-300" />
        <p className="text-lg">No recipes found yet. Try scanning your fridge!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Suggested Recipes</h2>
        <span className="text-sm text-slate-500">{recipes.length} found based on your ingredients</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col overflow-hidden group"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {recipe.difficulty}
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                   <div className="flex items-center gap-1">
                     <Clock size={14} />
                     <span>{recipe.prepTime}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Flame size={14} />
                     <span>{recipe.calories} kcal</span>
                   </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                {recipe.description}
              </p>

              <div className="mt-auto space-y-4">
                 {/* Ingredients Summary */}
                 <div className="flex flex-wrap gap-2">
                    {recipe.usedIngredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                        {ing}
                      </span>
                    ))}
                    {recipe.usedIngredients.length > 3 && (
                      <span className="text-xs text-slate-400 px-1 py-1">+{recipe.usedIngredients.length - 3} more</span>
                    )}
                 </div>

                 {recipe.missingIngredients.length > 0 && (
                   <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Missing Ingredients</p>
                        <p className="text-xs text-amber-700 truncate">{recipe.missingIngredients.join(', ')}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToShoppingList(recipe.missingIngredients);
                        }}
                        className="shrink-0 p-1.5 bg-white text-amber-600 rounded-md border border-amber-200 hover:bg-amber-50 transition-colors"
                        title="Add to Shopping List"
                      >
                        <Plus size={14} />
                      </button>
                   </div>
                 )}
              </div>
            </div>

            <button 
              onClick={() => onSelectRecipe(recipe)}
              className="w-full py-4 bg-slate-50 text-slate-600 font-medium border-t border-slate-100 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ChefHat size={18} />
              Start Cooking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};