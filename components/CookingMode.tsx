import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX, CheckCircle2, Play } from 'lucide-react';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Stop speaking when unmounting or closing
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Read current step when changed (optional auto-read could go here, but manual is better)
  useEffect(() => {
     if (isSpeaking) {
       speakText(recipe.steps[currentStep]);
     } else {
       window.speechSynthesis.cancel();
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const speakText = (text: string) => {
    if (!speechSupported) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for instructions
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(recipe.steps[currentStep]);
    }
  };

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(p => p - 1);
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top Bar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
             <X size={24} />
           </button>
           <div>
             <h2 className="font-bold text-slate-800 leading-tight">{recipe.title}</h2>
             <p className="text-xs text-slate-400">Step {currentStep + 1} of {recipe.steps.length}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           {speechSupported && (
             <button 
               onClick={toggleSpeech}
               className={`p-3 rounded-full transition-colors ${
                 isSpeaking ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               {isSpeaking ? <Volume2 size={24} /> : <VolumeX size={24} />}
             </button>
           )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-3xl w-full text-center space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-semibold text-sm tracking-wide uppercase">
            Step {currentStep + 1}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            {recipe.steps[currentStep]}
          </h1>

          {currentStep === recipe.steps.length - 1 && (
            <div className="pt-8 animate-fade-in">
               <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-xl font-bold text-lg">
                 <CheckCircle2 />
                 Bon Appétit!
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 border-t border-slate-100 px-6 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
         <div className="flex items-center gap-6 w-full max-w-md">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={24} />
              Previous
            </button>

            <button 
              onClick={handleNext}
              disabled={currentStep === recipe.steps.length - 1}
              className="flex-[2] h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-slate-900 shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              Next Step
              <ChevronRight size={24} />
            </button>
         </div>
      </div>
    </div>
  );
};