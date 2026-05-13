/**
 * Shopping Cart Store (Zustand)
 * 
 * @description Global state management for shopping cart functionality.
 * Uses Zustand with localStorage persistence for cart data.
 * 
 * @features
 * - Add/remove items from cart
 * - Update item quantities
 * - Cart sidebar open/close state
 * - Persistent cart across sessions (localStorage)
 * - Stock validation
 * - Cart total calculations
 * - Clear cart functionality
 * 
 * @state
 * - items: Array of cart items
 * - isOpen: Cart sidebar visibility
 * 
 * @actions
 * - addItem: Add product to cart or increase quantity
 * - removeItem: Remove product from cart
 * - updateQuantity: Change item quantity
 * - clearCart: Empty entire cart
 * - openCart: Show cart sidebar
 * - closeCart: Hide cart sidebar
 * - getCartTotal: Calculate total price
 * 
 * @usage
 * const { items, addItem, removeItem } = useCartStore()
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.selectedColor === item.selectedColor &&
            i.selectedSize === item.selectedSize
        );

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const newItems = [...items];
          const existingItem = newItems[existingItemIndex];
          const newQuantity = existingItem.quantity + (item.quantity || 1);
          
          // Check stock limit
          if (newQuantity <= existingItem.stock) {
            newItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
            set({ items: newItems });
          } else {
            // Don't add more than stock allows
            console.warn('Cannot add more items than available stock');
          }
        } else {
          // New item, add to cart
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          });
        }
      },

      removeItem: (productId, color, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.selectedColor === color &&
                item.selectedSize === size
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.productId === productId &&
              item.selectedColor === color &&
              item.selectedSize === size
            ) {
              // Check stock limit
              const newQuantity = Math.min(quantity, item.stock);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      total: () => {
        // For now, total is same as subtotal
        // Can add shipping, tax, discounts later
        return get().subtotal();
      },
    }),
    {
      name: 'abi-ire-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
