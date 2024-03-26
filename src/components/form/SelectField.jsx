import Form from "react-bootstrap/Form";
import {useEffect, useRef} from "react";

const SelectField = ({fieldName, fieldLabel = "", options = [], defaultValue, handler, resetCounter}) => {
    const select = useRef(null);

    useEffect(() => {
        if (select && select.current) {
            select.current.value = defaultValue;
        }
    }, [resetCounter]);

    return (
        <Form.Floating className="mb-3">
            <Form.Select
                ref={select}
                id={fieldName}
                name={fieldName}
                onChange={handler}
            >
                {options.map((item, index) => {
                    return <option value={item.value} key={index}>{item.label}</option>
                })}
            </Form.Select>
            <Form.Label>{fieldLabel}</Form.Label>
        </Form.Floating>
    )
}

export default SelectField;