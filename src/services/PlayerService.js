import {players} from "../ds/players";

const PlayerService = () => {

    const findAll = () => {
        return players;
    }

    const findAllByTeamId = (id) => {
        return findAll().filter(player => player.teamId == id);
    }

    const findById = (id) => {
        return findAll().find(player => player.id == id);
    }

    return {
        findAll,
        findAllByTeamId,
        findById
    }
}

export default PlayerService;