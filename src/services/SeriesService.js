import {series} from "../ds/series";

const SeriesService = () => {

    const findAll = () => {
        return series;
    }

    const findById = (id) => {
        return findAll().find(series => series.id == id);
    }

    return {
        findAll,
        findById
    }
}

export default SeriesService;