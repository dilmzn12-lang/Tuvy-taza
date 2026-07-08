import React from "react";
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingScreen } from '@/components/LoadingScreen';
import { fetchMenuItems } from '@/lib/orders';
import type { MenuItem } from '@/lib/types';

export function MenuManagement() {
  const { restaurantId } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });

  useEffect(() => {
    if (restaurantId) {
      loadMenu();
    }
  }, [restaurantId]);

  const loadMenu = async () => {
    if (!restaurantId) return;
    try {
      setItems(await fetchMenuItems(restaurantId));
    } catch (e) {
      console.error("Error loading menu", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;
    try {
      const newItem = {
        restaurantId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        available: true,
      };
      const docRef = await addDoc(collection(db, 'menuItems'), newItem);
      setItems([...items, { id: docRef.id, ...newItem }]);
      setIsAdding(false);
      setFormData({ name: '', description: '', price: '', category: '' });
    } catch (e) {
      console.error("Error adding item", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      setItems(items.filter(item => item.id !== id));
    } catch (e) {
      console.error("Error deleting item", e);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Menu Management</h1>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {isAdding && (
          <div className="bg-[#080808] border border-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Add New Item</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-white" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-white" placeholder="e.g. Starters, Mains" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-white h-24" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-slate-200 transition-colors">Save Item</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-[#080808] border border-slate-800 rounded-xl p-4 flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{item.description}</p>
                <span className="font-bold text-amber-500">${item.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && !isAdding && (
            <div className="text-center py-12 text-slate-500">
              No items in menu yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
