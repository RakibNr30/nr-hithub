import {commentaries} from "../ds/commentaries";

const CommentaryService = () => {

    const findAll = () => {
        return commentaries;
    }

    const findById = (id) => {
        return findAll().find(commentary => commentary.id == id);
    }

    return {
        findAll,
        findById
    }
}

export default CommentaryService;