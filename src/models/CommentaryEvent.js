import {uid} from "uid";
import moment from "moment";

class CommentaryEvent {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.inningsNumber = data.inningsNumber || 0;
        this.batsmanId = data.batsmanId || null;
        this.batsmanName = data.batsmanName || "";
        this.batsmanNickname = data.batsmanNickname || "";
        this.bowlerId = data.bowlerId || null;
        this.bowlerName = data.bowlerName || "";
        this.bowlerNickname = data.bowlerNickname || "";
        this.text = data.text || "";
        this.milestone = data.milestone || null;
        this.totalBalls = data.totalBalls || 0;
        this.balls = data.balls || 0;
        this.overs = data.overs || 0.0;
        this.runs = data.runs || 0;
        this.extraRuns = data.extraRuns || 0;
        this.extraType = data.extraType || "";
        this.event = data.event || "";
        this.overSeparator = data.overSeparator || {};
        this.timestamp = data.timestamp || moment().format();
    }
}

export default CommentaryEvent;