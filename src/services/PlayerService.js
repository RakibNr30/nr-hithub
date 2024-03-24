import {players} from "../ds/players";

const PlayerService = () => {

    const findAll = () => {
        return players;
    }

    const findById = (id) => {
        return findAll().find(player => player.id === id);
    }

    return {
        findAll,
        findById
    }
}

export default PlayerService;