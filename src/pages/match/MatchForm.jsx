import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import InputField from "../../components/form/InputField";
import SelectField from "../../components/form/SelectField";
import {series as seriesList} from "../../ds/series";
import {venus as venueList} from "../../ds/venus";
import {teams as teamList} from "../../ds/teams";

const MatchForm = ({defaultMatch = {}, buttonLabel, setShowFormModal, handleSubmit, isUpdate = false}) => {

    const [match, setMatch] = useState({});
    const [resetCounter, setResetCounter] = useState(0);
    const [team1Options, setTeam1Options] = useState([]);
    const [team2Options, setTeam2Options] = useState([]);

    const venues = venueList.map((item) => {return {label: `${item.ground}, ${item.city}, ${item.country}`, value: item.id}});
    const series = seriesList.map((item) => {return {label: item.title, value: item.id}});
    const teams = teamList.map((item) => {return {label: item.name, value: item.id}})

    useEffect(() => {
        reset();
        setTeam1Options(teams);
        setTeam2Options(teams);
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const onChangeHandler = (e) => {
        setMatch({ ...match, [e.target.name]: e.target.value });

        switch (e.target.name) {
            case "team1Id":
                setTeam2Options(teams.filter(item => item.value != e.target.value));
                break;
            case "team2Id":
                setTeam1Options(teams.filter(item => item.value != e.target.value));
                break;
            default:
                break;
        }
    }

    return (
        <Form>
            <Row>
                <Col xs={12}>
                    <InputField
                        fieldName="title"
                        fieldLabel="Title"
                        defaultValue={match.title}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}/>
                </Col>
                <Col xs={12}>
                    <SelectField
                        fieldName="seriesId"
                        fieldLabel="Series"
                        options={series}
                        defaultValue={match.seriesId}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12}>
                    <SelectField
                        fieldName="venueId"
                        fieldLabel="Venue"
                        options={venues}
                        defaultValue={match.venueId}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={6}>
                    <SelectField
                        fieldName="team1Id"
                        fieldLabel="Team 1"
                        options={team1Options}
                        defaultValue={match.team1Id}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={6}>
                    <SelectField
                        fieldName="team2Id"
                        fieldLabel="Team 2"
                        options={team2Options}
                        defaultValue={match.team2Id}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col md={12}>
                    <InputField
                        fieldName="over"
                        fieldLabel="over"
                        defaultValue={match.over}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}/>
                </Col>
                <Col xs={12}>
                    <FormGroup className="float-end">
                        <Button variant="secondary" onClick={reset}>
                            Clear
                        </Button>
                        <Button variant="primary" className="ms-2" onClick={() => {
                            handleSubmit(match);
                            if (!isUpdate) {
                                reset();
                                setShowFormModal(false);
                            }
                        }}>
                            {buttonLabel}
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}

export default MatchForm;