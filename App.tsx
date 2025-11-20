import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImageUpload } from './components/ImageUpload';
import { RecipeList } from './components/RecipeList';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { ViewMode, Recipe, DietaryPreferences } from './types';
import { analyzeFridgeImage } from './services/geminiService';
import { Menu } from 'lucide-react';

const DEFAULT_PREFERENCES: DietaryPreferences = {
  vegetarian: false,
  vegan: false,
  keto: false,
  glutenFree: false,
  dairyFree: false,
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<DietaryPreferences>(DEFAULT_PREFERENCES);

  const togglePreference = (key: keyof DietaryPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageSelected = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeFridgeImage(base64, preferences);
      setRecipes(results);
      setCurrentView('recipes');
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong analyzing the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToShoppingList = (items: string[]) => {
    setShoppingList(prev => {
      const unique = new Set([...prev, ...items]);
      return Array.from(unique);
    });
    // Optional feedback could go here (toast notification)
  };

  const removeFromShoppingList = (index: number) => {
    setShoppingList(prev => prev.filter((_, i) => i !== index));
  };

  const addSingleItemToShoppingList = (item: string) => {
      setShoppingList(prev => [...prev, item]);
  }

  // Mobile sidebar toggle
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:transform-none shadow-2xl lg:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        preferences={preferences}
        onTogglePreference={togglePreference}
        shoppingListCount={shoppingList.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center px-4 border-b border-slate-200 bg-white shrink-0">
          <button onClick={toggleMobileSidebar} className="p-2 -ml-2 text-slate-600">
            <Menu />
          </button>
          <span className="ml-3 font-bold text-slate-800">Smart Fridge</span>
        </div>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-5xl mx-auto h-full">
            {currentView === 'upload' && (
              <ImageUpload 
                onImageSelected={handleImageSelected} 
                isAnalyzing={isAnalyzing} 
              />
            )}
            
            {currentView === 'recipes' && (
              <RecipeList 
                recipes={recipes} 
                onSelectRecipe={(r) => {
                  setSelectedRecipe(r);
                }}
                onAddToShoppingList={addToShoppingList}
              />
            )}

            {currentView === 'shopping' && (
              <ShoppingList 
                items={shoppingList}
                onRemoveItem={removeFromShoppingList}
                onAddItem={addSingleItemToShoppingList}
              />
            )}
          </div>
        </div>
      </main>

      {/* Full Screen Cooking Mode Modal */}
      {selectedRecipe && (
        <CookingMode 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
};

export default App;