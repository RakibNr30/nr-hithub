import AppLayout from "../../layouts/AppLayout";
import {Link, useParams} from "react-router-dom";
import SeriesService from "../../services/SeriesService";
import VenueService from "../../services/VenueService";
import TeamService from "../../services/TeamService";
import {STAGE} from "../../constants/match";
import useCommentaryStore from "../../stores/commentaryStore";
import useMatchStore from "../../stores/matchStore";
import ScorerService from "../../services/ScorerService";
import useScorecardStore from "../../stores/scorecardStore";

const ScorecardPartnership = () => {

    const scorerService = ScorerService();
    const seriesService = SeriesService();
    const venueService = VenueService();
    const teamService = TeamService();

    const {id} = useParams();
    const match = useMatchStore.getState().matches.find(match => match.id == id);

    if (!match) {
        return <h1>NOT FOUND</h1>
    }

    if (match.stage == STAGE.UPCOMING || match.stage == STAGE.TOSS) {
        return <h1>NOT FOUND</h1>
    }

    const venue = venueService.findById(match.venueId);
    const series = seriesService.findById(match.seriesId);
    const team1 = teamService.findById(match.team1Id);
    const team2 = teamService.findById(match.team2Id);

    const commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);
    const scorecard = useScorecardStore.getState().scorecards.find(scorecard => scorecard.id == match.scorecardId);

    const firstInnings = scorecard.firstInnings;
    const secondInnings = scorecard.secondInnings;

    return (
        <AppLayout>
            <>
                <div className="main-container main-container-2">
                    <div className="container container-2">
                        <div className="row">
                            <div className="col-lg-4">
                                <aside className="sidebar left-sidebar">
                                    <div className="position-relative">
                                        <div className="disabled-area"></div>
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <div className="scorer-wicket-and-extras">
                                                    <ul>
                                                        <li className={`wicket`}>
                                                            <span>Wicket</span>
                                                        </li>
                                                        <li className={`extra`}>
                                                            <span>Wide</span>
                                                        </li>
                                                        <li className={`extra`}>
                                                            <span>No Ball</span>
                                                        </li>
                                                        <li className={`extra`}>
                                                            <span>Byes</span>
                                                        </li>
                                                        <li className={`extra`}>
                                                            <span>Leg Byes</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget widget-scorer">
                                            <div className="scorer-control-buttons">
                                                <div className="control">
                                                    <div className="card card-shadow mb-0 h-100">
                                                        <ul>
                                                            <li className="disabled">
                                                                <span className="bg-primary">Undo</span>
                                                            </li>
                                                            <li className="disabled">
                                                                <span className="bg-primary">Retire</span>
                                                            </li>
                                                            <li>
                                                                <span className="bg-primary">Swap</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="runs">
                                                    <div className="card card-shadow mb-0 h-100 first-second">
                                                        <ul className="first">
                                                            <li>
                                                                <span>0</span>
                                                            </li>
                                                            <li>
                                                                <span>1</span>
                                                            </li>
                                                            <li>
                                                                <span>2</span>
                                                            </li>
                                                            <li>
                                                                <span>3</span>
                                                            </li>
                                                        </ul>
                                                        <ul className="second">
                                                            <li>
                                                                <span>4</span>
                                                            </li>
                                                            <li>
                                                                <span>5</span>
                                                            </li>
                                                            <li>
                                                                <span>6</span>
                                                            </li>
                                                            <li>
                                                                <span>+</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                            <div className="col-lg-8">
                                <section className="live-matches p-0">
                                    <div className="card card-shadow p-0">
                                        <div className="score-card score-card-lg d-md-flex p-0">
                                            <div className="score-card-inner flex-grow-1 px-20 py-20">
                                                <div className="score-card-header mb-15">
                                                    {match.stage == STAGE.UPCOMING &&
                                                        <strong className="text-primary">Upcoming</strong>}
                                                    {match.stage == STAGE.TOSS &&
                                                        <strong className="text-primary">Toss</strong>}
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
                                                    <div className="score-update text-center">
                                                        {commentary.miniScore.isInningsBreak == true && match.stage != STAGE.END &&
                                                            <p className="text-danger">Innings Break.</p>}
                                                        {commentary.miniScore.innings == 2 && match.stage != STAGE.END &&
                                                            <p>
                                                                <strong
                                                                    className="text-uppercase">{commentary.miniScore.matchScoreDetails.secondInnings.batTeamCode}</strong> need
                                                                more {(commentary.miniScore.target - commentary.miniScore.scores)} runs
                                                                from {(match.over * 6 - commentary.miniScore.balls)} balls.
                                                            </p>
                                                        }
                                                        {commentary.miniScore.isInningsBreak == false && commentary.miniScore.innings == 1 && match.stage != STAGE.END &&
                                                            <p>
                                                                <strong
                                                                    className="text-uppercase">{match.tossResult.winningTeamCode}</strong> opt
                                                                to {match.tossResult.decision}.
                                                            </p>
                                                        }
                                                        {match.stage == STAGE.END &&
                                                            <p>
                                                                {match.matchResult.isMatchTie ?
                                                                    <>Match is tie</>
                                                                    :
                                                                    <><strong
                                                                        className="text-uppercase">{match.matchResult.winningTeamName}</strong> won
                                                                        by {match.matchResult.winningMargin} {match.matchResult.isWinByRuns ? "run" : "wicket"}{match.matchResult.winningMargin > 1 ? "s" : ""}.</>
                                                                }
                                                            </p>
                                                        }
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
                                            </div>
                                            {(commentary.miniScore.innings == 2 || commentary.miniScore.isInningsBreak == true) && match.stage != STAGE.END &&
                                                <div className="card-aside text-left px-20 py-20">
                                                    <p>
                                                        Target <span>{commentary.miniScore.target}</span>
                                                    </p>
                                                    {commentary.miniScore.isInningsBreak == true &&
                                                        <p>
                                                            Required
                                                            RR<span>{scorerService.calculateRR((commentary.miniScore.target), (match.over * 6))}</span>
                                                        </p>
                                                    }
                                                    {commentary.miniScore.isInningsBreak == false &&
                                                        <p>
                                                            Required
                                                            RR<span>{scorerService.calculateRR((commentary.miniScore.target - commentary.miniScore.scores), (match.over * 6 - commentary.miniScore.balls))}</span>
                                                        </p>
                                                    }
                                                </div>
                                            }
                                            {commentary.miniScore.isInningsBreak == false && match.stage != STAGE.END &&
                                                <div className="card-aside text-left px-20 py-20">
                                                    <p>
                                                        Partnership<span>{`${commentary.miniScore.partnership.runs} (${commentary.miniScore.partnership.balls})`}</span>
                                                    </p>
                                                    <p>
                                                        Current
                                                        RR<span>{scorerService.calculateRR(commentary.miniScore.scores, commentary.miniScore.balls)}</span>
                                                    </p>
                                                    {/*<p>
                                                    Last 5 ov. (RR)<span>{commentary.miniScore.latestPerformance.overs <=0 ? parseFloat(0).toFixed(2) :  parseFloat((commentary.miniScore.latestPerformance.runs / commentary.miniScore.latestPerformance.overs)).toFixed(2)}</span>
                                                </p>*/}
                                                </div>
                                            }
                                            {match.stage == STAGE.END && Object.keys(match.manOfTheMatch).length > 0 &&
                                                <div className="card-aside big text-left px-20 py-20">
                                                    <p>
                                                        Man of the
                                                        Match<span>{match.manOfTheMatch.name}</span><span
                                                        style={{fontWeight: "normal"}}>{match.manOfTheMatch.team}</span>
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="card card-shadow">
                                        <ul className="nav nav-tabs mb-0">
                                            <li><Link to={`/match/${match.id}/live-score`}>Commentary</Link></li>
                                            <li><Link to={`/match/${match.id}/scorecard`}>Scorecard</Link></li>
                                            <li><Link to={`/match/${match.id}/partnership`} className="active">Partnership</Link></li>
                                            <li><a href="#">Team</a></li>
                                        </ul>
                                    </div>

                                    <div className="accordion" id="accordion">
                                        {match.hasSecondInnings == true &&
                                            <>
                                                <div className="accordion-item">
                                                    <h5 className="">{commentary.miniScore.matchScoreDetails.secondInnings.batTeamName} Innings</h5>
                                                    <div id="innings_1" className="collapse show">
                                                        <div className="acr-body">
                                                            <div className="card card-shadow p-0 mb-0">
                                                                <div className="table-responsive">
                                                                    <table
                                                                        className="widget-table table table-striped table-medium no-border">
                                                                        <thead>
                                                                        <tr>
                                                                            <th scope="col">Batsmen</th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col">Total</th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col">Batsmen</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {secondInnings?.partnerships.length > 0 &&
                                                                            <>
                                                                                {secondInnings?.partnerships?.filter(item => Object.keys(item).length > 0 && item.id).map((item, index) => {
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td>
                                                                                                <a href="#"><strong>{item.bat1Name}</strong></a>
                                                                                            </td>
                                                                                            <td>
                                                                                                {`${item.bat1Runs} (${item.bat1Balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                                {`${item.runs} (${item.balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                                {`${item.bat2Runs} (${item.bat2Balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                                <a href="#"><strong>{item.bat2Name}</strong></a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </>
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {match.hasFirstInnings == true &&
                                            <>
                                                <div className="accordion-item">
                                                    <h5 className="" data-toggle="collapse"
                                                        aria-expanded="true">{commentary.miniScore.matchScoreDetails.firstInnings.batTeamName} Innings</h5>
                                                    <div id="innings_2" className="collapse show"
                                                         data-parent="#accordion">
                                                        <div className="acr-body">
                                                            <div className="card card-shadow p-0 mb-0">
                                                                <div className="table-responsive">
                                                                    <table
                                                                        className="widget-table table table-striped table-medium no-border">
                                                                        <thead>
                                                                        <tr>
                                                                            <th scope="col">Batsmen</th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col">Total</th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col">Batsmen</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {firstInnings?.partnerships.length > 0 &&
                                                                            <>
                                                                                {firstInnings?.partnerships?.filter(item => Object.keys(item).length > 0 && item.id).map((item, index) => {
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td>
                                                                                                <a href="#"><strong>{item.bat1Name}</strong></a>
                                                                                            </td>
                                                                                            <td>
                                                                                                {`${item.bat1Runs} (${item.bat1Balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                                {`${item.runs} (${item.balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                            {`${item.bat2Runs} (${item.bat2Balls})`}
                                                                                            </td>
                                                                                            <td>
                                                                                                <a href="#"><strong>{item.bat2Name}</strong></a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </>
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AppLayout>
    )
}

export default ScorecardPartnership;