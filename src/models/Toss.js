import {uid} from "uid";
import moment from "moment/moment";

class Toss {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.winnerId = data.winnerId || null;
        this.winnerName = data.winnerName || "";
        this.winningTeamCode = data.winningTeamCode || "";
        this.decision = data.decision || "";
        this.batFirstTeamId = data.batFirstTeamId || null;
        this.time = data.time || moment().format();
    }
}

export default Toss;