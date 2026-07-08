import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CartLine, MenuItem, Order, OrderStatus } from "./types";

/** Maps Firestore query docs into typed objects, merging the doc id in. */
export function mapDocs<T>(docs: QueryDocumentSnapshot<DocumentData>[]): T[] {
  return docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

/** Loads all menu items for a restaurant. */
export async function fetchMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const q = query(collection(db, "menuItems"), where("restaurantId", "==", restaurantId));
  const snapshot = await getDocs(q);
  return mapDocs<MenuItem>(snapshot.docs);
}

/** Builds the category filter list ("All" + unique categories) for a menu. */
export function extractCategories(items: MenuItem[]): string[] {
  return ["All", ...Array.from(new Set(items.map((i) => i.category)))];
}

export interface CreateOrderInput {
  restaurantId: string;
  lines: CartLine[];
  total: number;
  type: string;
  tableInfo: string;
}

/** Creates a pending order document from a cart. */
export function createOrder({ restaurantId, lines, total, type, tableInfo }: CreateOrderInput) {
  return addDoc(collection(db, "orders"), {
    restaurantId,
    items: lines.map((l) => ({
      id: l.id,
      name: l.name,
      quantity: l.quantity,
      price: l.price,
      status: "pending",
    })),
    total,
    status: "pending",
    type,
    tableInfo,
    createdAt: serverTimestamp(),
  });
}

/** Subscribes to a restaurant's orders in the given statuses. Returns the unsubscribe fn. */
export function subscribeActiveOrders(
  restaurantId: string,
  statuses: OrderStatus[],
  callback: (orders: Order[]) => void,
) {
  const q = query(
    collection(db, "orders"),
    where("restaurantId", "==", restaurantId),
    where("status", "in", statuses),
  );
  return onSnapshot(q, (snapshot) => callback(mapDocs<Order>(snapshot.docs)));
}
