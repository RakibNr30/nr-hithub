import {uid} from "uid";

class OverSeparator {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.score = data.score || 0;
        this.overs = data.overs || 0.0;
        this.wickets = data.wickets || 0;
        this.overSummary = data.overSummary || "";
        this.runs = data.runs || 0;
        this.batStrikerId = data.batStrikerId || null;
        this.batStrikerName = data.batStrikerName || "";
        this.batStrikerNickname = data.batStrikerNickname || "";
        this.batStrikerRuns = data.batStrikerRuns || 0;
        this.batStrikerBalls = data.batStrikerBalls || 0;
        this.batNonStrikerId = data.batNonStrikerId || null;
        this.batNonStrikerName = data.batNonStrikerName || "";
        this.batNonStrikerNickname = data.batNonStrikerNickname || "";
        this.batNonStrikerRuns = data.batNonStrikerRuns || 0;
        this.batNonStrikerBalls = data.batNonStrikerBalls || 0;
        this.bowlerId = data.bowlerId || null;
        this.bowlerName = data.bowlerName || "";
        this.bowlerNickname = data.bowlerNickname || "";
        this.bowlerOvers = data.bowlerOvers || 0.0;
        this.bowlerMaidens = data.bowlerMaidens || 0;
        this.bowlerRuns = data.bowlerRuns || 0;
        this.bowlerWickets = data.bowlerWickets || 0;
    }
}

export default OverSeparator;