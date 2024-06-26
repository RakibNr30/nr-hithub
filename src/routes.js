import {createBrowserRouter} from "react-router-dom";
import MatchIndex from "./pages/match/MatchIndex";
import LiveScore from "./pages/scorer/LiveScore";
import ScorecardIndex from "./pages/scorecard/ScorecardIndex";
import ScorecardPartnership from "./pages/scorecard/ScorecardPartnership";

export const webRoutes = createBrowserRouter([
    {
        path: "/",
        element: <MatchIndex />,
    },
    {
        path: "/match/:id/live-score",
        element: <LiveScore />,
    },
    {
        path: "/match/:id/scorecard",
        element: <ScorecardIndex />,
    },
    {
        path: "/match/:id/partnership",
        element: <ScorecardPartnership />,
    }
]);