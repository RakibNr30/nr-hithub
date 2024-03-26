import {uid} from "uid";

class Partnership {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.runs = data.runs || 0;
        this.balls = data.balls || 0;
        this.bat1Id = data.bat1Id || null;
        this.bat1Name = data.bat1Name || "";
        this.bat1Nickname = data.bat1Nickname || "";
        this.bat1Runs = data.bat1Runs || 0;
        this.bat1Balls = data.bat1Balls || 0;
        this.bat1fours = data.bat1fours || 1;
        this.bat1sixes = data.bat1sixes || 0;
        this.bat2Id = data.bat2Id || null;
        this.bat2Name = data.bat2Name || "";
        this.bat2Nickname = data.bat2Nickname || "";
        this.bat2Runs = data.bat2Runs || 0;
        this.bat2Balls = data.bat2Balls || 0;
        this.bat2fours = data.bat2fours || 1;
        this.bat2sixes = data.bat2sixes || 0;
    }
}

export default Partnership;