import {uid} from "uid";

class Batsman {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.order = data.order || null;
        this.name = data.name || "";
        this.nickname = data.nickname || "";
        this.bat = data.bat || "";
        this.runs = data.runs || 0;
        this.balls = data.balls || 0;
        this.dots = data.dots || 0;
        this.ones = data.ones || 0;
        this.twos = data.twos || 0;
        this.threes = data.threes || 0;
        this.fours = data.fours || 0;
        this.fives = data.fives || 0;
        this.sixes = data.sixes || 0;
        this.isOut = data.isOut || false;
        this.outDetails = data.outDetails || "";
        this.bowlerId = data.bowlerId || null;
        this.fielderId = data.fielderId || null;
        this.wicketCode = data.wicketCode || "";
    }
}

export default Batsman;