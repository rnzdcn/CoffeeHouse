import { create } from 'zustand'
import { products as initialProducts, type Product } from '@/lib/mockData'

type InventoryStore = {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void
  deleteProduct: (id: string) => void
  toggleAvailability: (id: string) => void
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  products: initialProducts,
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: `p-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),
  updateProduct: (id, patch) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  toggleAvailability: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, available: !p.available } : p
      ),
    })),
}))
