import useMatchStore from "../stores/matchStore";

const MatchService = () => {

    const {addMatch, updateMatch, getAllMatch} = useMatchStore();

    const findAll = () => {
        return getAllMatch();
    }

    const findById = (id) => {
        return findAll().find(match => match.id == id);
    }

    const save = (match) => {
        addMatch(match);
    }

    const update = (match) => {
        updateMatch(match);
    }

    return {
        findAll,
        findById,
        save,
        update
    }
}

export default MatchService;