import AppLayout from "../../layouts/AppLayout";
import {useEffect, useState} from "react";
import {matches as matchList} from "../../ds/matches";
import SeriesService from "../../services/SeriesService";
import VenueService from "../../services/VenueService";
import TeamService from "../../services/TeamService";
import {STAGE} from "../../constants/match";
import moment from "moment";
import {FORMAT} from "../../constants/dates";
import CommentaryService from "../../services/CommentaryService";
import DefaultModal from "../../components/common/DefaultModal";
import MatchForm from "./MatchForm";

const MatchIndex = () => {

    const seriesService = SeriesService();
    const venueService = VenueService();
    const teamService = TeamService();
    const commentaryService = CommentaryService();

    const [matches, setMatches] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        setMatches(matchList);
    }, []);

    const handleAdd = (match) => {
        console.log(match)
    }

    return (
        <AppLayout>
            <>
                <div className="main-container main-container-3">
                    <div className="container container-3">
                        <section className="live-matches pt-0">
                            <div className="card card-shadow">
                                <ul className="nav mb-0">
                                    <li className="active">
                                        <a href="#" className="active">Matches</a>
                                    </li>
                                    <li>
                                        <a href="#" className="add-match-btn"
                                           onClick={() => setShowAddModal(true)}
                                        >
                                            Add New Match
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {matches.map((match, index) => {

                                const venue = venueService.findById(match.venueId);
                                const series = seriesService.findById(match.seriesId);
                                const team1 = teamService.findById(match.team1Id);
                                const team2 = teamService.findById(match.team2Id);
                                const commentary = commentaryService.findById(match.commentaryId);

                                return (
                                    <div className="card card-shadow p-0" key={index}>
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
                                                        {match.stage === STAGE.IN_PROGRESS &&
                                                            <>
                                                                {match.runningInnings === commentary.miniScore.innings &&
                                                                    match.team1Id === commentary.miniScore.batTeamId &&
                                                                    <div className="score-update ml-10">
                                                                        <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                                                        <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                                                    </div>
                                                                }
                                                            </>
                                                        }
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
                                                        {match.stage === STAGE.IN_PROGRESS &&
                                                            <>
                                                                {match.runningInnings === commentary.miniScore.innings &&
                                                                    match.team2Id === commentary.miniScore.batTeamId &&
                                                                    <div className="score-update">
                                                                        <h5>{`${commentary.miniScore.matchScoreDetails.firstInnings.score}/${commentary.miniScore.matchScoreDetails.firstInnings.wickets}`}</h5>
                                                                        <p className="text-muted">{commentary.miniScore.matchScoreDetails.firstInnings.overs} ov.</p>
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                </div>

                                                {match.stage === STAGE.UPCOMING &&
                                                    <div className="floating-text text-center text-14">
                                                        Match starts at <strong>{moment(match.time).format(FORMAT.CUSTOM)}</strong>
                                                    </div>
                                                }
                                                {match.stage === STAGE.TOSS &&
                                                    <div className="floating-text text-center text-14">
                                                        <span className="text-uppercase"><strong>{match.tossResult.winningTeamCode}</strong></span> won the toss and elected to <strong>{match.tossResult.decision}</strong> first.
                                                    </div>
                                                }
                                                {match.stage === STAGE.IN_PROGRESS &&
                                                    <div className="floating-text text-center text-14">
                                                        <span>Match <strong>In Progress</strong></span>
                                                    </div>
                                                }
                                                {match.stage === STAGE.END &&
                                                    <div className="floating-text text-center text-14">
                                                        <span className="text-uppercase"><strong>{match.matchResult.winningTeamCode}</strong></span> won by <strong>{match.matchResult.winningMargin}</strong> {match.matchResult.winBy}{match.matchResult.winningMargin > 1 ? "s" : ""}.
                                                    </div>
                                                }

                                                {/*<div className="floating-text text-center text-14">Day 2 - Session 3: Sri Lanka
                                                    lead by 5
                                                    runs.
                                                    CRR: 3.84
                                                </div>*/}
                                            </div>
                                            <div className="card-aside text-right px-20 py-20">
                                                <a href={`/match/${match.id}/live-score`} className="btn btn-primary btn-filled text-uppercase active">Live Score</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }

                        </section>
                    </div>
                </div>

                <DefaultModal
                    title="New Match"
                    show={showAddModal}
                    handleClose={() => {
                        setShowAddModal(false)
                    }}>

                    <MatchForm
                        buttonLabel="Save"
                        setShowFormModal={setShowAddModal}
                        handleSubmit={handleAdd}
                    />
                </DefaultModal>

            </>
        </AppLayout>
    )
}

export default MatchIndex;