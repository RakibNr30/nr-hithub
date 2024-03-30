import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import SelectField from "../../components/form/SelectField";
import Batsman from "../../models/Batsman";
import Bowler from "../../models/Bowler";
import CommentaryService from "../../services/CommentaryService";
import MatchService from "../../services/MatchService";
import TeamService from "../../services/TeamService";
import Partnership from "../../models/Partnarship";
import ScorecardService from "../../services/ScorecardService";

const MatchSecondInningsStartForm = ({defaultMatch = {}, buttonLabel, setShowFormModal}) => {
    const matchService = MatchService();
    const commentaryService = CommentaryService();
    const scorecardService = ScorecardService();
    const teamService = TeamService();

    const [resetCounter, setResetCounter] = useState(0);
    const [match, setMatch] = useState(defaultMatch ? defaultMatch : {});
    const [strikers, setStrikers] = useState([]);
    const [striker, setStriker] = useState({});
    const [nonStrikers, setNonStrikers] = useState([]);
    const [nonStriker, setNonStriker] = useState({});
    const [openingBowler, setOpeningBowler] = useState({});

    const battingTeam = teamService.findById(match.tossResult.batFirstTeamId == match.team1Id ? match.team2Id : match.team1Id);
    const bowlingTeam = teamService.findById(match.tossResult.batFirstTeamId == match.team2Id ? match.team2Id : match.team1Id);

    let battingSquads = battingTeam.id == match.team1Id ? match.team1Players : match.team2Players;
    let bowlingSquads = bowlingTeam.id == match.team1Id ? match.team1Players : match.team2Players;

    battingSquads = battingSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });
    bowlingSquads = bowlingSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });

    useEffect(() => {
        setStrikers(battingSquads);
        reset();
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "strikerId":
                setNonStrikers(strikers.filter(item => item.value != e.target.value))
                setStriker(battingSquads.find(item => item.id == e.target.value));
                setNonStriker(strikers.filter(item => item.value != e.target.value)[0]);
                break;
            case "nonStrikerId":
                setNonStriker(battingSquads.find(item => item.id == e.target.value));
                break;
            case "openingBowlerId":
                setOpeningBowler(bowlingSquads.find(item => item.id == e.target.value));
                break;
            default:
                break;
        }
    }

    const handleMatchSecondInningsStart = (match, openers = {}) => {

        const commentary = commentaryService.findByMatchId(match.id);

        commentaryService.update({
            ...commentary,
            preSecondInningsCommentaries: [
                ...commentary.preSecondInningsCommentaries,
                `${striker.name} and ${nonStriker.name} are comes to the crease. ${striker.name} is on strike. ${openingBowler.name} will open the attack. ${commentary.miniScore.matchScoreDetails.secondInnings.batTeamName} need ${commentary.miniScore.target} runs from ${match.over} overs.`
            ],
            miniScore: {
                ...commentary.miniScore,
                innings: 2,
                batTeamId: match.tossResult.batFirstTeamId == match.team1Id ? match.team2Id : match.team1Id,
                scores: 0,
                wickets: 0,
                overs: 0.0,
                balls: 0,
                totalBalls: 0,
                lastWicket: {},
                lastOverBowlerId: null,
                isOverBreak: false,
                isInningsBreak: false,
                batsmanStriker: new Batsman({...striker, order: 1}),
                batsmanNonStriker: new Batsman({...nonStriker, order: 2}),
                bowlerStriker: new Bowler({...openingBowler, order: 1, canMaxOvers: parseInt(match.over/5)}),
                partnership: new Partnership({
                    bat1Id: striker.id,
                    bat1Name: striker.name,
                    bat1Nickname: striker.nickname,
                    bat2Id: nonStriker.id,
                    bat2Name: nonStriker.name,
                    bat2Nickname: nonStriker.nickname,
                }),
            }
        })

        const scorecard = scorecardService.findByMatchId(match.id);

        scorecardService.update({
            ...scorecard,
            secondInnings: {
                ...scorecard.secondInnings,
                battingDetails: {
                    ...scorecard.secondInnings.battingDetails,
                    teamBatsmen: [
                        new Batsman({
                            ...striker,
                            order: 1,
                        }),
                        new Batsman({
                            ...nonStriker,
                            order: 2,
                        }),
                    ]
                },
                bowlingDetails: {
                    ...scorecard.secondInnings.bowlingDetails,
                    teamBowlers: [
                        new Bowler({
                            ...openingBowler,
                            order: 1,
                            canMaxOvers: parseInt(match.over/5)
                        }),
                    ]
                },
                partnership: new Partnership({
                    bat1Id: striker.id,
                    bat1Name: striker.name,
                    bat1Nickname: striker.nickname,
                    bat2Id: nonStriker.id,
                    bat2Name: nonStriker.name,
                    bat2Nickname: nonStriker.nickname,
                }),
            },
        })

        matchService.update({
            ...match,
            batTeamId: match.tossResult.batFirstTeamId == match.team1Id ? match.team2Id : match.team1Id,
            runningInnings: 2,
            hasSecondInnings: true,
        })
    }

    return (<Form>
            <Row>
                <Col xs={12}>
                    <SelectField
                        fieldName="strikerId"
                        fieldLabel="Striker"
                        options={strikers}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12}>
                    <SelectField
                        fieldName="nonStrikerId"
                        fieldLabel="Non-striker"
                        options={nonStrikers}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12}>
                    <SelectField
                        fieldName="openingBowlerId"
                        fieldLabel="Opening Bowler"
                        options={bowlingSquads}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12}>
                    <FormGroup className="float-end">
                        <Button variant="secondary" onClick={reset}>
                            Clear
                        </Button>
                        <Button variant="primary" className="ms-2" onClick={() => {
                            handleMatchSecondInningsStart(match);
                            setShowFormModal(false);
                        }}>
                            {buttonLabel}
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>)
}

export default MatchSecondInningsStartForm;