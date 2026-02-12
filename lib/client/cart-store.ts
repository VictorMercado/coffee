import { create } from "zustand"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: "SM" | "MD" | "LG"
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items
    const existingIndex = items.findIndex(
      (i) => i.id === item.id && i.size === item.size
    )

    if (existingIndex > -1) {
      const newItems = [...items]
      newItems[existingIndex].quantity += 1
      set({ items: newItems })
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] })
    }
  },
  removeItem: (id, size) => {
    set({ items: get().items.filter((i) => !(i.id === id && i.size === size)) })
  },
  updateQuantity: (id, size, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id, size)
      return
    }
    const newItems = get().items.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    )
    set({ items: newItems })
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))
