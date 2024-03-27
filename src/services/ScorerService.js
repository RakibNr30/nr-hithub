import useCommentaryStore from "../stores/commentaryStore";
import CommentaryService from "./CommentaryService";
import CommentaryEvent from "../models/CommentaryEvent";
import {EVENT} from "../constants/commentary";

const ScorerService = () => {
    const commentaryService = CommentaryService();

    const run = (match = {}, takenRun = 0) => {
        let commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

        switch (takenRun) {
            case 0:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            dots: commentary.miniScore.batsmanStriker.dots + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            dots: commentary.miniScore.bowlerStriker.dots + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        },
                        partnership: {
                            ...commentary.miniScore.partnership,
                            balls: commentary.miniScore.partnership.balls + 1,
                            bat1Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat1Id ? commentary.miniScore.partnership.bat1Balls + 1 : commentary.miniScore.partnership.bat1Balls,
                            bat2Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat2Id ? commentary.miniScore.partnership.bat2Balls + 1 : commentary.miniScore.partnership.bat2Balls,
                        },
                        matchScoreDetails: {
                            ...commentary.miniScore.matchScoreDetails,
                            firstInnings: {
                                ...commentary.miniScore.matchScoreDetails.firstInnings,
                                balls: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.balls + 1 : commentary.miniScore.matchScoreDetails.secondInnings.balls + 1,
                                overs: commentary.miniScore.innings == 1 ? ballToOver(commentary.miniScore.matchScoreDetails.firstInnings.balls + 1) : ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls + 1),
                            }
                        }
                    }
                });
                break;
            case 1:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 1,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 1,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            ones: commentary.miniScore.batsmanStriker.ones + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 1,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });

                commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

                commentaryService.update({
                    ...commentary,
                    miniScore: {
                        ...commentary.miniScore,
                        batsmanStriker: commentary.miniScore.batsmanNonStriker,
                        batsmanNonStriker: commentary.miniScore.batsmanStriker,
                    }
                })
                break;
            case 2:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 2,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 2,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            twos: commentary.miniScore.batsmanStriker.twos + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 2,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });
                break;
            case 3:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 3,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 3,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            threes: commentary.miniScore.batsmanStriker.threes + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 3,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });

                commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

                commentaryService.update({
                    ...commentary,
                    miniScore: {
                        ...commentary.miniScore,
                        batsmanStriker: commentary.miniScore.batsmanNonStriker,
                        batsmanNonStriker: commentary.miniScore.batsmanStriker,
                    }
                })
                break;
            case 4:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 4,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 4,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            fours: commentary.miniScore.batsmanStriker.fours + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 4,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            fours: commentary.miniScore.bowlerStriker.fours + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });
                break;
            case 5:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 5,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 1,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            fives: commentary.miniScore.batsmanStriker.fives + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 5,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });

                commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

                commentaryService.update({
                    ...commentary,
                    miniScore: {
                        ...commentary.miniScore,
                        batsmanStriker: commentary.miniScore.batsmanNonStriker,
                        batsmanNonStriker: commentary.miniScore.batsmanStriker,
                    }
                })
                break;
            case 6:
                commentaryService.update({
                    ...commentary,
                    commentaryList: [
                        ...commentary.commentaryList,
                        createCommentaryEvent(commentary, takenRun)
                    ],
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 6,
                        totalBalls: commentary.miniScore.totalBalls + 1,
                        balls: commentary.miniScore.balls + 1,
                        overs: ballToOver(commentary.miniScore.balls + 1),
                        batsmanStriker: {
                            ...commentary.miniScore.batsmanStriker,
                            runs: commentary.miniScore.batsmanStriker.runs + 6,
                            balls: commentary.miniScore.batsmanStriker.balls + 1,
                            sixes: commentary.miniScore.batsmanStriker.sixes + 1,
                        },
                        bowlerStriker: {
                            ...commentary.miniScore.bowlerStriker,
                            runs: commentary.miniScore.bowlerStriker.runs + 6,
                            balls: commentary.miniScore.bowlerStriker.balls + 1,
                            sixes: commentary.miniScore.bowlerStriker.sixes + 1,
                            overs: ballToOver(commentary.miniScore.bowlerStriker.balls + 1)
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    const ballToOver = (balls) => {
        return parseInt(balls / 6) + ((balls % 6) / 10)
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

        return new CommentaryEvent({
            inningsNumber: commentary.miniScore.innings,
            batsmanId: commentary.miniScore.batsmanStriker.id,
            batsmanName: commentary.miniScore.batsmanStriker.name,
            batsmanNickname: commentary.miniScore.batsmanStriker.nickname,
            bowlerId: commentary.miniScore.bowlerStriker.id,
            bowlerName: commentary.miniScore.bowlerStriker.name,
            bowlerNickname: commentary.miniScore.bowlerStriker.nickname,
            text: `${commentary.miniScore.bowlerStriker.nickname} to ${commentary.miniScore.batsmanStriker.nickname}, no run.`,
            totalBalls: commentary.miniScore.totalBalls + 1,
            balls: commentary.miniScore.balls + 1,
            overs: ballToOver(commentary.miniScore.balls + 1),
            runs: takenRun,
            event: event,
        })
    }

    return {
        run
    }
}

export default ScorerService;