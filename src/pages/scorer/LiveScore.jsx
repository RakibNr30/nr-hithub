import AppLayout from "../../layouts/AppLayout";
import {useParams} from "react-router-dom";
import SeriesService from "../../services/SeriesService";
import VenueService from "../../services/VenueService";
import TeamService from "../../services/TeamService";
import {STAGE} from "../../constants/match";
import useCommentaryStore from "../../stores/commentaryStore";
import useMatchStore from "../../stores/matchStore";
import ScorerService from "../../services/ScorerService";
import {getEventBg, getEventText} from "../../utils/commentaryUtil";
import {useState} from "react";
import SelectField from "../../components/form/SelectField";
import Form from "react-bootstrap/Form";
import {Col, FormGroup, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ScorecardService from "../../services/ScorecardService";

const HomeIndex = () => {

    const scorecardService = ScorecardService();
    const scorerService = ScorerService();
    const seriesService = SeriesService();
    const venueService = VenueService();
    const teamService = TeamService();

    const [bowlingStriker, setBowlingStriker] = useState({});

    const [isWicket, setIsWicket] = useState(false);
    const [isWide, setIsWide] = useState(false);
    const [isNoBall, setIsNoBall] = useState(false);
    const [isByes, setIsByes] = useState(false);
    const [isLegByes, setIsLegByes] = useState(false);

    const {id} = useParams();
    const match = useMatchStore.getState().matches.find(match => match.id == id);

    if (!match) {
        return <h1>NOT FOUND</h1>
    }

    const venue = venueService.findById(match.venueId);
    const series = seriesService.findById(match.seriesId);
    const team1 = teamService.findById(match.team1Id);
    const team2 = teamService.findById(match.team2Id);

    const commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

    const commentaryList = commentary.commentaryList.filter(item => item.inningsNumber == commentary.miniScore.innings);

    const bowlingSquads = match.team1Id == commentary.miniScore.batTeamId ? match.team2Players : match.team1Players;

    const quotaExpiredBowlers = scorecardService.getQuotaExpiredBowlers(match);

    let availableBowlingSquads = bowlingSquads
        .filter(item => item.id != commentary.miniScore.lastOverBowlerId)
        .filter(item => !quotaExpiredBowlers.some(bowler => bowler.id == item.id));

    availableBowlingSquads = availableBowlingSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "bowlerStrikerId":
                setBowlingStriker(availableBowlingSquads.find(item => item.id == e.target.value));
                break;
            default:
                break;
        }
    }

    const handleChangeBowler = (match) => {
        if (Object.keys(bowlingStriker).length <= 0) {
            return;
        }

        scorerService.changeBowlingStriker(match, bowlingStriker);
    }

    const onToggle = (event) => {
        switch (event) {
            case "wicket":
                setIsWicket(!isWicket);
                break;
            case "wide":
                setIsWide(!isWide);
                break;
            case "noBall":
                setIsNoBall(!isNoBall);
                break;
            case "byes":
                setIsByes(!isByes);
                break;
            case "legByes":
                setIsLegByes(!isLegByes);
                break;
            default:
                break;
        }
    }

    const onRunHandler = (takenRun) => {
        /*if (commentary.miniScore.balls != 0 && commentary.miniScore.balls % 6 == 0) {
            alert("you should change bowler");
            return;
        }*/

        if (match.over <= commentary.miniScore.overs) {
            alert("you should change innings");
            return;
        }

        scorerService.runAndEvents(match, takenRun);
    }

    const onSwapBatsmanHandler = () => {
        scorerService.swapBatsman(match);
    }

    return (
        <AppLayout>
            <>
                <div className="main-container main-container-2">
                    <div className="container container-2">
                        <div className="row">
                            <div className="col-lg-4">
                                <aside className="sidebar left-sidebar">
                                    <div className="position-relative">
                                        {commentary.miniScore.shouldBowlerChange == true &&
                                            <div className="disabled-area"></div>
                                        }
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <div className="scorer-wicket-and-extras">
                                                    <ul>
                                                        <li className={`wicket ${isWicket ? 'active' : ''}`}
                                                            onClick={() => onToggle("wicket")}>
                                                            <span>Wicket</span>
                                                        </li>
                                                        <li className={`extra ${isWide ? 'active' : ''}`}
                                                            onClick={() => onToggle("wide")}>
                                                            <span>Wide</span>
                                                        </li>
                                                        <li className={`extra ${isNoBall ? 'active' : ''}`}
                                                            onClick={() => onToggle("noBall")}>
                                                            <span>No Ball</span>
                                                        </li>
                                                        <li className={`extra ${isByes ? 'active' : ''}`}
                                                            onClick={() => onToggle("byes")}>
                                                            <span>Byes</span>
                                                        </li>
                                                        <li className={`extra ${isLegByes ? 'active' : ''}`}
                                                            onClick={() => onToggle("legByes")}>
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
                                                            <li>
                                                                <span className="bg-primary">Undo</span>
                                                            </li>
                                                            <li>
                                                                <span className="bg-primary">Retire</span>
                                                            </li>
                                                            <li>
                                                            <span className="bg-primary"
                                                                  onClick={onSwapBatsmanHandler}>Swap</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="runs">
                                                    <div className="card card-shadow mb-0 h-100 first-second">
                                                        <ul className="first">
                                                            <li onClick={() => onRunHandler(0)}>
                                                                <span>0</span>
                                                            </li>
                                                            <li onClick={() => onRunHandler(1)}>
                                                                <span>1</span>
                                                            </li>
                                                            <li onClick={() => onRunHandler(2)}>
                                                                <span>2</span>
                                                            </li>
                                                            <li onClick={() => onRunHandler(3)}>
                                                                <span>3</span>
                                                            </li>
                                                        </ul>
                                                        <ul className="second">
                                                            <li onClick={() => onRunHandler(4)}>
                                                                <span>4</span>
                                                            </li>
                                                            <li onClick={() => onRunHandler(5)}>
                                                                <span>5</span>
                                                            </li>
                                                            <li onClick={() => onRunHandler(6)}>
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
                                    {commentary.miniScore.shouldBowlerChange == true &&
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <Form>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <SelectField
                                                                fieldName="bowlerStrikerId"
                                                                fieldLabel="Bowler"
                                                                options={availableBowlingSquads}
                                                                handler={onChangeHandler}
                                                            />
                                                        </Col>
                                                        <Col xs={12}>
                                                            <FormGroup className="float-end">
                                                                <Button className="hithub-btn-2" onClick={() => handleChangeBowler(match)}>
                                                                    Change Bowler
                                                                </Button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </div>
                                    }
                                </aside>
                            </div>
                            <div className="col-lg-8">
                                <section className="live-matches p-0">
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
                                                                    <h5>{`${commentary.miniScore.scores}/${commentary.miniScore.wickets}`}</h5>
                                                                    <p className="text-muted">{commentary.miniScore.overs} ov.</p>
                                                                </div>}
                                                        </>}
                                                    </div>
                                                    <div className="score-update text-center">
                                                        <p>
                                                            <strong
                                                                className="text-uppercase">{match.tossResult.winningTeamCode}</strong> opt
                                                            to {match.tossResult.decision}.
                                                        </p>
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
                                                                    <h5>{`${commentary.miniScore.scores}/${commentary.miniScore.wickets}`}</h5>
                                                                    <p className="text-muted">{commentary.miniScore.overs} ov.</p>
                                                                </div>}
                                                        </>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-aside text-left px-20 py-20">
                                                <p>Current
                                                    RR<span>{commentary.miniScore.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat((commentary.miniScore.scores / (commentary.miniScore.balls / 6))).toFixed(2)}</span>
                                                </p>
                                                <p>
                                                    Partnership<span>{`${commentary.miniScore.partnership.runs} (${commentary.miniScore.partnership.balls})`}</span>
                                                </p>
                                                {/*<p>
                                                    Last 5 ov. (RR)<span>{commentary.miniScore.latestPerformance.overs <=0 ? parseFloat(0).toFixed(2) :  parseFloat((commentary.miniScore.latestPerformance.runs / commentary.miniScore.latestPerformance.overs)).toFixed(2)}</span>
                                                </p>*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-shadow">
                                        <ul className="nav nav-tabs mb-0">
                                            <li className="active"><a href="#" className="active">Commentary</a></li>
                                            <li><a href="#">Scorecard</a></li>
                                            <li><a href="#">Partnership</a></li>
                                            <li><a href="#">Team</a></li>
                                        </ul>
                                    </div>
                                    <div className="card card-shadow p-0">
                                        <div className="table-responsive">
                                            <table className="widget-table table table-striped table-medium no-border">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Batsmen</th>
                                                    <th scope="col">r</th>
                                                    <th scope="col">b</th>
                                                    <th scope="col">4s</th>
                                                    <th scope="col">6s</th>
                                                    <th scope="col">sr</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>{commentary.miniScore.batsmanStriker.nickname}*</strong></a> ({commentary.miniScore.batsmanStriker.bat})
                                                    </td>
                                                    <td><strong>{commentary.miniScore.batsmanStriker.runs}</strong></td>
                                                    <td>{commentary.miniScore.batsmanStriker.balls}</td>
                                                    <td>{commentary.miniScore.batsmanStriker.fours}</td>
                                                    <td>{commentary.miniScore.batsmanStriker.sixes}</td>
                                                    <td>{commentary.miniScore.batsmanStriker.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat((commentary.miniScore.batsmanStriker.runs * 100) / commentary.miniScore.batsmanStriker.balls).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>{commentary.miniScore.batsmanNonStriker.nickname}</strong></a> ({commentary.miniScore.batsmanNonStriker.bat})
                                                    </td>
                                                    <td><strong>{commentary.miniScore.batsmanNonStriker.runs}</strong>
                                                    </td>
                                                    <td>{commentary.miniScore.batsmanNonStriker.balls}</td>
                                                    <td>{commentary.miniScore.batsmanNonStriker.fours}</td>
                                                    <td>{commentary.miniScore.batsmanNonStriker.sixes}</td>
                                                    <td>{commentary.miniScore.batsmanNonStriker.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat((commentary.miniScore.batsmanNonStriker.runs * 100) / commentary.miniScore.batsmanNonStriker.balls).toFixed(2)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card card-shadow p-0">
                                        <div className="table-responsive">
                                            <table className="widget-table table table-striped table-medium no-border">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Bowlers</th>
                                                    <th scope="col">o</th>
                                                    <th scope="col">m</th>
                                                    <th scope="col">r</th>
                                                    <th scope="col">w</th>
                                                    <th scope="col">NB</th>
                                                    <th scope="col">WD</th>
                                                    <th scope="col">econ</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>{commentary.miniScore.bowlerStriker.nickname}*</strong></a> ({commentary.miniScore.bowlerStriker.bowl})
                                                    </td>
                                                    <td><strong>{commentary.miniScore.bowlerStriker.overs}</strong></td>
                                                    <td>{commentary.miniScore.bowlerStriker.maidens}</td>
                                                    <td>{commentary.miniScore.bowlerStriker.runs}</td>
                                                    <td>{commentary.miniScore.bowlerStriker.wickets}</td>
                                                    <td>{commentary.miniScore.bowlerStriker.noBalls}</td>
                                                    <td>{commentary.miniScore.bowlerStriker.wideBalls}</td>
                                                    <td>{commentary.miniScore.bowlerStriker.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat(commentary.miniScore.bowlerStriker.runs / (commentary.miniScore.bowlerStriker.balls / 6)).toFixed(2)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {commentaryList.length > 0 &&
                                        <div className="card card-shadow">
                                            <div className="spell-sum-box">
                                                {commentary.miniScore.lastWicketText.length > 0 &&
                                                    <h5>Last Bat: <span>Mushfiqur c Rahul b Siraj - 20r 10b 2x4 1x6) SR: 200.00</span>
                                                    </h5>
                                                }
                                                <div className="recent-spell">
                                                    <label>recent:</label>
                                                    <ul>
                                                        {commentaryList.slice(0, 6).map((item, index) => {
                                                            return (
                                                                <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.runs}</span>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                    <ul>
                                                        {commentaryList.slice(6, 12).map((item, index) => {
                                                            return (
                                                                <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.runs}</span>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                    <ul>
                                                        {commentaryList.slice(12, 15).map((item, index) => {
                                                            return (
                                                                <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.runs}</span>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </section>

                                {commentaryList.length > 0 &&
                                    <section className="pt-0">
                                        <div className="widget widget-rankings">
                                            <div className="card card-shadow">
                                                <div className="commentary-box">
                                                    <div className="commentary-body">
                                                        <ul className="commentary-list">
                                                            {commentaryList.map((item, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        {Object.keys(item.overSeparator).length > 0 &&
                                                                            <li className="separator">
                                                                                <h6>Runs<br/>{item.overSeparator.runs}
                                                                                </h6>
                                                                                <h6>After {item.overSeparator.overs} overs<br/>{item.overSeparator.score}/{item.overSeparator.wickets}
                                                                                </h6>
                                                                                <h6>
                                                                                    {item.overSeparator.batStrikerNickname} - {item.overSeparator.batStrikerRuns} ({item.overSeparator.batStrikerBalls})<br/>
                                                                                    {item.overSeparator.batNonStrikerNickname} - {item.overSeparator.batNonStrikerRuns} ({item.overSeparator.batNonStrikerBalls})
                                                                                </h6>
                                                                                <h6>
                                                                                    {item.overSeparator.bowlerNickname}<br/>
                                                                                    {item.overSeparator.bowlerOvers}-{item.overSeparator.bowlerMaidens}-{item.overSeparator.bowlerRuns}-{item.overSeparator.bowlerWickets}
                                                                                </h6>
                                                                            </li>
                                                                        }
                                                                        <li>
                                                                            <div>
                                                                                <h5>{parseInt(item.overs) == item.overs ? (item.overs - 0.4) : item.overs}</h5>
                                                                                <span
                                                                                    className={`${getEventBg(item.event)}`}>{item.runs}</span>
                                                                            </div>
                                                                            <p>{item.bowlerNickname} to {item.batsmanNickname}, {getEventText(item)}</p>
                                                                        </li>
                                                                    </div>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AppLayout>
    )
}

export default HomeIndex;