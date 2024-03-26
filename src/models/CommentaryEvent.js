import {uid} from "uid";
import OverSeparator from "./OverSeparator";

class CommentaryEvent {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.text = data.text || "";
        this.overs = data.overs || 0.0;
        this.runs = data.runs || 0;
        this.event = data.event || "";
        this.overSeparator = new OverSeparator(data.overSeparator || {});
        this.timestamp = data.timestamp || null;
    }
}

export default CommentaryEvent;