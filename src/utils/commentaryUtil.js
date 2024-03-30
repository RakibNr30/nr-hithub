import {EVENT, EXTRAS} from "../constants/commentary";

const getEventBg = (event) => {
    switch (event) {
        case EVENT.WICKET:
            return "bg-danger"
        case EVENT.FOUR:
            return "bg-primary"
        case EVENT.SIX:
            return "bg-success"
        default:
            return ""
    }
}

const getEventText = (commentary, hasExtra) => {
    switch (commentary.event) {
        case EVENT.SIX:
            return commentary.extraType && commentary.extraType == EXTRAS.NO_BALL ? <>
                <strong>no ball!</strong> and <strong>SIX!</strong>.
            </> : <strong>SIX!</strong>;
        case EVENT.FOUR:
            return commentary.extraType && commentary.extraType == EXTRAS.NO_BALL ? <>
                <strong>no ball!</strong> and <strong>FOUR!</strong>.
            </> : <strong>FOUR!</strong>;
        case EVENT.WICKET:
            return <strong>WICKET!</strong>;
        case EVENT.NONE:
            if (commentary.extraType) {
                return commentary.extraType == EXTRAS.WIDE ? <>
                    <strong>wide!</strong> and {commentary.runs - commentary.extraRuns} run(s).
                </> : commentary.extraType == EXTRAS.NO_BALL ? <>
                    <strong>no ball!</strong> and {commentary.runs - commentary.extraRuns} run(s).
                </> : commentary.extraType == EXTRAS.LEG_BYES ? <>
                    <strong>leg byes!</strong>, {commentary.runs} run(s).
                </> : commentary.extraType == EXTRAS.BYES ? <>
                    <strong>byes!</strong>, {commentary.runs} run(s).
                </> : null;
            } else {
                return commentary.runs === 0 ? <>no run.</> :
                    commentary.runs === 1 ? <>1 run.</> :
                        <>{commentary.runs} runs.</>;
            }
        default:
            return <>{commentary.runs} runs.</>;
    }
};

export {getEventBg, getEventText}