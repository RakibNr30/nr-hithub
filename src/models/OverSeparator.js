import {uid} from "uid";

class OverSeparator {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.score = data.score || 0;
        this.wickets = data.wickets || 0;
        this.overSummary = data.overSummary || "";
        this.runs = data.runs || 0;
        this.batStrikerId = data.batStrikerId || null;
        this.batStrikerName = data.batStrikerName || "";
        this.batStrikerRuns = data.batStrikerRuns || 0;
        this.batStrikerBalls = data.batStrikerBalls || 0;
        this.batNonStrikerIds = data.batNonStrikerIds || [];
        this.batNonStrikerName = data.batNonStrikerName || "";
        this.batNonStrikerRuns = data.batNonStrikerRuns || 0;
        this.batNonStrikerBalls = data.batNonStrikerBalls || 0;
        this.bowlId = data.bowlId || null;
        this.bowlName = data.bowlName || "";
        this.bowlOvers = data.bowlOvers || 0.0;
        this.bowlMaidens = data.bowlMaidens || 0;
        this.bowlRuns = data.bowlRuns || 0;
        this.bowlWickets = data.bowlWickets || 0;
        this.overNumber = data.overNumber || 0.0;
    }
}

export default OverSeparator;