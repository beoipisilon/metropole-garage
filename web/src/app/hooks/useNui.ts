import { create } from 'zustand'

export interface ModelProps {
    index_name: string
    model: {
        value: number
        max: number
    }
    texture: {
        value: number
        max: number
    }
    price: number
    name: string
    key?: number
}

interface CartProps {
    total: number
}

interface NuiState {
    customs: ModelProps[]
    cart: CartProps
    setCart: (total: CartProps) => void
    setCustoms: (customs: ModelProps[]) => void
}
  
export const useNui = create<NuiState>((set) => ({
    customs: [],
    cart: { total: 0 },
    setCustoms: (customs) => set({ customs }),
    setCart: (total) => set({ cart: total }),
}));