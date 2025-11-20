import React from 'react';
import { Trash2, ShoppingBag, Plus } from 'lucide-react';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (index: number) => void;
  onAddItem: (item: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onAddItem }) => {
  const [newItem, setNewItem] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Shopping List</h2>
        <p className="text-slate-500">Don't forget these ingredients for your next meal.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
        <button 
          type="submit"
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm"
        >
          <Plus size={24} />
        </button>
      </form>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
          <ShoppingBag className="w-16 h-16 mb-4 text-slate-200" />
          <p>Your shopping list is empty.</p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto pb-10">
          {items.map((item, index) => (
            <li 
              key={`${item}-${index}`} 
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-emerald-400" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
              <button 
                onClick={() => onRemoveItem(index)}
                className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};