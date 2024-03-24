import AppLayout from "../../layouts/AppLayout";

const HomeIndex = () => {

    return (
        <AppLayout>
            <>
                <div className="main-container">
                    <div className="container container-2">
                        <div className="row">
                            <div className="col-lg-4">
                                <aside className="sidebar left-sidebar">
                                    <div className="widget widget-scorer">
                                        <div className="card card-shadow">
                                            <div className="scorer-wicket-and-extras">
                                                <ul>
                                                    <li className="wicket">
                                                        <span>Wicket</span>
                                                    </li>
                                                    <li className="extra">
                                                        <span>Wide</span>
                                                    </li>
                                                    <li className="extra">
                                                        <span>No Ball</span>
                                                    </li>
                                                    <li className="extra">
                                                        <span>Byes</span>
                                                    </li>
                                                    <li className="extra">
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
                                </aside>
                            </div>
                            <div className="col-lg-8">
                                <section className="live-matches p-0">
                                    <div className="card card-shadow p-0">
                                        <div className="score-card score-card-lg d-md-flex p-0">
                                            <div className="score-card-inner flex-grow-1 px-20 py-20">
                                                <div className="score-card-header mb-15">
                                                    <strong className="text-red">live</strong>
                                                    <span>1st T20, Mirpur, Mar 24, India tour of Bangladesh</span>
                                                </div>
                                                <div className="score-card-body">
                                                    <div className="country-info">
                                                        <div className="flag-avatar">
                                                            <figure>
                                                                <img src="/images/flags/bd.png" alt=""/>
                                                            </figure>
                                                            <span className="country-name">ban</span>
                                                        </div>
                                                        <div className="score-update ml-10">
                                                            <h5>163/6</h5>
                                                            <p className="text-muted">18.3 ov.</p>
                                                        </div>
                                                    </div>
                                                    <div className="score-update text-center">
                                                        <p>Bangladesh won by 4 wickets with 9 balls remaining.</p>
                                                    </div>
                                                    <div className="country-info flex-row-reverse">
                                                        <div className="flag-avatar ml-10">
                                                            <figure>
                                                                <img src="/images/flags/in.png" alt=""/>
                                                            </figure>
                                                            <span className="country-name">ind</span>
                                                        </div>
                                                        <div className="score-update">
                                                            <h5>162/4</h5>
                                                            <p className="text-muted">20.0 ov.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-aside text-left px-20 py-20">
                                                <p>Current RR<span>3.84</span></p>
                                                <p>Last 5 ov. (RR)<span>6.25</span></p>
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
                                                        <a href="#"><strong>Mahmudullah*</strong></a> (rhb)
                                                    </td>
                                                    <td><strong>28</strong></td>
                                                    <td>11</td>
                                                    <td>2</td>
                                                    <td>3</td>
                                                    <td>254.54</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>Miraz</strong></a> (rhb)
                                                    </td>
                                                    <td><strong>23</strong></td>
                                                    <td>20</td>
                                                    <td>2</td>
                                                    <td>1</td>
                                                    <td>115.00</td>
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
                                                    <th scope="col">econ</th>
                                                    <th scope="col">0s</th>
                                                    <th scope="col">4s</th>
                                                    <th scope="col">6s</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>Bumrah*</strong></a> (rf)
                                                    </td>
                                                    <td><strong>1.5</strong></td>
                                                    <td>0</td>
                                                    <td>28</td>
                                                    <td>0</td>
                                                    <td>13.76</td>
                                                    <td>3</td>
                                                    <td>4</td>
                                                    <td>2</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <a href="#"><strong>Kuldip</strong></a> (ls)
                                                    </td>
                                                    <td><strong>3.0</strong></td>
                                                    <td>0</td>
                                                    <td>21</td>
                                                    <td>1</td>
                                                    <td>7.00</td>
                                                    <td>4</td>
                                                    <td>1</td>
                                                    <td>0</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card card-shadow">
                                        <div className="spell-sum-box">
                                            <h5>Last Bat: <span>Mushfiqur c Rahul b Siraj - 20r 10b 2x4 1x6) SR: 200.00 ) | </span>FOW:
                                                67/3
                                                (7.4 ov)</h5>
                                            <div className="recent-spell">
                                                <label>recent:</label>
                                                <ul>
                                                    <li>
                                                        <span className="bg-success">6</span>
                                                    </li>
                                                    <li>
                                                        <span>2</span>
                                                    </li>
                                                    <li>
                                                        <span>3</span>
                                                    </li>
                                                    <li>
                                                        <span className="bg-success">6</span>
                                                    </li>
                                                    <li>
                                                        <span>0</span>
                                                    </li>
                                                    <li>
                                                        <span className="bg-primary">4</span>
                                                    </li>
                                                </ul>
                                                <ul>
                                                    <li>
                                                        <span>1</span>
                                                    </li>
                                                    <li>
                                                        <span className="bg-primary">4</span>
                                                    </li>
                                                    <li>
                                                        <span>2</span>
                                                    </li>
                                                    <li>
                                                        <span>2</span>
                                                    </li>
                                                    <li>
                                                        <span className="bg-danger">W</span>
                                                    </li>
                                                    <li>
                                                        <span>2</span>
                                                    </li>
                                                </ul>
                                                <ul>
                                                    <li>
                                                        <span>6</span>
                                                    </li>
                                                    <li>
                                                        <span>2</span>
                                                    </li>
                                                    <li>
                                                        <span>3</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-0">
                                    <div className="widget widget-rankings">
                                        <div className="card card-shadow">
                                            <div className="commentary-box">
                                                <div className="commentary-header">
                                                    <h5>Runs<br/>21
                                                    </h5>
                                                    <h5>
                                                        After 6.0 overs<br/>
                                                        53/2
                                                    </h5>
                                                    <p>
                                                        Mahmudullah - 10 (5)<br/>
                                                        Mushfiqur - 8 (3)<br/>
                                                    </p>
                                                    <p>
                                                        Bumrah<br/>
                                                        1-0-21-0
                                                    </p>
                                                </div>
                                                <div className="commentary-body">
                                                    <ul className="commentary-list">
                                                        <li>
                                                            <div>
                                                                <h5>5.6</h5>
                                                                <span className="bg-success">6</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mushfiqur, <strong>SIX</strong>.
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <div>
                                                                <h5>5.5</h5>
                                                                <span>2</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mushfiqur, 2 runs.
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <div>
                                                                <h5>5.4</h5>
                                                                <span>3</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mahmudullah,3 runs.
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <div>
                                                                <h5>5.3</h5>
                                                                <span className="bg-success">6</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mahmudullah, <strong>SIX</strong>.
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <div>
                                                                <h5>5.2</h5>
                                                                <span>0</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mahmudullah, no run.
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <div>
                                                                <h5>5.1</h5>
                                                                <span className="bg-primary">4</span>
                                                            </div>
                                                            <p>
                                                                Bumrah to Mahmudullah, <strong>FOUR</strong>.
                                                            </p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
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

export default HomeIndex;