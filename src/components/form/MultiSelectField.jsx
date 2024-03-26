import Form from "react-bootstrap/Form";
import {Multiselect} from "multiselect-react-dropdown";

const SelectField = ({fieldName, fieldLabel = "", options = [], multiSelectHandler}) => {

    return (
        <Form.Group>
            <Form.Label>{fieldLabel}</Form.Label>
            <Multiselect
                displayValue="label"
                onSelect={multiSelectHandler}
                options={options}
                selectionLimit={11}
            />
        </Form.Group>
    )
}

export default SelectField;