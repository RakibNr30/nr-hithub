import {EVENT} from "../constants/commentary";

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

const getEventText = (commentary) => {
    switch (commentary.event) {
        case EVENT.SIX:
            return <strong>SIX!</strong>
        case EVENT.FOUR:
            return <strong>FOUR!</strong>
        case EVENT.WICKET:
            return <strong>WICKET!</strong>
        case EVENT.NONE:
            if (commentary.runs == 0)
                return <>no run.</>
            else if (commentary.runs == 1)
                return <>1 run.</>
            else
                return <>{commentary.runs} runs.</>
        default:
            return <>{commentary.runs} runs.</>
    }
}

export {getEventBg, getEventText}