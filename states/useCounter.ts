import { create } from "zustand";

type State = {
    count: number;
}

type Actions = {
    increment: () => void
    reset: () => void
}

const useCounter = create<State & Actions>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
}))

export default useCounter