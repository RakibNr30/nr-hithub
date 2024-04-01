import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import ScorerService from "../../services/ScorerService";

const SpeechCommentary = ({match}) => {

    const commands = [
        {
            command: "submit all",
            callback: () => submitCommentary()
        },
        {
            command: "clear all",
            callback: ({resetTranscript}) => resetTranscript()
        },
        {
            command: "stop listening",
            callback: () => SpeechRecognition.stopListening()
        }
    ];

    const scorerService = ScorerService();
    const textInput = useRef(null);
    const [text, setText] = useState("");

    let {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});

    if (!browserSupportsSpeechRecognition) {
        return null;
    }


    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening()
        } else {
            SpeechRecognition.startListening({continuous: true})
        }
    }

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "text":
                setText(e.target.value)
                break;
            default:
                break;
        }
    }

    const onResetHandler = (e) => {
        switch (e.target.name) {
            case "text":
                textInput.current.value = ""
                break;
            default:
                break;
        }
    }

    const submitCommentary = () => {
        const text = commands.reduce((text, item) => {
            return text.replaceAll(item.command, "");
        }, transcript);

        scorerService.addTextToLastCommentary(match, text);
        resetTranscript();
    }

    return (
        <div className="widget widget-scorer">
            <div className="card card-shadow">
                {/*<Form.Control
                    className="mb-3"
                    as="textarea" style={{height: "100px"}}
                    ref={textInput}
                    defaultValue={transcript}
                    id={"text"}
                    name={"text"}
                    onChange={onChangeHandler}
                />*/}
                {transcript.length > 0 &&
                    <p>{transcript}</p>
                }
                <div className="scorer-wicket-and-extras">
                    <ul>
                        <li className={`speaker ${listening ? "listening" : ""}`} onClick={toggleListening}>
                            <span>{listening ? "Stop Listening" : "Start Listening"}</span>
                        </li>
                        <li className={`${transcript.length > 0 ? "primary" : "disabled"}`} onClick={submitCommentary}>
                            <span>Submit</span>
                        </li>
                    </ul>
                </div>
                <div className="commands">
                    <span>say "submit all" to submit</span>
                    <span>say "clear all" to clear</span>
                    <span>say "stop listening" to stop listening</span>
                </div>
            </div>
        </div>
    )
}

export default SpeechCommentary;