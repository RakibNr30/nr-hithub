import AppLayout from "../../layouts/AppLayout";
import {Link, useParams} from "react-router-dom";
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
import DefaultModal from "../../components/common/DefaultModal";
import MatchSecondInningsStartForm from "../match/MatchSecondInningsStartForm";
import {EVENT, EXTRAS} from "../../constants/commentary";
import ScorerWicketForm from "./ScorerWicketForm";
import wicketTypes from "../../constants/wicketTypes";

const HomeIndex = () => {

    const scorecardService = ScorecardService();
    const scorerService = ScorerService();
    const seriesService = SeriesService();
    const venueService = VenueService();
    const teamService = TeamService();

    const [bowlingStriker, setBowlingStriker] = useState({});
    const [manOfTheMatch, setManOfTheMatch] = useState({});
    const [showMatchSecondInningsStartModal, setShowMatchSecondInningsStartModal] = useState(false);
    const [showWicketModal, setShowWicketModal] = useState(false);

    const [takenRuns, setTakenRuns] = useState(0);
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

    if (match.stage == STAGE.UPCOMING || match.stage == STAGE.TOSS) {
        return <h1>NOT FOUND</h1>
    }

    const venue = venueService.findById(match.venueId);
    const series = seriesService.findById(match.seriesId);
    const team1 = teamService.findById(match.team1Id);
    const team2 = teamService.findById(match.team2Id);

    const matchPlayers = [...match.team1Players, ...match.team2Players].map(item => {
        const team = teamService.findById(item.teamId);
        return {...item, label: `${item.name} (${team.name})`, value: item.id, team: team.name}
    });

    const commentary = useCommentaryStore.getState().commentaries.find(commentary => commentary.id == match.commentaryId);

    const commentaryList = commentary.commentaryList.filter(item => item.inningsNumber == commentary.miniScore.innings);
    const commentary1stInningsList = commentary.commentaryList.filter(item => item.inningsNumber == 1);
    const commentary2ndInningsList = commentary.commentaryList.filter(item => item.inningsNumber == 2);

    const bowlingSquads = match.team1Id == commentary.miniScore.batTeamId ? match.team2Players : match.team1Players;

    const quotaExpiredBowlers = scorecardService.getQuotaExpiredBowlers(match);

    let availableBowlingSquads = bowlingSquads
        .filter(item => item.id != commentary.miniScore.lastOverBowlerId)
        .filter(item => !quotaExpiredBowlers.some(bowler => bowler.id == item.id));

    availableBowlingSquads = availableBowlingSquads.map(item => {
        return {...item, label: `${item.name} (${item.role})`, value: item.id}
    });

    const handleChangeBowler = (match) => {
        if (Object.keys(bowlingStriker).length <= 0) {
            return;
        }

        scorerService.changeBowlingStriker(match, bowlingStriker);
    }

    const handleMOMPlayer = (match) => {
        if (Object.keys(manOfTheMatch).length <= 0) {
            return;
        }

        scorerService.makeManOfTheMatch(match, manOfTheMatch);
    }

    const onSwapBatsmanHandler = () => {
        scorerService.swapBatsman(match);
    }

    const handleToggle = (option) => {
        switch (option) {
            case "wicket":
                setIsWicket(!isWicket);
                break;
            case "wide":
                setIsWide(!isWide);
                setIsNoBall(false);
                setIsByes(false);
                setIsLegByes(false);
                break;
            case "noBall":
                setIsNoBall(!isNoBall);
                setIsWide(false);
                break;
            case "byes":
                setIsByes(!isByes);
                setIsLegByes(false);
                setIsWide(false);
                break;
            case "legByes":
                setIsLegByes(!isLegByes);
                setIsByes(false);
                setIsWide(false);
                break;
            default:
                break;
        }
    };

    const onRunHandler = (takenRun) => {
        setTakenRuns(takenRun);

        if (commentary.miniScore.balls != 0 && commentary.miniScore.isOverBreak) {
            alert("you should change bowler");
            return;
        }

        if (commentary.miniScore.isInningsBreak) {
            alert("you should change innings");
            return;
        }

        if (match.stage == STAGE.END) {
            alert("Match ended.");
            return;
        }

        if ((isLegByes || isByes) && takenRun == 0) {
            alert("Must be greater than 0.");
            return;
        }

        if (isWicket) {
            setShowWicketModal(true)
            return;
        }

        scorerService.runAndEvents(match, takenRun, {
            isWide: isWide,
            isNoBall: isNoBall,
            isByes: isByes,
            isLegByes: isLegByes,
        });

        setIsWicket(false);
        setIsWide(false);
        setIsNoBall(false);
        setIsByes(false);
        setIsLegByes(false);
    }

    const onChangeHandler = (e) => {
        switch (e.target.name) {
            case "bowlerStrikerId":
                setBowlingStriker(availableBowlingSquads.find(item => item.id == e.target.value));
                break;
            case "momPlayerId":
                setManOfTheMatch(matchPlayers.find(item => item.id == e.target.value));
                break;
            default:
                break;
        }
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
                                        {(commentary.miniScore.isOverBreak == true || commentary.miniScore.isInningsBreak == true || match.stage == STAGE.END) &&
                                            <div className="disabled-area"></div>
                                        }
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <div className="scorer-wicket-and-extras">
                                                    <ul>
                                                        <li className={`wicket ${isWicket ? 'active' : ''}`}
                                                            onClick={() => handleToggle("wicket")}>
                                                            <span>Wicket</span>
                                                        </li>
                                                        <li className={`extra ${isWide ? 'active' : ''}`}
                                                            onClick={() => handleToggle("wide")}>
                                                            <span>Wide</span>
                                                        </li>
                                                        <li className={`extra ${isNoBall ? 'active' : ''}`}
                                                            onClick={() => handleToggle("noBall")}>
                                                            <span>No Ball</span>
                                                        </li>
                                                        <li className={`extra ${isByes ? 'active' : ''}`}
                                                            onClick={() => handleToggle("byes")}>
                                                            <span>Byes</span>
                                                        </li>
                                                        <li className={`extra ${isLegByes ? 'active' : ''}`}
                                                            onClick={() => handleToggle("legByes")}>
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
                                                            <span className="bg-primary"
                                                                  onClick={onSwapBatsmanHandler}>Swap</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="runs">
                                                    <div className="card card-shadow mb-0 h-100 first-second">
                                                        <ul className="first">
                                                            <li className={isByes || isLegByes ? "disabled" : ""} onClick={() => onRunHandler(0)}>
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
                                    {commentary.miniScore.isOverBreak == true &&
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
                                                                <Button className="hithub-btn-2"
                                                                        onClick={() => handleChangeBowler(match)}>
                                                                    Change Bowler
                                                                </Button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </div>
                                    }

                                    {commentary.miniScore.isInningsBreak == true &&
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <Button className="hithub-btn-2"
                                                        onClick={() => setShowMatchSecondInningsStartModal(true)}>
                                                    Start 2nd Innings
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {match.stage == STAGE.END && Object.keys(match.manOfTheMatch).length <= 0 &&
                                        <div className="widget widget-scorer">
                                            <div className="card card-shadow">
                                                <Form>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <SelectField
                                                                fieldName="momPlayerId"
                                                                fieldLabel="Man of the Match"
                                                                options={matchPlayers}
                                                                handler={onChangeHandler}
                                                            />
                                                        </Col>
                                                        <Col xs={12}>
                                                            <FormGroup className="float-end">
                                                                <Button className="hithub-btn-2"
                                                                        onClick={() => handleMOMPlayer(match)}>
                                                                    Submit
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
                                            <li><Link to={`/match/${match.id}/live-score`} className="active">Commentary</Link></li>
                                            <li><Link to={`/match/${match.id}/scorecard`}>Scorecard</Link></li>
                                            <li><a href="#">Partnership</a></li>
                                            <li><a href="#">Team</a></li>
                                        </ul>
                                    </div>

                                    {match.stage != STAGE.END &&
                                        <>
                                            <div className="card card-shadow p-0">
                                                <div className="table-responsive">
                                                    <table
                                                        className="widget-table table table-striped table-medium no-border">
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
                                                            <td>
                                                                <strong>{commentary.miniScore.batsmanStriker.runs}</strong>
                                                            </td>
                                                            <td>{commentary.miniScore.batsmanStriker.balls}</td>
                                                            <td>{commentary.miniScore.batsmanStriker.fours}</td>
                                                            <td>{commentary.miniScore.batsmanStriker.sixes}</td>
                                                            <td>{commentary.miniScore.batsmanStriker.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat((commentary.miniScore.batsmanStriker.runs * 100) / commentary.miniScore.batsmanStriker.balls).toFixed(2)}</td>
                                                        </tr>
                                                        {commentary.miniScore.wickets < 10 &&
                                                            <tr>
                                                                <td>
                                                                    <a href="#"><strong>{commentary.miniScore.batsmanNonStriker.nickname}</strong></a> ({commentary.miniScore.batsmanNonStriker.bat})
                                                                </td>
                                                                <td>
                                                                    <strong>{commentary.miniScore.batsmanNonStriker.runs}</strong>
                                                                </td>
                                                                <td>{commentary.miniScore.batsmanNonStriker.balls}</td>
                                                                <td>{commentary.miniScore.batsmanNonStriker.fours}</td>
                                                                <td>{commentary.miniScore.batsmanNonStriker.sixes}</td>
                                                                <td>{commentary.miniScore.batsmanNonStriker.balls <= 0 ? parseFloat(0).toFixed(2) : parseFloat((commentary.miniScore.batsmanNonStriker.runs * 100) / commentary.miniScore.batsmanNonStriker.balls).toFixed(2)}</td>
                                                            </tr>
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="card card-shadow p-0">
                                                <div className="table-responsive">
                                                    <table
                                                        className="widget-table table table-striped table-medium no-border">
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
                                                            <td>
                                                                <strong>{commentary.miniScore.bowlerStriker.overs}</strong>
                                                            </td>
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
                                                        {Object.keys(commentary.miniScore.lastWicket).length > 0 &&
                                                            <h5>Last Bat: <span>{commentary.miniScore.lastWicket.name} c Rahul b Siraj - {commentary.miniScore.lastWicket.runs}r {commentary.miniScore.lastWicket.balls}b {commentary.miniScore.lastWicket.fours}x4 {commentary.miniScore.lastWicket.sixes}x6) SR: {commentary.miniScore.lastWicket.balls == 0 ? "0.00" : parseFloat((commentary.miniScore.lastWicket.runs * 100) / commentary.miniScore.lastWicket.balls).toFixed(2)}</span>
                                                            </h5>
                                                        }
                                                        <div className="recent-spell">
                                                            <label>recent:</label>
                                                            <ul>
                                                                {commentaryList.slice(0, 6).map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            <ul>
                                                                {commentaryList.slice(6, 12).map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            <ul>
                                                                {commentaryList.slice(12, 18).map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            <ul>
                                                                {commentaryList.slice(18, 24).map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            <ul>
                                                                {commentaryList.slice(24, 30).map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                <span
                                                                    className={getEventBg(item.event)}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }
                                </section>

                                {(commentary1stInningsList.length > 0 ||
                                        commentary2ndInningsList.length > 0 ||
                                        commentary.preFirstInningsCommentaries.length > 0 ||
                                        commentary.postFirstInningsCommentaries.length > 0 ||
                                        commentary.preSecondInningsCommentaries.length > 0 ||
                                        commentary.postSecondInningsCommentaries.length > 0
                                    ) &&
                                    <section className="pt-0">
                                        <div className="widget widget-rankings">
                                            <div className="card card-shadow">
                                                <div className="commentary-box">
                                                    <div className="commentary-body">
                                                        <ul className="commentary-list">
                                                            {commentary.postSecondInningsCommentaries.length > 0 &&
                                                                <ul className="commentary-list">
                                                                    {commentary.postSecondInningsCommentaries.map((item, index) => {
                                                                        return (
                                                                            <li key={index}>
                                                                                <p>{item}</p>
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            }
                                                            {commentary2ndInningsList.map((item, index) => {
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
                                                                                <h5>{parseInt(item.overs) == item.overs ? (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : (item.overs - 0.4)) : (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : item.overs)}
                                                                                </h5>
                                                                                <span
                                                                                    className={`${getEventBg(item.event)}`}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                            </div>
                                                                            <p>
                                                                                {item.bowlerNickname} to {item.batsmanNickname}, {getEventText(item, item.extraRuns > 0)} {item.milestone != null &&
                                                                                <>
                                                                                    a crucial <strong
                                                                                    className="text-uppercase">{item.milestone}</strong> for {item.batsmanNickname}.
                                                                                </>} {item.event == EVENT.WICKET &&
                                                                                <>
                                                                                    <strong>{wicketTypes.getLabel(item.wicketDetails?.wicketCode)}</strong> {item.wicketDetails?.name}! {(item.wicketDetails?.wicketCode == wicketTypes.catch || item.wicketDetails?.wicketCode == wicketTypes.run || item.wicketDetails?.wicketCode == wicketTypes.stumped) && <>
                                                                                        by {item.wicketDetails?.fielderName}. <strong>{item.wicketDetails?.wicketCode == wicketTypes.run ? `${item.runs == 0 ? `No run completed.` : `${item.runs} run(s) completed.`}` : ""}</strong>
                                                                                    </>} A huge wicket for bowling team. <strong>{item.wicketDetails?.name} {item.wicketDetails?.runs} ({item.wicketDetails?.balls}) [4s-{item.wicketDetails?.fours}, 6s-{item.wicketDetails?.sixes}]</strong>
                                                                                </>}
                                                                            </p>
                                                                        </li>
                                                                    </div>
                                                                )
                                                            })}
                                                        </ul>
                                                        {commentary.preSecondInningsCommentaries.length > 0 &&
                                                            <ul className="commentary-list">
                                                                {commentary.preSecondInningsCommentaries.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <p>{item}</p>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        }
                                                        {commentary.postFirstInningsCommentaries.length > 0 &&
                                                            <ul className="commentary-list">
                                                                {commentary.postFirstInningsCommentaries.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <p>{item}</p>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        }
                                                        <ul className="commentary-list">
                                                            {commentary1stInningsList.map((item, index) => {
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
                                                                                <h5>{parseInt(item.overs) == item.overs ? (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : (item.overs - 0.4)) : (item.extraType == EXTRAS.NO_BALL || item.extraType == EXTRAS.WIDE ? parseFloat(item.overs + 0.1).toFixed(1) : item.overs)}
                                                                                </h5>
                                                                                <span
                                                                                    className={`${getEventBg(item.event)}`}>{item.event == EVENT.WICKET ? "W" : ""}{item.extraType ? (`${item.extraType}${item.runs - item.extraRuns}`) : item.runs}</span>
                                                                            </div>
                                                                            <p>
                                                                                {item.bowlerNickname} to {item.batsmanNickname}, {getEventText(item, item.extraRuns > 0)} {item.milestone != null &&
                                                                                <>
                                                                                    a crucial <strong
                                                                                    className="text-uppercase">{item.milestone}</strong> for {item.batsmanNickname}.
                                                                                </>} {item.event == EVENT.WICKET &&
                                                                                <>
                                                                                    <strong>{wicketTypes.getLabel(item.wicketDetails?.wicketCode)}</strong> {item.wicketDetails?.name}! {(item.wicketDetails?.wicketCode == wicketTypes.catch || item.wicketDetails?.wicketCode == wicketTypes.run || item.wicketDetails?.wicketCode == wicketTypes.stumped) && <>
                                                                                    by {item.wicketDetails?.fielderName}. <strong>{item.wicketDetails?.wicketCode == wicketTypes.run ? `${item.runs == 0 ? `No run completed.` : `${item.runs} run(s) completed.`}` : ""}</strong>
                                                                                </>} A huge wicket for bowling
                                                                                    team. <strong>{item.wicketDetails?.name} {item.wicketDetails?.runs} ({item.wicketDetails?.balls})
                                                                                    [4s-{item.wicketDetails?.fours},
                                                                                    6s-{item.wicketDetails?.sixes}]</strong>
                                                                                </>}
                                                                            </p>
                                                                        </li>
                                                                    </div>
                                                                )
                                                            })}
                                                        </ul>
                                                        {commentary.preFirstInningsCommentaries.length > 0 &&
                                                            <ul className="commentary-list">
                                                                {commentary.preFirstInningsCommentaries.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <p>{item}</p>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        }
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

                {commentary.miniScore.isInningsBreak == true &&
                    <DefaultModal
                        title="Start 2nd Innings"
                        show={showMatchSecondInningsStartModal}
                        handleClose={() => {
                            setShowMatchSecondInningsStartModal(false)
                        }}>

                        <MatchSecondInningsStartForm
                            defaultMatch={match}
                            buttonLabel="Start"
                            setShowFormModal={setShowMatchSecondInningsStartModal}
                        />

                    </DefaultModal>
                }

                <DefaultModal
                    title="Wicket"
                    show={showWicketModal}
                    handleClose={() => {
                        setShowWicketModal(false)
                    }}>

                    <ScorerWicketForm
                        defaultMatch={match}
                        takenRuns={takenRuns}
                        extras={{
                            isWide: isWide,
                            isNoBall: isNoBall,
                            isByes: isByes,
                            isLegByes: isLegByes,
                        }}
                        buttonLabel="Done"
                        setShowFormModal={setShowWicketModal}
                    />

                </DefaultModal>
            </>
        </AppLayout>
    )
}

export default HomeIndex;