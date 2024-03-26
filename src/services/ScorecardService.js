import useScorecardStore from "../stores/scorecardStore";

const ScorecardService = () => {

    const {addScorecard, updateScorecard, getAllScorecard} = useScorecardStore();

    const findAll = () => {
        return getAllScorecard();
    }

    const findById = (id) => {
        return findAll().find(scorecard => scorecard.id == id);
    }

    const save = (scorecard) => {
        addScorecard(scorecard);
    }

    const update = (scorecard) => {
        updateScorecard(scorecard);
    }

    return {
        findAll,
        findById,
        save,
        update
    }
}

export default ScorecardService;