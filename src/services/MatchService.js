import {matches} from "../ds/matches";

const MatchService = () => {

    const findAll = () => {
        return matches;
    }

    const findById = (id) => {
        return findAll().find(match => match.id === id);
    }

    return {
        findAll,
        findById
    }
}

export default MatchService;