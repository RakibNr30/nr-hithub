import AppLayout from "../../layouts/AppLayout";
import {useEffect, useState} from "react";
import {matches as matchList} from "../../ds/matches";
import DefaultModal from "../../components/common/DefaultModal";
import MatchForm from "./MatchForm";
import MatchCard from "./MatchCard";
import Match from "../../models/Match";
import MatchService from "../../services/MatchService";

const MatchIndex = () => {

    const matchService = MatchService();

    const [matches, setMatches] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        setMatches(matchService.findAll());
    }, []);

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

                            {matches.map((match, index) => {
                                return <MatchCard match={match} key={index}/>
                            })}

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