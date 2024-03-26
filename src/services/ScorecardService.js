import {scorecards} from "../ds/scorecards";

const ScorecardService = () => {

    const findAll = () => {
        return scorecards;
    }

    const findById = (id) => {
        return findAll().find(scorecard => scorecard.id == id);
    }

    return {
        findAll,
        findById
    }
}

export default ScorecardService;