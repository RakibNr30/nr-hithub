import {venus} from "../ds/venus";

const VenueService = () => {

    const findAll = () => {
        return venus;
    }

    const findById = (id) => {
        return findAll().find(venue => venue.id == id);
    }

    return {
        findAll,
        findById
    }
}

export default VenueService;