import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

const useCommentaryStore = create(
    persist((set, get) => ({
            commentaries: [],
            getAllCommentary: () => get().commentaries,
            addCommentary: (commentary = {}) => set((state) => {
                return {
                    commentaries: [...state.commentaries, commentary],
                }
            }),
            addAllCommentary: (commentaryList = []) => set(() => {
                return {
                    commentaries: commentaryList,
                }
            }),
            updateCommentary: (commentary = {}) => set((state) => {
                const existingCommentaryIndex = state.commentaries.findIndex((item) => item.id === commentary.id);
                if (existingCommentaryIndex !== -1) {
                    const updatedCommentaries = [...state.commentaries];
                    updatedCommentaries[existingCommentaryIndex] = commentary;
                    return {
                        commentaries: updatedCommentaries,
                    };
                } else {
                    return state;
                }
            }),
            deleteCommentary: (id) => set((state) => {
                return {
                    commentaries: state.commentaries.filter((item) => item.id !== id),
                };
            }),
        }),
        {
            name: "commentaries",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useCommentaryStore;