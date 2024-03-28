import useCommentaryStore from "../stores/commentaryStore";
import CommentaryService from "./CommentaryService";
import CommentaryEvent from "../models/CommentaryEvent";
import {EVENT} from "../constants/commentary";
import OverSeparator from "../models/OverSeparator";
import {useState} from "react";
import commentary from "../models/Commentary";

const ScorerService = () => {
    const commentaryService = CommentaryService();

    const getCommentary = (match) => {
        return  useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);
    }

    const runAndEvents = (match = {}, takenRun = 0) => {
        const commentary = getCommentary(match);

        updateCommentary(match, commentary, takenRun);

        switch (takenRun) {
            case 1:
            case 3:
            case 5:
                swapBatsman(match);
                break;
            default:
                break;
        }

        const updatedCommentary = getCommentary(match);

        if (updatedCommentary.miniScore.balls % 6 == 0) {
            swapBatsman(match);
        }
    }

    const updateCommentary = (match = {}, commentary = {}, takenRun) => {
        commentaryService.update({
            ...commentary,
            miniScore: {
                ...commentary.miniScore,
                totalBalls: commentary.miniScore.totalBalls + 1,
                balls: commentary.miniScore.balls + 1,
                scores: commentary.miniScore.scores + takenRun,
                wickets: commentary.miniScore.wickets + 0,
                overs: ballToOver(commentary.miniScore.balls + 1),
                batsmanStriker: {
                    ...commentary.miniScore.batsmanStriker,
                    runs: commentary.miniScore.batsmanStriker.runs + takenRun,
                    balls: commentary.miniScore.batsmanStriker.balls + 1,
                    dots: commentary.miniScore.batsmanStriker.dots + (takenRun == 0 ? 1 : 0),
                    ones: commentary.miniScore.batsmanStriker.ones + (takenRun == 1 ? 1 : 0),
                    twos: commentary.miniScore.batsmanStriker.twos + (takenRun == 2 ? 1 : 0),
                    threes: commentary.miniScore.batsmanStriker.threes + (takenRun == 3 ? 1 : 0),
                    fours: commentary.miniScore.batsmanStriker.fours + (takenRun == 4 ? 1 : 0),
                    fives: commentary.miniScore.batsmanStriker.fives + (takenRun == 5 ? 1 : 0),
                    sixes: commentary.miniScore.batsmanStriker.sixes + (takenRun == 6 ? 1 : 0),
                },
                bowlerStriker: {
                    ...commentary.miniScore.bowlerStriker,
                    runs: commentary.miniScore.bowlerStriker.runs + takenRun,
                    totalBalls: commentary.miniScore.bowlerStriker.totalBalls + 1,
                    balls: commentary.miniScore.bowlerStriker.balls + 1,
                    dots: commentary.miniScore.bowlerStriker.dots + (takenRun == 0 ? 1 : 0),
                    fours: commentary.miniScore.bowlerStriker.fours + (takenRun == 4 ? 1 : 0),
                    sixes: commentary.miniScore.bowlerStriker.sixes + (takenRun == 6 ? 1 : 0),
                    overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                },
                partnership: {
                    ...commentary.miniScore.partnership,
                    runs: commentary.miniScore.partnership.runs + takenRun,
                    balls: commentary.miniScore.partnership.balls + 1,
                    bat1Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat1Id ? commentary.miniScore.partnership.bat1Balls + 1 : commentary.miniScore.partnership.bat1Balls,
                    bat2Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat2Id ? commentary.miniScore.partnership.bat2Balls + 1 : commentary.miniScore.partnership.bat2Balls,
                    bat1Runs: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat1Id ? commentary.miniScore.partnership.bat1Runs + takenRun : commentary.miniScore.partnership.bat1Runs,
                    bat2Runs: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat2Id ? commentary.miniScore.partnership.bat2Runs + takenRun : commentary.miniScore.partnership.bat2Runs,
                },
                matchScoreDetails: {
                    ...commentary.miniScore.matchScoreDetails,
                    firstInnings: {
                        ...commentary.miniScore.matchScoreDetails.firstInnings,
                        score: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.score + takenRun : commentary.miniScore.matchScoreDetails.firstInnings.score,
                        balls: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.balls + 1 : commentary.miniScore.matchScoreDetails.firstInnings.balls,
                        wickets: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.wickets + 0 : commentary.miniScore.matchScoreDetails.firstInnings.wickets,
                        overs: commentary.miniScore.innings == 1 ? ballToOver(commentary.miniScore.matchScoreDetails.firstInnings.balls + 1) : ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls),
                    },
                    secondInnings: {
                        ...commentary.miniScore.matchScoreDetails.secondInnings,
                        score: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.score + takenRun : commentary.miniScore.matchScoreDetails.secondInnings.score,
                        balls: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.balls + 1 : commentary.miniScore.matchScoreDetails.secondInnings.balls,
                        wickets: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.wickets + 0 : commentary.miniScore.matchScoreDetails.secondInnings.wickets,
                        overs: commentary.miniScore.innings == 2 ? ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls + 1) : ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls),
                    }
                }
            }
        });

        let updatedCommentary = getCommentary(match);

        commentaryService.update({
            ...updatedCommentary,
            commentaryList: [
                createCommentaryEvent(updatedCommentary, takenRun),
                ...updatedCommentary.commentaryList
            ],
        })

        updatedCommentary = getCommentary(match);

        if (isLastBallOfOver(updatedCommentary)) {
            const [lastOverRuns] = getOverFullSummary(updatedCommentary, updatedCommentary.miniScore.overs - 1);
            commentaryService.update({
                ...updatedCommentary,
                miniScore: {
                    ...updatedCommentary.miniScore,
                    lastOverBowlerId: updatedCommentary.miniScore.bowlerStriker.id,
                    bowlerStriker: {
                        ...updatedCommentary.miniScore.bowlerStriker,
                        maidens: updatedCommentary.miniScore.bowlerStriker.maidens + (lastOverRuns == 0 ? 1 : 0),
                    }
                },
            })
        }
    }

    const createCommentaryEvent = (commentary, takenRun) => {
        let event = EVENT.NONE;
        switch (takenRun) {
            case 4:
                event = EVENT.FOUR;
                break;
            case 6:
                event = EVENT.SIX;
                break;
            default:
                break;
        }

        let commentaryEvent = new CommentaryEvent({
            inningsNumber: commentary.miniScore.innings,
            batsmanId: commentary.miniScore.batsmanStriker.id,
            batsmanName: commentary.miniScore.batsmanStriker.name,
            batsmanNickname: commentary.miniScore.batsmanStriker.nickname,
            bowlerId: commentary.miniScore.bowlerStriker.id,
            bowlerName: commentary.miniScore.bowlerStriker.name,
            bowlerNickname: commentary.miniScore.bowlerStriker.nickname,
            text: `${commentary.miniScore.bowlerStriker.nickname} to ${commentary.miniScore.batsmanStriker.nickname}, ${takenRun} run${takenRun > 1 ? "s" : ""}.`,
            totalBalls: commentary.miniScore.totalBalls,
            balls: commentary.miniScore.balls,
            overs: commentary.miniScore.overs,
            runs: takenRun,
            event: event,
        });

        if (commentaryEvent.balls % 6 == 0) {

            commentaryEvent = {
                ...commentaryEvent,
                overSeparator: new OverSeparator({
                    score: commentary.miniScore.scores,
                    overs: commentary.miniScore.overs,
                    wickets: commentary.miniScore.wickets,
                    overSummary: "",
                    runs: 0,
                    batStrikerId: commentary.miniScore.batsmanStriker.id,
                    batStrikerName: commentary.miniScore.batsmanStriker.name,
                    batStrikerNickname: commentary.miniScore.batsmanStriker.nickname,
                    batStrikerRuns: commentary.miniScore.batsmanStriker.runs,
                    batStrikerBalls: commentary.miniScore.batsmanStriker.balls,
                    batNonStrikerId: commentary.miniScore.batsmanNonStriker.id,
                    batNonStrikerName: commentary.miniScore.batsmanNonStriker.name,
                    batNonStrikerNickname: commentary.miniScore.batsmanNonStriker.nickname,
                    batNonStrikerRuns: commentary.miniScore.batsmanNonStriker.runs,
                    batNonStrikerBalls: commentary.miniScore.batsmanNonStriker.balls,
                    bowlerId: commentary.miniScore.bowlerStriker.id,
                    bowlerName: commentary.miniScore.bowlerStriker.name,
                    bowlerNickname: commentary.miniScore.bowlerStriker.nickname,
                    bowlerOvers: commentary.miniScore.bowlerStriker.overs,
                    bowlerMaidens: commentary.miniScore.bowlerStriker.maidens,
                    bowlerRuns: commentary.miniScore.bowlerStriker.runs,
                    bowlerWickets: commentary.miniScore.bowlerStriker.wickets,
                })
            }

            const [lastOverRuns, lastOverSummary] = getOverFullSummary(commentary, commentary.miniScore.overs - 1, commentaryEvent);

            commentaryEvent = {
                ...commentaryEvent,
                overSeparator: {
                    ...commentaryEvent.overSeparator,
                    bowlerMaidens: commentaryEvent.overSeparator.bowlerMaidens + (lastOverRuns == 0 ? 1 : 0),
                    overSummary: lastOverSummary,
                    runs: lastOverRuns,
                }
            }
        }

        return commentaryEvent;
    }

    const getOverFullSummary = (commentary, overNumber, currentCommentaryEvent) => {
        let thisOverCommentaryEvents = commentary.commentaryList.filter(item => {
            const overAndBall = parseInt(item.overs) == item.overs ? (item.overs - 0.4) : item.overs;
            return overNumber == parseInt(overAndBall);
        });

        if (currentCommentaryEvent) {
            thisOverCommentaryEvents = [
                currentCommentaryEvent,
                ...thisOverCommentaryEvents
            ]
        }

        const thisOverRuns = thisOverCommentaryEvents.reduce((previous, current) => {
            return previous + current.runs;
        }, 0)

        const thisOverSummary = thisOverCommentaryEvents.reduce((previous, current) => {
            return current.runs + " " + previous;
        }, "")

        return [thisOverRuns, thisOverSummary.trim()];
    }

    const swapBatsman = (match) => {
        const updatedCommentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

        commentaryService.update({
            ...updatedCommentary,
            miniScore: {
                ...updatedCommentary.miniScore,
                batsmanStriker: updatedCommentary.miniScore.batsmanNonStriker,
                batsmanNonStriker: updatedCommentary.miniScore.batsmanStriker,
            }
        })
    }

    const isLastBallOfOver = (commentary) => {
       return commentary.miniScore.balls % 6 == 0;
    }

    const ballToOver = (balls) => {
        return parseInt(balls / 6) + ((balls % 6) / 10)
    }

    return {
        runAndEvents,
        swapBatsman
    }
}

export default ScorerService;