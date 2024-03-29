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

const MatchCard = ({match}) => {

    const seriesService = SeriesService();
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

    return (
        <>
            <div className="card card-shadow p-0">
                <div className="score-card score-card-lg d-md-flex p-0">
                    <div className="score-card-inner flex-grow-1 px-20 py-20">
                        <div className="score-card-header mb-15">
                            {match.stage == STAGE.UPCOMING && <strong className="text-primary">Upcoming</strong>}
                            {match.stage == STAGE.TOSS && <strong className="text-primary">Toss</strong>}
                            {(match.stage == STAGE.IN_PROGRESS || (match.stage == STAGE.END && Object.keys(match.manOfTheMatch).length <= 0)) &&
                                <strong className="text-red">Live</strong>}
                            {Object.keys(match.manOfTheMatch).length > 0 &&
                                <strong className="text-dark">Ended</strong>}
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
                                {(match.stage == STAGE.IN_PROGRESS || match.stage == STAGE.END) && <>
                                    {match.team1Id == commentary.miniScore.matchScoreDetails.firstInnings.batTeamId &&
                                        <div className="score-update ml-10">
                                            <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                            <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                        </div>
                                    }
                                    {match.team1Id == commentary.miniScore.matchScoreDetails.secondInnings.batTeamId &&
                                        <div className="score-update ml-10">
                                            <h5>{`${commentary.miniScore.matchScoreDetails.secondInnings.score}/${commentary.miniScore.matchScoreDetails.secondInnings.wickets}`}</h5>
                                            <p className="text-muted">{commentary.miniScore.matchScoreDetails.secondInnings.overs} ov.</p>
                                        </div>
                                    }
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
                                {(match.stage == STAGE.IN_PROGRESS || match.stage == STAGE.END) && <>
                                    {match.team2Id == commentary.miniScore.matchScoreDetails.firstInnings.batTeamId &&
                                        <div className="score-update ml-10">
                                            <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                            <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                        </div>
                                    }
                                    {match.team2Id == commentary.miniScore.matchScoreDetails.secondInnings.batTeamId &&
                                        <div className="score-update ml-10">
                                            <h5>{`${commentary.miniScore.matchScoreDetails.secondInnings.score}/${commentary.miniScore.matchScoreDetails.secondInnings.wickets}`}</h5>
                                            <p className="text-muted">{commentary.miniScore.matchScoreDetails.secondInnings.overs} ov.</p>
                                        </div>
                                    }
                                </>}
                            </div>
                        </div>

                        {match.stage == STAGE.UPCOMING &&
                            <>
                                <div className="floating-text text-center text-14">
                                    Match will start soon.
                                </div>
                            </>
                        }
                        {match.stage == STAGE.TOSS &&
                            <>
                                <div className="floating-text text-center text-14">
                                <span
                                    className="text-uppercase"><strong>{match.tossResult.winningTeamCode}</strong></span> won
                                    the toss and elected to <strong>{match.tossResult.decision}</strong> first.
                                </div>
                            </>
                        }
                        {match.stage == STAGE.IN_PROGRESS &&
                            <>
                                {commentary.miniScore.isInningsBreak == true &&
                                    <div className="floating-text text-center text-14 text-red">Innings
                                        Break.</div>}
                                {commentary.miniScore.innings == 2 &&
                                    <div className="floating-text text-center text-14">
                                        <strong
                                            className="text-uppercase">{commentary.miniScore.matchScoreDetails.secondInnings.batTeamCode}</strong> need
                                        more {(commentary.miniScore.target - commentary.miniScore.scores)} runs
                                        from {(match.over * 6 - commentary.miniScore.balls)} balls.
                                    </div>
                                }
                                {commentary.miniScore.isInningsBreak == false && commentary.miniScore.innings == 1 &&
                                    <div className="floating-text text-center text-14">
                                        <strong
                                            className="text-uppercase">{match.tossResult.winningTeamCode}</strong> opt
                                        to {match.tossResult.decision}.
                                    </div>
                                }
                            </>
                        }
                        {match.stage == STAGE.END &&
                            <div className="floating-text text-center text-14">
                                {match.matchResult.isMatchTie ?
                                    <>Match is tie</>
                                    :
                                    <><strong
                                        className="text-uppercase">{match.matchResult.winningTeamName}</strong> won
                                        by {match.matchResult.winningMargin} {match.matchResult.isWinByRuns ? "run" : "wicket"}{match.matchResult.winningMargin > 1 ? "s" : ""}.</>
                                }
                            </div>
                        }
                    </div>
                    <div className="card-aside text-right px-20 py-20">
                        {match.stage == STAGE.UPCOMING &&
                            <>
                                <a href="#" className="hithub-btn btn-filled text-uppercase"
                                   onClick={() => setShowMatchTossModal(true)}>Toss</a>
                            </>
                        }
                        {match.stage == STAGE.TOSS &&
                            <>
                                <a href="#" className="hithub-btn btn-filled text-uppercase"
                                   onClick={() => setShowMatchStartModal(true)}>Start Match</a>
                            </>
                        }
                        <a href={`/match/${match.id}/live-score`}
                           className="hithub-btn btn-filled text-uppercase active">Live
                            Match</a>
                    </div>
                </div>
            </div>

            {match.stage == STAGE.UPCOMING &&
                <DefaultModal
                    title="Toss"
                    show={showMatchTossModal}
                    handleClose={() => {
                        setShowMatchTossModal(false)
                    }}>

                    <MatchTossForm
                        defaultMatch={match}
                        buttonLabel="Toss"
                        setShowFormModal={setShowMatchTossModal}
                    />
                </DefaultModal>
            }

            {match.stage == STAGE.TOSS &&
                <DefaultModal
                    title="Start Match"
                    show={showMatchStartModal}
                    handleClose={() => {
                        setShowMatchStartModal(false)
                    }}>

                    <MatchStartForm
                        defaultMatch={match}
                        buttonLabel="Start"
                        setShowFormModal={setShowMatchStartModal}
                    />

                </DefaultModal>
            }
        </>
    )
}

export default MatchCard;