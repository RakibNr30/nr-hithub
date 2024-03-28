import {uid} from "uid";

class Bowler {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.order = data.order || null;
        this.name = data.name || "";
        this.nickname = data.nickname || "";
        this.bowl = data.bowl || "";
        this.overs = data.overs || 0.0;
        this.runs = data.runs || 0;
        this.wickets = data.wickets || 0;
        this.maidens = data.maidens || 0;
        this.totalBalls = data.totalBalls || 0;
        this.balls = data.balls || 0;
        this.dots = data.dots || 0;
        this.fours = data.fours || 0;
        this.sixes = data.sixes || 0;
        this.noBalls = data.noBalls || 0;
        this.wideBalls = data.wideBalls || 0;
    }
}

export default Bowler;