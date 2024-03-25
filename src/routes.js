import {createBrowserRouter} from "react-router-dom";
import MatchIndex from "./pages/match/MatchIndex";
import LiveScore from "./pages/scorer/LiveScore";

export const webRoutes = createBrowserRouter([
    {
        path: "/",
        element: <MatchIndex />,
    },
    {
        path: "/match/:id/live-score",
        element: <LiveScore />,
    }
]);