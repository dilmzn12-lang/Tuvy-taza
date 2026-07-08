import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon, Save, Store, MapPin, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { ErrorBanner } from "@/components/ErrorBanner";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function Settings() {
  const { restaurantId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    name: "",
    address: "",
    phone: "",
    taxRate: 8.5,
    currency: "USD"
  });

  useEffect(() => {
    if (restaurantId) loadSettings();
  }, [restaurantId]);

  const loadSettings = async () => {
    if (!restaurantId) return;
    setError(null);
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'restaurants', restaurantId));
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          taxRate: data.taxRate || 8.5,
          currency: data.currency || "USD"
        });
      }
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e, "Could not load your settings. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'restaurants', restaurantId), settings);
      alert("Settings saved!");
    } catch (e) {
      console.error(e);
      alert(getErrorMessage(e, "Failed to save settings. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/20">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <SettingsIcon className="w-5 h-5 text-amber-500" />
            Restaurant Settings
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8">
        <div className="bg-[#080808] border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {error && <ErrorBanner message={error} onRetry={loadSettings} />}
            
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-slate-400" />
                General Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Restaurant Name</label>
                <input 
                  type="text" 
                  value={settings.name} 
                  onChange={e => setSettings({...settings, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input 
                    type="text" 
                    value={settings.phone} 
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Address
                  </label>
                  <input 
                    type="text" 
                    value={settings.address} 
                    onChange={e => setSettings({...settings, address: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800 w-full my-8" />

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Financial Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tax Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={settings.taxRate} 
                    onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Currency Code</label>
                  <select 
                    value={settings.currency} 
                    onChange={e => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
