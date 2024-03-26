import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import InputField from "../../components/form/InputField";
import SelectField from "../../components/form/SelectField";
import TeamService from "../../services/TeamService";
import PlayerService from "../../services/PlayerService";
import {TOSS_DECISION} from "../../constants/match";
import MultiSelectField from "../../components/form/MultiSelectField";

const MatchTossForm = ({defaultMatch = {}, buttonLabel, setShowFormModal, handleSubmit}) => {

    const teamService = TeamService();
    const playerService = PlayerService();

    const [resetCounter, setResetCounter] = useState(0);
    const [match, setMatch] = useState(defaultMatch ? defaultMatch : {});

    const team1 = teamService.findById(match.team1Id);
    const team2 = teamService.findById(match.team2Id);
    const team1Players = playerService.findAllByTeamId(match.team1Id).map(item => {return {...item, label: `${item.name} (${item.role})`}});
    const team2Players = playerService.findAllByTeamId(match.team2Id).map(item => {return {...item, label: `${item.name} (${item.role})`}});

    const teamOptions = [
        {label: team1.name, value: team1.id},
        {label: team2.name, value: team2.id},
    ];

    const decisionOptions = [
        {label: "BAT", value: TOSS_DECISION.BAT},
        {label: "BOWL", value: TOSS_DECISION.BOWL},
    ];

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "tossWinnerId":
                const tossWinner = e.target.value == team1.id ? team1 : team2;
                setMatch({
                    ...match, tossResult: {
                        ...match.tossResult,
                        winnerId: tossWinner.id,
                        winnerName: tossWinner.name,
                        winningTeamCode: tossWinner.code
                    },
                });
                break;
            case "tossDecision":
                setMatch({
                    ...match, tossResult: {...match.tossResult, decision: e.target.value},
                });
                break;
            default:
                break;
        }
    }

    const onTeam1SquadSelect = (values) => {
        setMatch({
            ...match, team1Players: values
        })
    }

    const onTeam2SquadSelect = (values) => {
        setMatch({
            ...match, team2Players: values
        })
    }

    return (
        <Form>
            <Row>
                <Col xs={6}>
                    <SelectField
                        fieldName="tossWinnerId"
                        fieldLabel="Winner"
                        options={teamOptions}
                        defaultValue={match.tossResult.winnerId}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={6}>
                    <SelectField
                        fieldName="tossDecision"
                        fieldLabel="Decision"
                        options={decisionOptions}
                        defaultValue={match.tossResult.decision}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12} className="mb-3">
                    <MultiSelectField
                        fieldLabel={`${team1.name} Squad`}
                        options={team1Players}
                        multiSelectHandler={onTeam1SquadSelect}
                    />
                </Col>
                <Col xs={12} className="mb-3">
                    <MultiSelectField
                        fieldLabel={`${team2.name} Squad`}
                        options={team2Players}
                        multiSelectHandler={onTeam2SquadSelect}
                    />
                </Col>
                <Col xs={12}>
                    <FormGroup className="float-end">
                        <Button variant="secondary" onClick={reset}>
                            Clear
                        </Button>
                        <Button variant="primary" className="ms-2" onClick={() => {
                            handleSubmit(match);
                            setShowFormModal(false);
                        }}>
                            {buttonLabel}
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}

export default MatchTossForm;