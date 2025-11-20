import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix for API if needed, but usually better to pass full string to helper, 
        // but the helper we wrote expects strict base64 sometimes. 
        // However, @google/genai inlineData accepts full base64 string usually if properly formatted.
        // Let's strip the prefix in the parent or service if needed. 
        // Actually, the Gemini API `inlineData` expects raw base64, not the data URI scheme.
        const base64Data = base64.split(',')[1];
        onImageSelected(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-pulse">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Fridge...</h3>
        <p className="text-slate-500 text-center max-w-md">
          Our AI is identifying ingredients and crafting custom recipes just for you.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What's in your fridge?</h2>
        <p className="text-slate-500 text-lg">Snap a photo to get instant recipes.</p>
      </div>

      <div 
        className={`flex-1 flex flex-col items-center justify-center rounded-3xl border-4 border-dashed transition-all duration-300 cursor-pointer min-h-[400px]
          ${dragActive ? "border-emerald-500 bg-emerald-50 scale-[1.01]" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"}`}
        onDragEnter={onDrag} 
        onDragLeave={onDrag} 
        onDragOver={onDrag} 
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
           <Camera className="w-12 h-12 text-emerald-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Click to upload or drag and drop
        </h3>
        <p className="text-slate-400 mb-8">
          Supports JPG, PNG, WebP
        </p>

        <button 
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <Upload size={20} />
          Select Photo
        </button>
        
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
         {['Vegetables', 'Dairy', 'Leftovers'].map((item, i) => (
           <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2">
             <ImageIcon className="text-slate-300" size={24} />
             <span className="text-xs font-medium text-slate-500">Perfect for {item}</span>
           </div>
         ))}
      </div>
    </div>
  );
};