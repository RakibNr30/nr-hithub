import Form from "react-bootstrap/Form";
import {useEffect, useRef} from "react";

const InputField = ({fieldName, fieldLabel = "", fieldType = "text", defaultValue, min, max, handler, resetCounter}) => {
    const input = useRef(null);

    useEffect(() => {
        if (input && input.current) {
            input.current.value = defaultValue ? defaultValue : "";
        }
    }, [resetCounter]);

    return (
        <Form.Floating className="mb-3">
            <Form.Control
                ref={input}
                id={fieldName}
                name={fieldName}
                type={fieldType}
                min={min}
                max={max}
                placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                onChange={handler}
            />
            <Form.Label>{fieldLabel}</Form.Label>
        </Form.Floating>
    )
}

export default InputField;