import {teams} from "../ds/teams";

const TeamService = () => {

    const findAll = () => {
        return teams;
    }

    const findById = (id) => {
        return findAll().find(team => team.id == id);
    }

    return {
        findAll,
        findById
    }
}

export default TeamService;