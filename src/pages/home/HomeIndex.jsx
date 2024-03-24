import AppLayout from "../../layouts/AppLayout";
import {useEffect, useState} from "react";
import {matches as matchList} from "../../ds/matches";
import SeriesService from "../../services/SeriesService";
import VenueService from "../../services/VenueService";
import TeamService from "../../services/TeamService";

const HomeIndex = () => {

    const seriesService = SeriesService();
    const venueService = VenueService();
    const teamService = TeamService();

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setMatches(matchList);
    }, []);

    return (
        <AppLayout>
            <>
                <div className="main-container">
                    <div className="container container-3">
                        <section className="live-matches pt-0">
                            <div className="card card-shadow">
                                <ul className="nav mb-0">
                                    <li className="active">
                                        <a href="#" className="active">Matches</a>
                                    </li>
                                    <li>
                                        <a href="#" className="add-match-btn">
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
                                                        <div className="score-update ml-10">
                                                            <h5>146/6</h5>
                                                            <p className="text-muted">20.0 ov.</p>
                                                        </div>
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
                                                        <div className="score-update">
                                                            <h5>102/4</h5>
                                                            <p className="text-muted">20.0 ov</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="floating-text text-14">Day 2 - Session 3: Sri Lanka
                                                    lead by 5
                                                    runs.
                                                    CRR: 3.84
                                                </div>
                                            </div>
                                            <div className="card-aside text-right px-20 py-20">
                                                <a href="#" className="cricnotch-btn btn-filled text-uppercase active">Live Score</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }

                        </section>
                    </div>
                </div>
            </>
        </AppLayout>
    )
}

export default HomeIndex;