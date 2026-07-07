import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Plus, Shield, ShieldAlert, Trash2, Loader2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'waitstaff' | 'kitchen';
  status: 'active' | 'inactive';
  pin?: string;
}

export function StaffManagement() {
  const { restaurantId } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'waitstaff' as StaffMember['role'], pin: '' });

  useEffect(() => {
    if (restaurantId) loadStaff();
  }, [restaurantId]);

  const loadStaff = async () => {
    try {
      const q = query(collection(db, 'users'), where('restaurantId', '==', restaurantId));
      const snap = await getDocs(q);
      const staffList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffMember));
      setStaff(staffList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId || !newStaff.name || !newStaff.email) return;
    try {
      // In a real app we'd create actual Firebase Auth users.
      // Here we just add to the 'users' collection for the UI.
      const docRef = await addDoc(collection(db, 'users'), {
        ...newStaff,
        restaurantId,
        status: 'active',
        createdAt: serverTimestamp()
      });
      setStaff([...staff, { id: docRef.id, ...newStaff, status: 'active' } as StaffMember]);
      setIsAdding(false);
      setNewStaff({ name: '', email: '', role: 'waitstaff', pin: '' });
    } catch (e) {
      console.error(e);
    }
  };

  const removeStaff = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setStaff(staff.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
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
            <Users className="w-5 h-5 text-amber-500" />
            Staff Management
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {isAdding && (
          <div className="bg-[#080808] border border-slate-800 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-bold mb-4">Add New Staff Member</h3>
            <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as any})} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white">
                  <option value="waitstaff">Waitstaff</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">PIN (Optional)</label>
                <input type="text" value={newStaff.pin} onChange={e => setNewStaff({...newStaff, pin: e.target.value})} placeholder="1234" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">Save</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#080808] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-slate-500 text-xs">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium capitalize">
                      {member.role === 'owner' || member.role === 'manager' ? <Shield className="w-3 h-3 text-amber-500" /> : null}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", member.status === 'active' ? "bg-green-500" : "bg-slate-600")} />
                      <span className="capitalize text-slate-400">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeStaff(member.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Remove staff">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
