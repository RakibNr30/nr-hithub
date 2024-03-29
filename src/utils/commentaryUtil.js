import {EVENT, EXTRAS} from "../constants/commentary";

const getEventBg = (event) => {
    switch (event) {
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
            if (commentary.extraRuns > 0) {
                if (commentary.extraType == EXTRAS.NO_BALL) {
                    return <><strong>no ball!</strong> and <strong>SIX!</strong>.</>
                }
            } else {
                return <strong>SIX!</strong>
            }
            break;
        case EVENT.FOUR:
            if (commentary.extraRuns > 0) {
                if (commentary.extraType == EXTRAS.NO_BALL) {
                    return <><strong>no ball!</strong> and <strong>FOUR!</strong>.</>
                }
            } else {
                return <strong>FOUR!</strong>
            }
            break;
        case EVENT.WICKET:
            return <strong>WICKET!</strong>
        case EVENT.NONE:
            if (commentary.extraRuns > 0) {
                if (commentary.extraType == EXTRAS.WIDE) {
                    return <><strong>wide!</strong> and {commentary.runs-commentary.extraRuns} run(s).</>
                }
                if (commentary.extraType == EXTRAS.NO_BALL) {
                    return <><strong>no ball!</strong> and {commentary.runs-commentary.extraRuns} run(s).</>
                }
            } else {
                if (commentary.runs == 0)
                    return <>no run.</>
                else if (commentary.runs == 1)
                    return <>1 run.</>
                else
                    return <>{commentary.runs} runs.</>
            }
            break
        default:
            return <>{commentary.runs} runs.</>
    }
}

export {getEventBg, getEventText}