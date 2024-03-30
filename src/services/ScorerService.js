import useCommentaryStore from "../stores/commentaryStore";
import CommentaryEvent from "../models/CommentaryEvent";
import {EVENT, EXTRAS, MILESTONE} from "../constants/commentary";
import OverSeparator from "../models/OverSeparator";
import CommentaryService from "./CommentaryService";
import ScorecardService from "./ScorecardService";
import useScorecardStore from "../stores/scorecardStore";
import Bowler from "../models/Bowler";
import MatchService from "./MatchService";
import {STAGE} from "../constants/match";
import moment from "moment";
import Batsman from "../models/Batsman";
import Partnership from "../models/Partnarship";
import wicketTypes from "../constants/wicketTypes";

const ScorerService = () => {
    const matchService = MatchService();
    const commentaryService = CommentaryService();
    const scorecardService = ScorecardService();

    const getCommentary = (match) => {
        return  useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);
    }
    const getScorecard = (match) => {
        return  useScorecardStore.getState().scorecards.find(scorecard => scorecard.id == match.scorecardId);
    }

    const runAndEvents = (match = {}, takenRun = 0, extras = {isWide: false, isNoBall: false, isByes: false, isLegByes: false}, wicketDetails = {}) => {
        const commentary = getCommentary(match);

        updateCommentary(match, commentary, takenRun, extras, wicketDetails);
        updateScorecard(match);

        switch (takenRun) {
            case 1:
            case 3:
            case 5:
                swapBatsman(match);
                break;
            default:
                break;
        }

        let updatedCommentary = getCommentary(match);

        if (!updatedCommentary.miniScore.isLastBallExtra && updatedCommentary.miniScore.balls % 6 == 0) {
            swapBatsman(match);
        }

        updatedCommentary = getCommentary(match);

        if (isMatchEnded(match, updatedCommentary)) {
            const matchResult = getMatchResult(updatedCommentary);
            matchService.update({
                ...match,
                batTeamId: null,
                runningInnings: null,
                matchResult: matchResult,
                stage: STAGE.END
            })

            const commentaryText = `${matchResult.isMatchTie ? "Amidst an intense battle, neither team could claim victory, as the match concludes in a thrilling tie, leaving both sides with a shared sense of accomplishment and frustration." : `The ${matchResult.isWinByRuns ? "fielding" : "batting"} side celebrates in jubilation, their hard work and determination paying off in the end. Commiserations to the ${matchResult.isWinByRuns ? "batting" : "fielding"} team.`}`

            commentaryService.update({
                ...updatedCommentary,
                commentaryList: [
                    ...updatedCommentary.commentaryList,
                ],
                postSecondInningsCommentaries: [
                    ...updatedCommentary.postSecondInningsCommentaries,
                    `${commentaryText}`,
                    `${matchResult.isMatchTie ? "Match is tie." : `${matchResult.winningTeamName} won the match by ${matchResult.winningMargin} ${matchResult.isWinByRuns ? "run" : "wicket"}${matchResult.winningMargin > 1 ? "s" : ""}.`}`
                ],
                miniScore: {
                    ...updatedCommentary.miniScore,
                    innings: 0,
                    batTeamId: null,
                    scores: 0,
                    wickets: 0,
                    overs: 0.0,
                    balls: 0,
                    totalBalls: 0,
                    target: 0,
                    lastWicket: {},
                    lastOverBowlerId: null,
                    isLastBallExtra: false,
                    isOverBreak: false,
                    isInningsBreak: false,
                    batsmanStriker: new Batsman({}),
                    batsmanNonStriker: new Batsman({}),
                    bowlerStriker: new Bowler({}),
                    partnership: new Partnership({}),
                }
            })
        }
    }

    /* update commentary */
    const updateCommentary = (match = {}, commentary = {}, takenRun, extras = {isWide: false, isNoBall: false, isByes: false, isLegByes: false}, wicketDetails = {}) => {

        let ballCount = 1;
        let runCount = takenRun;
        let batterBallCount = 1;
        let batterRunCount = takenRun;
        let bowlerRunCount = takenRun;
        let hasExtraBall = false;

        if (extras.isWide) {
            ballCount = 0;
            batterBallCount = 0;
            runCount += 1;
            batterRunCount = 0;
            bowlerRunCount += 1;
            hasExtraBall = true;
        }

        if (extras.isByes || extras.isLegByes) {
            batterBallCount = 1;
            batterRunCount = 0;
            bowlerRunCount = 0;
        }

        if (extras.isNoBall) {
            ballCount = 0;
            runCount += 1;
            batterBallCount = 1;
            bowlerRunCount += 1;
            hasExtraBall = true;

            if (extras.isByes || extras.isLegByes) {
                batterRunCount = 0;
            }
        }

        commentaryService.update({
            ...commentary,
            miniScore: {
                ...commentary.miniScore,
                totalBalls: commentary.miniScore.totalBalls + 1,
                balls: commentary.miniScore.balls + ballCount,
                scores: commentary.miniScore.scores + runCount,
                overs: ballToOver(commentary.miniScore.balls + ballCount),
                isLastBallExtra: hasExtraBall,
                wickets: commentary.miniScore.wickets + 0,
                batsmanStriker: {
                    ...commentary.miniScore.batsmanStriker,
                    runs: commentary.miniScore.batsmanStriker.runs + batterRunCount,
                    balls: commentary.miniScore.batsmanStriker.balls + batterBallCount,
                    dots: commentary.miniScore.batsmanStriker.dots + (batterRunCount == 0 ? 1 : 0),
                    ones: commentary.miniScore.batsmanStriker.ones + (batterRunCount == 1 ? 1 : 0),
                    twos: commentary.miniScore.batsmanStriker.twos + (batterRunCount == 2 ? 1 : 0),
                    threes: commentary.miniScore.batsmanStriker.threes + (batterRunCount == 3 ? 1 : 0),
                    fours: commentary.miniScore.batsmanStriker.fours + (batterRunCount == 4 ? 1 : 0),
                    fives: commentary.miniScore.batsmanStriker.fives + (batterRunCount == 5 ? 1 : 0),
                    sixes: commentary.miniScore.batsmanStriker.sixes + (batterRunCount == 6 ? 1 : 0),
                },
                bowlerStriker: {
                    ...commentary.miniScore.bowlerStriker,
                    runs: commentary.miniScore.bowlerStriker.runs + bowlerRunCount,
                    totalBalls: commentary.miniScore.bowlerStriker.totalBalls + 1,
                    balls: commentary.miniScore.bowlerStriker.balls + ballCount,
                    dots: commentary.miniScore.bowlerStriker.dots + (bowlerRunCount == 0 ? 1 : 0),
                    fours: commentary.miniScore.bowlerStriker.fours + (bowlerRunCount == 4 ? 1 : 0),
                    sixes: commentary.miniScore.bowlerStriker.sixes + (bowlerRunCount == 6 ? 1 : 0),
                    wideBalls: commentary.miniScore.bowlerStriker.wideBalls + (extras.isWide ? 1 : 0),
                    noBalls: commentary.miniScore.bowlerStriker.noBalls + (extras.isNoBall ? 1 : 0),
                    overs: ballToOver(commentary.miniScore.bowlerStriker.balls + ballCount)
                },
                partnership: {
                    ...commentary.miniScore.partnership,
                    runs: commentary.miniScore.partnership.runs + runCount,
                    balls: commentary.miniScore.partnership.balls + batterBallCount,
                    bat1Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat1Id ? commentary.miniScore.partnership.bat1Balls + batterBallCount : commentary.miniScore.partnership.bat1Balls,
                    bat2Balls: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat2Id ? commentary.miniScore.partnership.bat2Balls + batterBallCount : commentary.miniScore.partnership.bat2Balls,
                    bat1Runs: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat1Id ? commentary.miniScore.partnership.bat1Runs + batterRunCount : commentary.miniScore.partnership.bat1Runs,
                    bat2Runs: commentary.miniScore.batsmanStriker.id == commentary.miniScore.partnership.bat2Id ? commentary.miniScore.partnership.bat2Runs + batterRunCount : commentary.miniScore.partnership.bat2Runs,
                },
                matchScoreDetails: {
                    ...commentary.miniScore.matchScoreDetails,
                    firstInnings: {
                        ...commentary.miniScore.matchScoreDetails.firstInnings,
                        score: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.score + runCount : commentary.miniScore.matchScoreDetails.firstInnings.score,
                        balls: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.balls + ballCount : commentary.miniScore.matchScoreDetails.firstInnings.balls,
                        totalBalls: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.totalBalls + 1 : commentary.miniScore.matchScoreDetails.firstInnings.totalBalls,
                        wickets: commentary.miniScore.innings == 1 ? commentary.miniScore.matchScoreDetails.firstInnings.wickets + 0 : commentary.miniScore.matchScoreDetails.firstInnings.wickets,
                        overs: commentary.miniScore.innings == 1 ? ballToOver(commentary.miniScore.matchScoreDetails.firstInnings.balls + ballCount) : ballToOver(commentary.miniScore.matchScoreDetails.firstInnings.balls),
                    },
                    secondInnings: {
                        ...commentary.miniScore.matchScoreDetails.secondInnings,
                        score: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.score + runCount : commentary.miniScore.matchScoreDetails.secondInnings.score,
                        balls: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.balls + ballCount : commentary.miniScore.matchScoreDetails.secondInnings.balls,
                        totalBalls: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.totalBalls + 1 : commentary.miniScore.matchScoreDetails.secondInnings.totalBalls,
                        wickets: commentary.miniScore.innings == 2 ? commentary.miniScore.matchScoreDetails.secondInnings.wickets + 0 : commentary.miniScore.matchScoreDetails.secondInnings.wickets,
                        overs: commentary.miniScore.innings == 2 ? ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls + ballCount) : ballToOver(commentary.miniScore.matchScoreDetails.secondInnings.balls),
                    }
                }
            }
        });

        let updatedCommentary = getCommentary(match);

        let prevBatsmanStriker = updatedCommentary.miniScore.batsmanStriker;
        let prevBatsmanNonStriker = updatedCommentary.miniScore.batsmanNonStriker;

        if (Object.keys(wicketDetails).length > 0) {
            let batsmanStriker = updatedCommentary.miniScore.batsmanStriker.id == wicketDetails.wicketBatsman.id
                ? new Batsman({...wicketDetails.newBatsman})
                : updatedCommentary.miniScore.batsmanStriker;

            let batsmanNonStriker = updatedCommentary.miniScore.batsmanNonStriker.id == wicketDetails.wicketBatsman.id
                ? new Batsman({...wicketDetails.newBatsman})
                : updatedCommentary.miniScore.batsmanNonStriker;

            if (batsmanStriker.id == batsmanNonStriker.id) {
                throw new Error("Something went wrong!");
            }

            let bowlerWicketCount = 1;

            if (wicketDetails.wicketType == wicketTypes.run) {
                bowlerWicketCount = 0;
            }

            let lastWicket = wicketDetails.wicketBatsman.id == prevBatsmanStriker.id ? prevBatsmanStriker : prevBatsmanNonStriker;

            lastWicket = {
                ...lastWicket,
                isOut: true,
                bowlerId: wicketDetails?.bowler?.id,
                bowlerName: wicketDetails?.bowler?.name,
                bowlerNickname: wicketDetails?.bowler?.nickname,
                fielderId: wicketDetails?.helperFielder?.id,
                fielderName: wicketDetails?.helperFielder?.name,
                fielderNickname: wicketDetails?.helperFielder?.nickname,
                wicketCode: wicketDetails?.wicketType
            }

            commentaryService.update({
                ...updatedCommentary,
                miniScore: {
                    ...updatedCommentary.miniScore,
                    wickets: updatedCommentary.miniScore.wickets + 1,
                    batsmanStriker: batsmanStriker,
                    batsmanNonStriker: batsmanNonStriker,
                    lastWicket: lastWicket,
                    bowlerStriker: {
                        ...updatedCommentary.miniScore.bowlerStriker,
                        wickets: updatedCommentary.miniScore.bowlerStriker.wickets + bowlerWicketCount,
                    },
                    partnership: new Partnership({
                        bat1Id: batsmanStriker.id,
                        bat1Name: batsmanStriker.name,
                        bat1Nickname: batsmanStriker.nickname,
                        bat2Id: batsmanNonStriker.id,
                        bat2Name: batsmanNonStriker.name,
                        bat2Nickname: batsmanNonStriker.nickname,
                    }),
                    matchScoreDetails: {
                        ...updatedCommentary.miniScore.matchScoreDetails,
                        firstInnings: {
                            ...updatedCommentary.miniScore.matchScoreDetails.firstInnings,
                            wickets: updatedCommentary.miniScore.innings == 1 ? updatedCommentary.miniScore.matchScoreDetails.firstInnings.wickets + 1 : updatedCommentary.miniScore.matchScoreDetails.firstInnings.wickets,
                        },
                        secondInnings: {
                            ...updatedCommentary.miniScore.matchScoreDetails.secondInnings,
                            wickets: updatedCommentary.miniScore.innings == 2 ? updatedCommentary.miniScore.matchScoreDetails.secondInnings.wickets + 1 : updatedCommentary.miniScore.matchScoreDetails.secondInnings.wickets,
                        }
                    }
                }
            });

            updatedCommentary = getCommentary(match);

            if (updatedCommentary.miniScore.wickets >= 10) {
                batsmanStriker = lastWicket.id == batsmanStriker.id ? batsmanNonStriker : batsmanStriker;
                commentaryService.update({
                    ...updatedCommentary,
                    miniScore: {
                        ...updatedCommentary.miniScore,
                        batsmanStriker: batsmanStriker,
                        batsmanNonStriker: {},
                        partnership: {},
                    }
                });
            }
        }

        updatedCommentary = getCommentary(match);

        commentaryService.update({
            ...updatedCommentary,
            commentaryList: [
                createCommentaryEvent(updatedCommentary, takenRun, extras, wicketDetails, prevBatsmanStriker, prevBatsmanNonStriker),
                ...updatedCommentary.commentaryList
            ],
        })

        updatedCommentary = getCommentary(match);

        if (!updatedCommentary.miniScore.isLastBallExtra && isLastBallOfOver(updatedCommentary)) {
            const [lastOverRuns] = getOverFullSummary(updatedCommentary, updatedCommentary.miniScore.overs - 1);
            commentaryService.update({
                ...updatedCommentary,
                miniScore: {
                    ...updatedCommentary.miniScore,
                    lastOverBowlerId: updatedCommentary.miniScore.bowlerStriker.id,
                    isOverBreak: true,
                    bowlerStriker: {
                        ...updatedCommentary.miniScore.bowlerStriker,
                        maidens: updatedCommentary.miniScore.bowlerStriker.maidens + (lastOverRuns == 0 ? 1 : 0),
                    }
                },
            })
        }

        updatedCommentary = getCommentary(match);

        if (isLastBallOfInnings(match, updatedCommentary) || isLastWicketOf1stInnings(match, updatedCommentary)) {
            commentaryService.update({
                ...updatedCommentary,
                postFirstInningsCommentaries: [
                    ...updatedCommentary.postFirstInningsCommentaries,
                    `After end of the innings ${commentary.miniScore.matchScoreDetails.firstInnings.batTeamName} collects ${commentary.miniScore.matchScoreDetails.firstInnings.score} runs. Back for ${commentary.miniScore.matchScoreDetails.secondInnings.batTeamName}'s reply in few minutes...`
                ],
                miniScore: {
                    ...updatedCommentary.miniScore,
                    isLastBallExtra: false,
                    isOverBreak: false,
                    isInningsBreak: true,
                    target: updatedCommentary.miniScore.scores + 1
                },
            })
        }
    }

    const changeBowlingStriker = (match, bowler) => {
        const scorecard = getScorecard(match);
        const commentary = getCommentary(match);

        let teamBowlers = commentary.miniScore.innings == 1
            ? scorecard.firstInnings.bowlingDetails.teamBowlers
            : scorecard.secondInnings.bowlingDetails.teamBowlers;

        const existingBowlerIndex = teamBowlers.findIndex(item => item.id == bowler.id);

        const currentOrder = teamBowlers.length;

        commentaryService.update({
            ...commentary,
            miniScore: {
                ...commentary.miniScore,
                isOverBreak: false,
                isLastBallExtra: false,
                bowlerStriker: existingBowlerIndex != -1
                    ? teamBowlers[existingBowlerIndex] :
                    new Bowler({...bowler, order: currentOrder + 1, canMaxOvers: parseInt(match.over/5)}),
            }
        });

        updateScorecard(match);
    }

    const makeManOfTheMatch = (match, player) => {
        matchService.update({
            ...match,
            manOfTheMatch: player
        })
    }

    /* update scorecard section */
    const updateScorecard = (match = {}) => {
        const commentary = getCommentary(match);
        const scorecard = getScorecard(match);

        switch (commentary.miniScore.innings) {
            case 1:
                scorecardService.update({
                    ...scorecard,
                    firstInnings: {
                        ...scorecard.firstInnings,
                        battingDetails: {
                            ...scorecard.firstInnings.battingDetails,
                            teamBatsmen: updateOrAddBatsman(match, commentary.miniScore.batsmanStriker, commentary.miniScore.batsmanNonStriker, scorecard.firstInnings.battingDetails.teamBatsmen)
                        },
                        bowlingDetails: {
                            ...scorecard.firstInnings.bowlingDetails,
                            teamBowlers: updateOrAddBowler(match, commentary.miniScore.bowlerStriker, scorecard.firstInnings.bowlingDetails.teamBowlers)
                        }
                    }
                })
                break;
            case 2:
                scorecardService.update({
                    ...scorecard,
                    secondInnings: {
                        ...scorecard.secondInnings,
                        battingDetails: {
                            ...scorecard.secondInnings.battingDetails,
                            teamBatsmen: updateOrAddBatsman(match, commentary.miniScore.batsmanStriker, commentary.miniScore.batsmanNonStriker, scorecard.secondInnings.battingDetails.teamBatsmen)
                        },
                        bowlingDetails: {
                            ...scorecard.secondInnings.bowlingDetails,
                            teamBowlers: updateOrAddBowler(match, commentary.miniScore.bowlerStriker, scorecard.secondInnings.bowlingDetails.teamBowlers)
                        }
                    }
                })
                break;
            default:
                break;
        }
    }

    const updateOrAddBatsman = (match = {}, batStriker, batNonStriker, teamBatsmen) => {
        const existingStrikerIndex = teamBatsmen.findIndex(item => item.id === batStriker.id);
        if (existingStrikerIndex != -1) {
            teamBatsmen[existingStrikerIndex] = batStriker;
        } else {
            const currentOrder = teamBatsmen.length;
            teamBatsmen = [
                ...teamBatsmen,
                {
                    ...batStriker,
                    order: currentOrder + 1
                }
            ]
        }

        const existingNonStrikerIndex = teamBatsmen.findIndex(item => item.id === batNonStriker.id);
        if (existingNonStrikerIndex != -1) {
            teamBatsmen[existingNonStrikerIndex] = batNonStriker;
        } else {
            const currentOrder = teamBatsmen.length;
            teamBatsmen = [
                ...teamBatsmen,
                {
                    ...batNonStriker,
                    order: currentOrder + 1
                }
            ]
        }

        return teamBatsmen;
    }

    const updateOrAddBowler = (match = {}, bowler, teamBowlers) => {
        const existingBowlerIndex = teamBowlers.findIndex(item => item.id == bowler.id);
        if (existingBowlerIndex != -1) {
            teamBowlers[existingBowlerIndex] = bowler;
        } else {
            const currentOrder = teamBowlers.length;
            teamBowlers = [
                ...teamBowlers,
                {
                    ...bowler,
                    order: currentOrder + 1,
                    canMaxOvers: parseInt(match.over/5)
                }
            ]
        }

        return teamBowlers;
    }

    const createCommentaryEvent = (commentary, takenRun, extras = {isWide: false, isNoBall: false, isByes: false, isLegByes: false}, wicketDetails = {}, prevBatsmanStriker = {}, prevBatsmanNonStriker = {}) => {
        let event = EVENT.NONE;
        switch (takenRun) {
            case 4:
                event = (extras.isWide || extras.isByes || extras.isLegByes) ? EVENT.NONE : EVENT.FOUR;
                break;
            case 6:
                event = EVENT.SIX;
                break;
            default:
                break;
        }

        let runCount = takenRun;
        let extraRunCount = 0;
        let extraType = "";

        if (extras.isWide) {
            runCount += 1;
            extraRunCount += 1;
            extraType = EXTRAS.WIDE;
        }

        if (extras.isByes) {
            extraType = EXTRAS.BYES;
        }

        if (extras.isLegByes) {
            extraType = EXTRAS.LEG_BYES;
        }

        if (extras.isNoBall) {
            runCount += 1;
            extraRunCount += 1;
            extraType = EXTRAS.NO_BALL;

            /*if (extras.isByes) {
                extraType = EXTRAS.BYES;
            }

            if (extras.isLegByes) {
                extraType = EXTRAS.LEG_BYES;
            }*/
        }

        if (Object.keys(wicketDetails).length > 0) {
            event = EVENT.WICKET;
        }

        /* here some bugs for milestone */
        let milestone = null;

        if (commentary.miniScore.batsmanStriker.runs == 50) {
            milestone = MILESTONE.FIFTY;
        }
        if (commentary.miniScore.batsmanStriker.runs == 100) {
            milestone = MILESTONE.CENTURY
        }
        if (commentary.miniScore.batsmanStriker.runs == 200) {
            milestone = MILESTONE.DOUBLE_CENTURY
        }
        if (commentary.miniScore.batsmanStriker.runs == 300) {
            milestone = MILESTONE.TRIPLE_CENTURY
        }

        let commentaryEvent = new CommentaryEvent({
            inningsNumber: commentary.miniScore.innings,
            batsmanId: prevBatsmanStriker.id,
            batsmanName: prevBatsmanStriker.name,
            batsmanNickname: prevBatsmanStriker.nickname,
            bowlerId: commentary.miniScore.bowlerStriker.id,
            bowlerName: commentary.miniScore.bowlerStriker.name,
            bowlerNickname: commentary.miniScore.bowlerStriker.nickname,
            text: ``,
            milestone: milestone,
            totalBalls: commentary.miniScore.totalBalls,
            balls: commentary.miniScore.balls,
            overs: commentary.miniScore.overs,
            runs: runCount,
            extraRuns: extraRunCount,
            extraType: extraType,
            event: event,
            wicketDetails: event != EVENT.WICKET ? {} : commentary.miniScore.lastWicket
        });

        if (!commentary.miniScore.isLastBallExtra && commentaryEvent.balls % 6 == 0) {
            commentaryEvent = {
                ...commentaryEvent,
                overSeparator: new OverSeparator({
                    score: commentary.miniScore.scores,
                    overs: commentary.miniScore.overs,
                    wickets: commentary.miniScore.wickets,
                    overSummary: "",
                    runs: 0,
                    batStrikerId: prevBatsmanStriker.id,
                    batStrikerName: prevBatsmanStriker.name,
                    batStrikerNickname: prevBatsmanStriker.nickname,
                    batStrikerRuns: prevBatsmanStriker.runs,
                    batStrikerBalls: prevBatsmanStriker.balls,
                    batNonStrikerId: prevBatsmanNonStriker.id,
                    batNonStrikerName: prevBatsmanNonStriker.name,
                    batNonStrikerNickname: prevBatsmanNonStriker.nickname,
                    batNonStrikerRuns: prevBatsmanNonStriker.runs,
                    batNonStrikerBalls: prevBatsmanNonStriker.balls,
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
            const overAndBall = parseInt(item.overs) == item.overs ? (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : (item.overs - 0.4)) : (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : item.overs);
            return overNumber == parseInt(overAndBall) && item.inningsNumber == commentary.miniScore.innings;
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
            let total = current.runs;

            if (current.extraType) {
                total -= current.extraRuns;
                total = `${current.extraType}${total}`;
            }

            return total + " " + previous;
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

    const getMatchResult = (commentary) => {
        const firstInnings = commentary.miniScore.matchScoreDetails.firstInnings;
        const secondInnings = commentary.miniScore.matchScoreDetails.secondInnings;

        let winningTeamId = null;
        let winningTeamName = "";
        let winningTeamCode = "";
        let isMatchTie = false;
        let winningMargin = 0;
        let isWinByRuns = false;
        let ballsRemaining = 0;

        if (firstInnings.score > secondInnings.score) {
            winningTeamId = firstInnings.batTeamId;
            winningTeamName = firstInnings.batTeamName;
            winningTeamCode = firstInnings.batTeamCode;
            winningMargin = firstInnings.score - secondInnings.score;
            isWinByRuns = true;
        } else if (firstInnings.score < secondInnings.score) {
            winningTeamId = secondInnings.batTeamId;
            winningTeamName = secondInnings.batTeamName;
            winningTeamCode = secondInnings.batTeamCode;
            winningMargin = 10 - secondInnings.wickets;
        } else {
            isMatchTie = true;
        }

        return {
            winningTeamId: winningTeamId,
            winningTeamName: winningTeamName,
            winningTeamCode: winningTeamCode,
            isMatchTie: isMatchTie,
            winningMargin: winningMargin,
            isWinByRuns: isWinByRuns,
            ballsRemaining: ballsRemaining,
            time: moment().format()
        }
    }

    const isMatchEnded = (match, commentary) => {
        if (commentary.miniScore.innings == 1) return false;

        if (commentary.miniScore.target <= commentary.miniScore.scores) return true;

        if (commentary.miniScore.overs >= match.over) return true;

        if (commentary.miniScore.wickets >= 10) return true;
    }

    const isLastBallOfOver = (commentary) => {
       return commentary.miniScore.balls % 6 == 0;
    }

    const isLastBallOfInnings = (match, commentary) => {
        return match.over <= commentary.miniScore.overs;
    }

    const isLastWicketOf1stInnings = (match, commentary) => {
        return commentary.miniScore.wickets >= 10 && commentary.miniScore.innings == 1;
    }

    const ballToOver = (balls) => {
        return parseInt(balls / 6) + ((balls % 6) / 10)
    }

    const calculateRR = (runs, balls) => {
        return balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat(runs / (balls / 6)).toFixed(2)
    }

    return {
        runAndEvents,
        swapBatsman,
        changeBowlingStriker,
        makeManOfTheMatch,
        calculateRR
    }
}

export default ScorerService;