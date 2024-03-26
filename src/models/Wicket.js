import {uid} from "uid";

class Wicket {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.batsmanId = data.batsmanId || "";
        this.batsmanName = data.batsmanName || "";
        this.batsmanNickname = data.batsmanNickname || "";
        this.wicketNumber = data.wicketNumber || 0;
        this.wicketOver = data.wicketOver || 0.0;
        this.wicketRuns = data.wicketRuns || 0;
    }
}

export default Wicket;