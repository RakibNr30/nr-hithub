import {STAGE} from "../../constants/match";
import moment from "moment/moment";
import {FORMAT} from "../../constants/dates";
import SeriesService from "../../services/SeriesService";
import VenueService from "../../services/VenueService";
import TeamService from "../../services/TeamService";
import CommentaryService from "../../services/CommentaryService";
import {useState} from "react";
import DefaultModal from "../../components/common/DefaultModal";
import MatchStartForm from "./MatchStartForm";
import MatchTossForm from "./MatchTossForm";
import MatchService from "../../services/MatchService";

const MatchCard = ({match}) => {

    const seriesService = SeriesService();
    const matchService = MatchService();
    const venueService = VenueService();
    const teamService = TeamService();
    const commentaryService = CommentaryService();

    const [showMatchTossModal, setShowMatchTossModal] = useState(false);
    const [showMatchStartModal, setShowMatchStartModal] = useState(false);

    const venue = venueService.findById(match.venueId);
    const series = seriesService.findById(match.seriesId);
    const team1 = teamService.findById(match.team1Id);
    const team2 = teamService.findById(match.team2Id);
    const commentary = commentaryService.findById(match.commentaryId);

    const handleMatchToss = (match) => {
        matchService.update({...match, stage: STAGE.TOSS, tossResult: {...match.tossResult, time: moment().format()}})
    }

    const handleMatchStart = (match) => {
        /* commentary, scorecard etc.... should be init */
        //matchService.update({...match, stage: STAGE.IN_PROGRESS})
    }

    return (<>
        <div className="card card-shadow p-0">
            <div className="score-card score-card-lg d-md-flex p-0">
                <div className="score-card-inner flex-grow-1 px-20 py-20">
                    <div className="score-card-header mb-15">
                        <strong className="text-red">live</strong>
                        <span>{match.title}, {venue.ground}, {series.title}</span>
                    </div>
                    <div className="score-card-body">
                        <div className="country-info">
                            <div className="flag-avatar">
                                <figure>
                                    <img src={`/images/flags/${team1.code}.png`} alt=""/>
                                </figure>
                                <span className="country-name">{team1.code}</span>
                            </div>
                            {match.stage == STAGE.IN_PROGRESS && <>
                                {match.runningInnings == commentary.miniScore.innings && match.team1Id == commentary.miniScore.batTeamId &&
                                    <div className="score-update ml-10">
                                        <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                        <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                    </div>}
                            </>}
                        </div>
                        <div className="score-update m-0 text-center">
                            <p className="vs-circle">VS</p>
                        </div>
                        <div className="country-info flex-row-reverse">
                            <div className="flag-avatar ml-10">
                                <figure>
                                    <img src={`/images/flags/${team2.code}.png`} alt=""/>
                                </figure>
                                <span className="country-name">{team2.code}</span>
                            </div>
                            {match.stage == STAGE.IN_PROGRESS && <>
                                {match.runningInnings == commentary.miniScore.innings && match.team2Id == commentary.miniScore.batTeamId &&
                                    <div className="score-update">
                                        <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                        <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                    </div>}
                            </>}
                        </div>
                    </div>

                    {match.stage == STAGE.UPCOMING && <div className="floating-text text-center text-14">
                        Match starts
                        at <strong>{moment(match.time).format(FORMAT.CUSTOM)}</strong>
                    </div>}
                    {match.stage == STAGE.TOSS && <div className="floating-text text-center text-14">
                                                        <span
                                                            className="text-uppercase"><strong>{match.tossResult.winningTeamCode}</strong></span> won
                        the toss and elected
                        to <strong>{match.tossResult.decision}</strong> first.
                    </div>}
                    {match.stage == STAGE.IN_PROGRESS && <div className="floating-text text-center text-14">
                        <span>Match <strong>In Progress</strong></span>
                    </div>}
                    {match.stage == STAGE.END && <div className="floating-text text-center text-14">
                                                        <span
                                                            className="text-uppercase"><strong>{match.matchResult.winningTeamCode}</strong></span> won
                        by <strong>{match.matchResult.winningMargin}</strong> {match.matchResult.winBy}{match.matchResult.winningMargin > 1 ? "s" : ""}.
                    </div>}

                    {/*<div className="floating-text text-center text-14">Day 2 - Session 3: Sri Lanka
                                                    lead by 5
                                                    runs.
                                                    CRR: 3.84
                                                </div>*/}
                </div>
                <div className="card-aside text-right px-20 py-20">
                    {match.stage == STAGE.UPCOMING && <a href="#" className="hithub-btn btn-filled text-uppercase"
                                                         onClick={() => setShowMatchTossModal(true)}>Toss</a>}
                    {match.stage == STAGE.TOSS && <a href="#" className="hithub-btn btn-filled text-uppercase"
                                                     onClick={() => setShowMatchStartModal(true)}>Start Match</a>}
                    <a href={`/match/${match.id}/live-score`}
                       className="hithub-btn btn-filled text-uppercase active">Live Match</a>
                </div>
            </div>
        </div>

        {match.stage == STAGE.UPCOMING && <DefaultModal
            title="Toss"
            show={showMatchTossModal}
            handleClose={() => {
                setShowMatchTossModal(false)
            }}>

            <MatchTossForm
                defaultMatch={match}
                buttonLabel="Toss"
                setShowFormModal={setShowMatchTossModal}
                handleSubmit={handleMatchToss}
            />
        </DefaultModal>}


        {match.stage == STAGE.TOSS && <DefaultModal
            title="Start Match"
            show={showMatchStartModal}
            handleClose={() => {
                setShowMatchStartModal(false)
            }}>

            <MatchStartForm
                defaultMatch={match}
                buttonLabel="Start"
                setShowFormModal={setShowMatchStartModal}
                handleSubmit={handleMatchStart}
            />

        </DefaultModal>}

    </>)
}

export default MatchCard;