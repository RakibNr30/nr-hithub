import {uid} from "uid";

class ScorecardInnings {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.battingDetails = {
            teamId: data.battingDetails?.teamId || null,
            teamName: data.battingDetails?.teamName || "",
            teamCode: data.battingDetails?.teamCode || "",
            teamBatsmen: data.battingDetails?.teamBatsmen || [],
        }
        this.bowlingDetails = {
            teamId: data.bowlingDetails?.teamId || null,
            teamName: data.bowlingDetails?.teamName || "",
            teamCode: data.bowlingDetails?.teamCode || "",
            teamBowlers: data.bowlingDetails?.teamBowlers || [],
        }
        this.partnerships = data.partnerships || [];
        this.wickets = data.wickets || [];
        this.scoreDetails = {
            overs: data.scoreDetails?.overs || 0.0,
            runs: data.scoreDetails?.runs || 0,
            wickets: data.scoreDetails?.wickets || 0,
        }
        this.extras = {
            total: data.extras?.total || 0,
            wideBalls: data.extras?.wideBalls || 0,
            noBalls: data.extras?.noBalls || 0,
            byes: data.extras?.byes || 0,
            legByes: data.extras?.legByes || 0,
            penalty: data.extras?.penalty || 0
        }
    }
}

export default ScorecardInnings;