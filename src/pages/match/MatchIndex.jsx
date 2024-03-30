import AppLayout from "../../layouts/AppLayout";
import {useState} from "react";
import DefaultModal from "../../components/common/DefaultModal";
import MatchForm from "./MatchForm";
import MatchCard from "./MatchCard";
import Match from "../../models/Match";
import MatchService from "../../services/MatchService";
import useMatchStore from "../../stores/matchStore";
import {STAGE} from "../../constants/match";

const MatchIndex = () => {

    const matchService = MatchService();

    const [showAddModal, setShowAddModal] = useState(false);

    const matches = useMatchStore.getState().matches;

    const handleAdd = (match) => {
        matchService.save(match);
    }

    return (
        <AppLayout>
            <>
                <div className="main-container main-container-2">
                    <div className="container">
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

                            {matches.length > 0 ?
                                <>
                                    {matches.map((match, index) => {
                                        return <MatchCard match={match} key={index}/>
                                    })}
                                </>
                                :
                                <>
                                    <div className="card card-shadow p-0">
                                        <div className="score-card">
                                            <div className="score-card-inner flex-grow-1 px-20 py-20">
                                                <div className="score-card-header not-found">
                                                    <img src="/images/logo.png" className="not-found" alt=""/>
                                                    <span className="not-found">No matches available.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                        defaultMatch={new Match()}
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