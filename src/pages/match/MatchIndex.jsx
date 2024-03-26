import AppLayout from "../../layouts/AppLayout";
import {useState} from "react";
import DefaultModal from "../../components/common/DefaultModal";
import MatchForm from "./MatchForm";
import MatchCard from "./MatchCard";
import Match from "../../models/Match";
import MatchService from "../../services/MatchService";
import useMatchStore from "../../stores/matchStore";

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