import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

const useScorecardStore = create(
    persist((set, get) => ({
            scorecards: [],
            getAllScorecard: () => get().scorecards,
            addScorecard: (scorecard = {}) => set((state) => {
                return {
                    scorecards: [...state.scorecards, scorecard],
                }
            }),
            addAllScorecard: (scorecardList = []) => set(() => {
                return {
                    scorecards: scorecardList,
                }
            }),
            updateScorecard: (scorecard = {}) => set((state) => {
                const existingScorecardIndex = state.scorecards.findIndex((item) => item.id === scorecard.id);
                if (existingScorecardIndex !== -1) {
                    const updatedScorecards = [...state.scorecards];
                    updatedScorecards[existingScorecardIndex] = scorecard;
                    return {
                        scorecards: updatedScorecards,
                    };
                } else {
                    return state;
                }
            }),
            deleteScorecard: (id) => set((state) => {
                return {
                    scorecards: state.scorecards.filter((item) => item.id !== id),
                };
            }),
        }),
        {
            name: "scorecards",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useScorecardStore;