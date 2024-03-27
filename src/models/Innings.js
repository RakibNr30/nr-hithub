import {uid} from "uid";

class Innings {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.batTeamId = data.batTeamId || null;
        this.batTeamName = data.batTeamName || "";
        this.batTeamCode = data.batTeamCode || "";
        this.score = data.score || 0;
        this.wickets = data.wickets || 0;
        this.overs = data.overs || 0.0;
        this.balls = data.balls || 0;
    }
}

export default Innings;