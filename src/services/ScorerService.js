import useCommentaryStore from "../stores/commentaryStore";
import CommentaryService from "./CommentaryService";

const ScorerService = () => {
    const commentaryService = CommentaryService();

    const run = (match = {}, takenRun = 0) => {
        let commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

        switch (takenRun) {
            case 0:
                commentaryService.update({
                    ...commentary,
                    miniScore: {
                        ...commentary.miniScore,
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
                        }
                    }
                });
                break;
            case 1:
                commentaryService.update({
                    ...commentary,
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 1,
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
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 2,
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
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 3,
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
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 4,
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
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 5,
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
                    miniScore: {
                        ...commentary.miniScore,
                        scores: commentary.miniScore.scores + 6,
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
        return parseInt(balls/6) + ((balls%6)/10)
    }

    return {
        run
    }
}

export default ScorerService;