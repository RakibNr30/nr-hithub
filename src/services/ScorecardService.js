import useScorecardStore from "../stores/scorecardStore";
import useCommentaryStore from "../stores/commentaryStore";

const ScorecardService = () => {

    const {addScorecard, updateScorecard, getAllScorecard} = useScorecardStore();

    const getScorecard = (match) => {
        return useScorecardStore.getState().scorecards.find(scorecard => scorecard.id == match.scorecardId);
    }

    const getCommentary = (match) => {
        return useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);
    }

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

    const getExistingBowlers = (match) => {
        const scorecard = getScorecard(match);
        const commentary = getCommentary(match);

        return commentary.miniScore.innings == 1
            ? scorecard.firstInnings.bowlingDetails.teamBowlers
            : scorecard.secondInnings.bowlingDetails.teamBowlers;
    }

    const getQuotaExpiredBowlers = (match) => {
        const scorecard = getScorecard(match);
        const commentary = getCommentary(match);

        const bowlers = commentary.miniScore.innings == 1
            ? scorecard.firstInnings.bowlingDetails.teamBowlers
            : scorecard.secondInnings.bowlingDetails.teamBowlers;

        return bowlers.filter((item) => {
            return item.canMaxOvers <= item.overs;
        })
    }

    return {
        findAll,
        findById,
        save,
        update,
        getExistingBowlers,
        getQuotaExpiredBowlers
    }
}

export default ScorecardService;