import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


type AuthStore = {
    firm: {
        email: string;
        name: string;
    };
    isAuthenticated: boolean;
}

type Actions = {
    login: (firm: AuthStore["firm"]) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore & Actions>()(immer((set) => ({
    firm: {
        email: "",
        name: ""
    },
    isAuthenticated: false,
    login: (firm) => {
        set(state => {
            state.firm = firm;
            state.isAuthenticated = true;
        });
    },
    logout: () => {
        set(state => {
            state.firm = { email: "", name: "" };
            state.isAuthenticated = false;
        });
    },
})))

export default useAuthStore;