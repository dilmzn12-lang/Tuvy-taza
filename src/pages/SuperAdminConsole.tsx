import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Loader2, Shield, Store, Users } from 'lucide-react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type RestaurantDoc = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Timestamp | unknown;
  slug?: string;
};

export function SuperAdminConsole() {
  const [restaurants, setRestaurants] = useState<RestaurantDoc[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [restaurantSnap, userSnap] = await Promise.all([
          getDocs(collection(db, 'restaurants')),
          getDocs(collection(db, 'users')),
        ]);

        if (!active) return;

        setRestaurants(
          restaurantSnap.docs.map((document) => ({
            id: document.id,
            ...(document.data() as Omit<RestaurantDoc, 'id'>),
          })),
        );
        setUserCount(userSnap.size);
      } catch (error) {
        console.error('Unable to load super admin console data', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#050505] px-4 py-8 text-slate-300 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            <Shield className="h-4 w-4" /> Platform control
          </p>
          <h1 className="text-3xl font-bold text-white">Super Admin Console</h1>
          <p className="mt-2 text-slate-400">Read-only platform overview for tenant inventory and platform account coverage.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard icon={<Store className="h-5 w-5" />} label="Restaurants" value={restaurants.length} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Platform users" value={userCount} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#080808] shadow-2xl">
          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Restaurants</h2>
            <p className="text-sm text-slate-400">All registered tenants in the platform.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="px-6 py-12">
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
                <Store className="mx-auto h-10 w-10 text-slate-500" />
                <h3 className="mt-4 text-lg font-semibold text-white">No restaurants yet</h3>
                <p className="mt-2 text-sm text-slate-400">Tenant records will appear here once restaurants are created.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="grid gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr] md:items-center">
                  <div>
                    <p className="font-semibold text-white">{restaurant.name}</p>
                    <p className="mt-1 text-sm text-slate-400">ID: {restaurant.id}</p>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Owner</span>
                    <span className="break-all">{restaurant.ownerId}</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Slug</span>
                    <span>{restaurant.slug ?? '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#080808] p-6 shadow-2xl">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">{icon}</div>
        <span className="text-sm font-medium uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-4 text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
