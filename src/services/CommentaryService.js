import useCommentaryStore from "../stores/commentaryStore";

const CommentaryService = () => {

    const {addCommentary, updateCommentary, getAllCommentary} = useCommentaryStore();

    const findAll = () => {
        return getAllCommentary();
    }

    const findById = (id) => {
        return findAll().find(commentary => commentary.id == id);
    }

    const save = (commentary) => {
        addCommentary(commentary);
    }

    const update = (commentary) => {
        updateCommentary(commentary);
    }

    return {
        findAll,
        findById,
        save,
        update
    }
}

export default CommentaryService;