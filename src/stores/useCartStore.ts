import { create } from 'zustand'

export type CartItem = {
  cartId: string
  id: string
  name: string
  price: number
  qty: number
  notes: string
  sugar: string
  ice: string
  imageUrl: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartId' | 'qty'>) => void
  removeItem: (cartId: string) => void
  updateQty: (cartId: string, qty: number) => void
  updateNotes: (cartId: string, notes: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.id === item.id &&
          i.sugar === item.sugar &&
          i.ice === item.ice &&
          i.notes === item.notes
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      const cartId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
      return { items: [...state.items, { ...item, cartId, qty: 1 }] }
    })
  },
  removeItem: (cartId) => {
    set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) }))
  },
  updateQty: (cartId, qty) => {
    if (qty <= 0) {
      get().removeItem(cartId)
      return
    }
    set((state) => ({
      items: state.items.map((i) => (i.cartId === cartId ? { ...i, qty } : i)),
    }))
  },
  updateNotes: (cartId, notes) => {
    set((state) => ({
      items: state.items.map((i) => (i.cartId === cartId ? { ...i, notes } : i)),
    }))
  },
  clearCart: () => set({ items: [] }),
}))

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0)
