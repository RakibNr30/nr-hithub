import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import SelectField from "../../components/form/SelectField";
import CommentaryService from "../../services/CommentaryService";
import MatchService from "../../services/MatchService";
import TeamService from "../../services/TeamService";
import ScorecardService from "../../services/ScorecardService";
import wicketTypes from "../../constants/wicketTypes";
import ScorerService from "../../services/ScorerService";
import useCommentaryStore from "../../stores/commentaryStore";
import useScorecardStore from "../../stores/scorecardStore";

const ScorerWicketForm = ({defaultMatch = {}, takenRuns = 0, extras = {}, buttonLabel, setShowFormModal}) => {
    const matchService = MatchService();
    const commentaryService = CommentaryService();
    const scorecardService = ScorecardService();
    const scorerService = ScorerService();
    const teamService = TeamService();

    const [resetCounter, setResetCounter] = useState(0);
    const [match, setMatch] = useState(defaultMatch ? defaultMatch : {});

    const commentary = commentaryService.findByMatchId(match.id);
    const scorecard = scorecardService.findByMatchId(match.id);

    const getCommentary = (match) => {
        return useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);
    }
    const getScorecard = (match) => {
        return useScorecardStore.getState().scorecards.find(scorecard => scorecard.id == match.scorecardId);
    }

    const strikerBatter = {
        ...commentary.miniScore.batsmanStriker,
        value: commentary.miniScore.batsmanStriker.id,
        label: `${commentary.miniScore.batsmanStriker.name} (Striker)`
    };

    const nonStrikerBatter = {
        ...commentary.miniScore.batsmanNonStriker,
        value: commentary.miniScore.batsmanNonStriker.id,
        label: `${commentary.miniScore.batsmanNonStriker.name} (Non-striker)`
    };

    const strikerBowler = {
        ...commentary.miniScore.bowlerStriker,
        value: commentary.miniScore.bowlerStriker.id,
        label: commentary.miniScore.bowlerStriker.name
    };

    const [wicketType, setWicketType] = useState(1);
    const [wicketBatsman, setWicketBatsman] = useState(strikerBatter);
    const [helperFielder, setHelperFielder] = useState({});
    const [newBatsman, setNewBatsman] = useState({});

    const battingTeam = teamService.findById(commentary.miniScore.batTeamId == match.team1Id ? match.team1Id : match.team2Id);
    const bowlingTeam = teamService.findById(commentary.miniScore.batTeamId == match.team1Id ? match.team2Id : match.team1Id);

    let battingSquads = battingTeam.id == match.team1Id ? match.team1Players : match.team2Players;
    let bowlingSquads = bowlingTeam.id == match.team1Id ? match.team1Players : match.team2Players;

    const alreadyBattedPlayers = commentary.miniScore.innings == 1 ? scorecard.firstInnings.battingDetails.teamBatsmen : scorecard.secondInnings.battingDetails.teamBatsmen;

    battingSquads = battingSquads
        .filter(item => !alreadyBattedPlayers.some(batter => batter.id == item.id))
        .map(item => {
            return {...item, label: `${item.name} (${item.role})`, value: item.id}
        });
    bowlingSquads = bowlingSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "wicketType":
                setWicketType(e.target.value)
                break;
            case "wicketBatsmanId":
                setWicketBatsman(e.target.value == strikerBatter.id ? strikerBatter : nonStrikerBatter);
                break;
            case "helperFielderId":
                setHelperFielder(bowlingSquads.find(item => item.id == e.target.value))
                break;
            case "newBatsmanId":
                setNewBatsman(battingSquads.find(item => item.id == e.target.value));
                break;
            default:
                break;
        }
    }

    const onRunAndWicketHandler = () => {

        const updatedCommentary = getCommentary(match);

        if (Object.keys(newBatsman).length <= 0 && updatedCommentary.miniScore.wickets < 9) {
            return;
        }

        scorerService.runAndEvents(match, takenRuns, extras, {
            wicketType: wicketType,
            wicketBatsman: wicketBatsman,
            bowler: strikerBowler,
            helperFielder: helperFielder,
            newBatsman: {...newBatsman, order: updatedCommentary.miniScore.wickets + 3},
        });
    }

    return (<Form>
            <Row>
                <Col xs={12}>
                    <SelectField
                        fieldName="wicketType"
                        fieldLabel="Wicket Type"
                        options={wicketTypes.getAll().filter(item => {
                            if (takenRuns > 0) {
                                return item.value == wicketTypes.run
                            }

                            return true;
                        })}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                {wicketType == wicketTypes.run &&
                    <Col xs={12}>
                        <SelectField
                            fieldName="wicketBatsmanId"
                            fieldLabel="Who got out?"
                            options={[strikerBatter, nonStrikerBatter]}
                            handler={onChangeHandler}
                            resetCounter={resetCounter}
                        />
                    </Col>
                }
                {(wicketType == wicketTypes.run || wicketType == wicketTypes.catch || wicketType == wicketTypes.stumped) &&
                    <Col xs={12}>
                        <SelectField
                            fieldName="helperFielderId"
                            fieldLabel="Who helped?"
                            options={bowlingSquads}
                            handler={onChangeHandler}
                            resetCounter={resetCounter}
                        />
                    </Col>
                }
                {battingSquads.length > 0 &&
                    <Col xs={12}>
                        <SelectField
                            fieldName="newBatsmanId"
                            fieldLabel="New Batsman"
                            options={battingSquads}
                            handler={onChangeHandler}
                            resetCounter={resetCounter}
                        />
                    </Col>
                }
                <Col xs={12}>
                    <FormGroup className="float-end">
                        <Button variant="secondary" onClick={reset}>
                            Clear
                        </Button>
                        <Button variant="primary" className="ms-2" onClick={() => {
                            onRunAndWicketHandler();
                            setShowFormModal(false);
                        }}>
                            {buttonLabel}
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>)
}

export default ScorerWicketForm;