import React from 'react';
import { DietaryPreferences, ViewMode } from '../types';
import { Utensils, ShoppingCart, Camera, CheckSquare, ChefHat, Leaf } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  preferences: DietaryPreferences;
  onTogglePreference: (key: keyof DietaryPreferences) => void;
  shoppingListCount: number;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  preferences,
  onTogglePreference,
  shoppingListCount,
  className = "",
}) => {
  return (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 ${className}`}>
      <div className="p-6 flex items-center gap-2 border-b border-slate-100">
        <div className="bg-emerald-500 p-2 rounded-lg text-white">
          <ChefHat size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Smart Fridge</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</h3>
          
          <button
            onClick={() => onViewChange('upload')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'upload' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Camera size={18} />
            Scan Fridge
          </button>

          <button
            onClick={() => onViewChange('recipes')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'recipes' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Utensils size={18} />
            Recipes
          </button>

          <button
            onClick={() => onViewChange('shopping')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'shopping' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShoppingCart size={18} />
            <span>Shopping List</span>
            {shoppingListCount > 0 && (
              <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                {shoppingListCount}
              </span>
            )}
          </button>
        </div>

        {/* Dietary Filters */}
        <div className="space-y-1 pt-4 border-t border-slate-100">
          <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dietary Preferences</h3>
          
          {(Object.keys(preferences) as Array<keyof DietaryPreferences>).map((key) => (
            <button
              key={key}
              onClick={() => onTogglePreference(key)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg group cursor-pointer"
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                preferences[key] 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'border-slate-300 bg-white text-transparent group-hover:border-emerald-400'
              }`}>
                <CheckSquare size={14} fill="currentColor" className={preferences[key] ? 'opacity-100' : 'opacity-0'} />
              </div>
              <span className="text-sm font-medium text-slate-600 capitalize group-hover:text-slate-900">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 text-center">
         <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <Leaf size={12} />
            <span>Powered by Gemini</span>
         </div>
      </div>
    </aside>
  );
};