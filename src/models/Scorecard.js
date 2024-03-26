import {uid} from "uid";
import ScorecardInnings from "./ScorecardInnings";

class Scorecard {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.matchId = data.matchId || null;
        this.firstInnings = new ScorecardInnings(data.firstInnings || {});
        this.secondInnings = new ScorecardInnings(data.secondInnings || {});
    }
}

export default Scorecard;