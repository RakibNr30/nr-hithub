import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FormGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import InputField from "../../components/form/InputField";
import SelectField from "../../components/form/SelectField";
import {series} from "../../ds/series";
import {venus} from "../../ds/venus";
import {teams} from "../../ds/teams";

const MatchStartForm = ({defaultMatch = {}, buttonLabel, setShowFormModal, handleSubmit}) => {

    const [match, setMatch] = useState({});
    const [resetCounter, setResetCounter] = useState(0);
    const [seriesOptions, setSeriesOptions] = useState([]);
    const [venueOptions, setVenueOptions] = useState([]);
    const [team1Options, setTeam1Options] = useState([]);
    const [team2Options, setTeam2Options] = useState([]);

    useEffect(() => {
        reset();

        setSeriesOptions(series.map((item) => {return {label: item.title, value: item.id}}));
        setVenueOptions(venus.map((item) => {return {label: `${item.ground}, ${item.city}, ${item.country}`, value: item.id}}));
        setTeam1Options(teams.map((item) => {return {label: item.name, value: item.id}}));
        setTeam2Options(teams.map((item) => {return {label: item.name, value: item.id}}));
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const onChangeHandler = (e) => {
        setMatch({ ...match, [e.target.name]: e.target.value });

        switch (e.target.name) {
            case "team1Id":
                setTeam2Options(team2Options.filter(item => item.value != e.target.value));
                break;
            case "team2Id":
                setTeam1Options(team1Options.filter(item => item.value != e.target.value));
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
                        options={seriesOptions}
                        defaultValue={match.seriesId}
                        handler={onChangeHandler}
                        resetCounter={resetCounter}
                    />
                </Col>
                <Col xs={12}>
                    <SelectField
                        fieldName="venueId"
                        fieldLabel="Venue"
                        options={venueOptions}
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

export default MatchStartForm;