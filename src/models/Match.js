import {uid} from "uid";
import moment from "moment/moment";

class Match {
    constructor(data = {}) {
        this.id = data.id || uid();
        this.title = data.title || "";
        this.over = data.over || 20.0;
        this.seriesId = data.seriesId || null;
        this.venueId = data.venueId || null;
        this.batTeamId = data.batTeamId || null;
        this.runningInnings = data.runningInnings || null;
        this.team1Id = data.team1Id || null;
        this.team2Id = data.team2Id || null;
        this.team1Players = data.team1Players || [];
        this.team2Players = data.team2Players || [];
        this.scorecardId = data.scorecardId || null;
        this.commentaryId = data.commentaryId || null;
        this.tossResult = {
            winnerId: data?.tossResult?.winnerId || null,
            winnerName: data?.tossResult?.winnerName || "",
            winningTeamCode: data?.tossResult?.winningTeamCode || "",
            decision: data?.tossResult?.decision || "",
            batFirstTeamId: data?.tossResult?.batFirstTeamId || null,
            time: data?.tossResult?.time || null,
        };
        this.matchResult = {
            winningTeamId: data?.matchResult?.winningTeamId || null,
            winningTeamName: data?.matchResult?.winningTeamName || "",
            winningTeamCode: data?.matchResult?.winningTeamCode || "",
            isMatchTie: data?.matchResult?.isMatchTie || false,
            winningMargin: data?.matchResult?.winningMargin || 0,
            isWinByRuns: data?.matchResult?.isWinByRuns || false,
            ballsRemaining: data?.matchResult?.ballsRemaining || 0,
            time: data?.matchResult?.time || null,
        };
        this.manOfTheMatch = {

        }
        this.stage = data.stage || 0;
        this.time = data.time || moment().format();
    }
}

export default Match;