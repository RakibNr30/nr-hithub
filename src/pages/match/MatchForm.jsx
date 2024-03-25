import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {FormGroup} from "react-bootstrap";
import {useEffect, useState} from "react";
import InputField from "../../components/form/InputField";
import SelectField from "../../components/form/SelectField";
import DateField from "../../components/form/DateField";
import {series} from "../../ds/series";
import {venus} from "../../ds/venus";
import {teams} from "../../ds/teams";

const MatchForm = ({defaultMatch = {}, buttonLabel, setShowFormModal, handleSubmit, isUpdate = false}) => {

    const [match, setMatch] = useState({});
    const [resetCounter, setResetCounter] = useState(0);

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        setMatch(defaultMatch);
        setResetCounter(resetCounter + 1);
    }

    const seriesOptions = series.map((item) => {
        return {
            label: item.title,
            value: item.id,
        }
    });
    const venueOptions = venus.map((item) => {
        return {
            label: `${item.ground}, ${item.city}, ${item.country}`,
            value: item.id,
        }
    });
    const team1Options = teams.map((item) => {
        return {
            label: item.name,
            value: item.id,
        }
    });
    const team2Options = teams.map((item) => {
        return {
            label: item.name,
            value: item.id,
        }
    });

    const onChangeHandler = (e) => {
        setMatch({ ...match, [e.target.name]: e.target.value });
    }

    return (
        <Form>
            <InputField
                fieldName="title"
                fieldLabel="Title"
                defaultValue={match.title}
                handler={onChangeHandler}
                resetCounter={resetCounter}/>
            <SelectField
                fieldName="seriesId"
                fieldLabel="Series"
                options={seriesOptions}
                defaultValue={match.seriesId}
                handler={onChangeHandler}
                resetCounter={resetCounter}
            />
            <SelectField
                fieldName="venueId"
                fieldLabel="Venue"
                options={venueOptions}
                defaultValue={match.venueId}
                handler={onChangeHandler}
                resetCounter={resetCounter}
            />

            <SelectField
                fieldName="team1Id"
                fieldLabel="Team 1"
                options={team1Options}
                defaultValue={match.team1Id}
                handler={onChangeHandler}
                resetCounter={resetCounter}
            />

            <SelectField
                fieldName="team2Id"
                fieldLabel="Team 2"
                options={team2Options}
                defaultValue={match.team2Id}
                handler={onChangeHandler}
                resetCounter={resetCounter}
            />
            <DateField
                fieldName="time"
                fieldLabel="Time"
                fieldType="datetime-local"
                defaultValue={match.time}
                handler={onChangeHandler}
                resetCounter={resetCounter}/>
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
        </Form>
    )
}

export default MatchForm;