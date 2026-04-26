// src/stores/cart-store.ts
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type CartPrice = {
  amount: number;
  currency: "NGN";
  display: string;
};

export type CartImage = {
  src: string;
  alt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  categorySlug: string;
  productType: string;
  image: CartImage | null;
  color: string;
  size: string;
  price: CartPrice;
  quantity: number;
  addedAt: string;
};

export type AddCartItemInput = Omit<CartItem, "id" | "quantity" | "addedAt"> & {
  quantity?: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

function getStorage() {
  if (typeof window === "undefined") return noopStorage;
  return window.localStorage;
}

function createCartItemId(item: Pick<AddCartItemInput, "productSlug" | "color" | "size">) {
  return `${item.productSlug}::${item.color}::${item.size}`.toLowerCase();
}

function clampQuantity(quantity: number) {
  return Math.max(1, Math.min(quantity, 99));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        const itemId = createCartItemId(item);
        const quantityToAdd = clampQuantity(item.quantity ?? 1);

        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === itemId
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === itemId
                  ? {
                      ...cartItem,
                      quantity: clampQuantity(cartItem.quantity + quantityToAdd),
                    }
                  : cartItem
              ),
            };
          }

          return {
            items: [
              {
                ...item,
                id: itemId,
                quantity: quantityToAdd,
                addedAt: new Date().toISOString(),
              },
              ...state.items,
            ],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      incrementItem: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: clampQuantity(item.quantity + 1) }
              : item
          ),
        }));
      },

      decrementItem: (itemId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "samalia-cart-v1",
      storage: createJSONStorage(getStorage),
      version: 1,
    }
  )
);

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.price.amount * item.quantity,
    0
  );
}

export function formatCartAmount(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}