import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

const useMatchStore = create(
    persist((set, get) => ({
            matches: [],
            getAllMatch: () => get().matches,
            addMatch: (match = {}) => set((state) => {
                return {
                    matches: [...state.matches, match],
                }
            }),
            addAllMatch: (matchList = []) => set(() => {
                return {
                    matches: matchList,
                }
            }),
            updateMatch: (match = {}) => set((state) => {
                const existingMatchIndex = state.matches.findIndex((item) => item.id === match.id);
                if (existingMatchIndex !== -1) {
                    const updatedMatches = [...state.matches];
                    updatedMatches[existingMatchIndex] = match;
                    return {
                        matches: updatedMatches,
                    };
                } else {
                    return state;
                }
            }),
            deleteMatch: (id) => set((state) => {
                return {
                    matches: state.matches.filter((item) => item.id !== id),
                };
            }),
        }),
        {
            name: "hithub_matches",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useMatchStore;