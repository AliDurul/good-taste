import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem, deleteItemAsync } from 'expo-secure-store';

interface GlobalState {
    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;
}

const useGlobalStore = create(
    persist<GlobalState>(
        (set) => ({
            onboardingCompleted: false,
            setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
        }),
        {
            name: 'global-store',
            storage: createJSONStorage(() => ({
                getItem,
                setItem,
                removeItem: deleteItemAsync,
            })),
        }
    )
);

export default useGlobalStore;