import {uid} from "uid";
import Batsman from "./Batsman";
import Bowler from "./Bowler";
import Partnership from "./Partnarship";
import Innings from "./Innings";
import Toss from "./Toss";

class Commentary {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.matchId = data.matchId || null;
        this.commentaryList = data.commentaryList || [];
        this.miniScore = {
            innings: data.miniScore?.innings || 0,
            batTeamId: data.miniScore?.batTeamId || null,
            scores: data.miniScore?.scores || 0,
            wickets: data.miniScore?.wickets || 0,
            overs: data.miniScore?.overs || 0.0,
            balls: data.miniScore?.balls || 0,
            totalBalls: data.miniScore?.totalBalls || 0,
            target: data.miniScore?.target || 0,
            lastWicketText: data.miniScore?.lastWicketText || "",
            lastOverBowlerId: data.miniScore?.lastOverBowlerId || null,
            shouldBowlerChange: data.miniScore?.shouldBowlerChange || false,
            shouldInningsChange: data.miniScore?.shouldInningsChange || false,
            batsmanStriker: new Batsman(data.miniScore?.batsmanStriker || {}),
            batsmanNonStriker: new Batsman(data.miniScore?.batsmanNonStriker || {}),
            bowlerStriker: new Bowler(data.miniScore?.bowlerStriker || {}),
            partnership: new Partnership(data.miniScore?.partnership || {}),
            matchScoreDetails: {
                firstInnings: new Innings(data.miniScore?.matchScoreDetails?.firstInnings || {}),
                secondInnings: new Innings(data?.miniScore?.matchScoreDetails?.secondInnings || {}),
                tossResult: new Toss(data?.miniScore?.matchScoreDetails?.tossResult || {}),
            }
        };
    }
}

export default Commentary;