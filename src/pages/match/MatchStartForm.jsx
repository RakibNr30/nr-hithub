import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import SelectField from "../../components/form/SelectField";
import Commentary from "../../models/Commentary";
import Batsman from "../../models/Batsman";
import Bowler from "../../models/Bowler";
import {STAGE} from "../../constants/match";
import CommentaryService from "../../services/CommentaryService";
import MatchService from "../../services/MatchService";
import {uid} from "uid";
import Innings from "../../models/Innings";
import TeamService from "../../services/TeamService";
import Partnership from "../../models/Partnarship";
import Scorecard from "../../models/Scorecard";
import ScorecardInnings from "../../models/ScorecardInnings";
import ScorecardService from "../../services/ScorecardService";

const MatchStartForm = ({defaultMatch = {}, buttonLabel, setShowFormModal}) => {
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

    const battingTeam = teamService.findById(match.tossResult.batFirstTeamId == match.team1Id ? match.team1Id : match.team2Id);
    const bowlingTeam = teamService.findById(match.tossResult.batFirstTeamId == match.team2Id ? match.team1Id : match.team2Id);

    let batFirstSquads = battingTeam.id == match.team1Id ? match.team1Players : match.team2Players;
    let bowlFirstSquads = bowlingTeam.id == match.team1Id ? match.team1Players : match.team2Players;

    batFirstSquads = batFirstSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });
    bowlFirstSquads = bowlFirstSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });

    useEffect(() => {
        setStrikers(batFirstSquads);
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
                setStriker(batFirstSquads.find(item => item.id == e.target.value));
                break;
            case "nonStrikerId":
                setNonStriker(batFirstSquads.find(item => item.id == e.target.value));
                break;
            case "openingBowlerId":
                setOpeningBowler(bowlFirstSquads.find(item => item.id == e.target.value));
                break;
            default:
                break;
        }
    }

    const handleMatchStart = (match, openers = {}) => {
        const commentaryId = uid();
        commentaryService.save(new Commentary({
            id: commentaryId,
            matchId: match.id,
            miniScore: {
                innings: 1,
                batTeamId: match.tossResult.batFirstTeamId,
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
                matchScoreDetails: {
                    firstInnings: new Innings({
                        batTeamId: battingTeam.id,
                        batTeamName: battingTeam.name,
                        batTeamCode: battingTeam.code,
                    }),
                    secondInnings: new Innings({
                        batTeamId: bowlingTeam.id,
                        batTeamName: bowlingTeam.name,
                        batTeamCode: bowlingTeam.code,
                    }),
                    tossResult: match.tossResult
                }
            }
        }));

        const scorecardId = uid();
        scorecardService.save(new Scorecard({
            id: scorecardId,
            matchId: match.id,
            firstInnings: new ScorecardInnings({
                battingDetails: {
                    teamId: battingTeam.id,
                    teamName: battingTeam.name,
                    teamCode: battingTeam.code,
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
                    teamId: bowlingTeam.id,
                    teamName: bowlingTeam.name,
                    teamCode: bowlingTeam.code,
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
            }),
            secondInnings: new ScorecardInnings({
                battingDetails: {
                    teamId: bowlingTeam.id,
                    teamName: bowlingTeam.name,
                    teamCode: bowlingTeam.code,
                },
                bowlingDetails: {
                    teamId: battingTeam.id,
                    teamName: battingTeam.name,
                    teamCode: battingTeam.code,
                },
            }),
        }))

        matchService.update({
            ...match,
            stage: STAGE.IN_PROGRESS,
            commentaryId: commentaryId,
            scorecardId: scorecardId,
            runningInnings: 1
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
                        options={bowlFirstSquads}
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
                            handleMatchStart(match);
                            setShowFormModal(false);
                        }}>
                            {buttonLabel}
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>)
}

export default MatchStartForm;