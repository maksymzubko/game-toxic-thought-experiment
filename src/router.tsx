import React, {lazy, Suspense} from "react";
import SuspenseLoader from "./components/SuspenseLoader";

const Loader = (Component: any) => (props: any) =>
    (
        <Suspense fallback={<SuspenseLoader/>}>
            <Component {...props} />
        </Suspense>
    );

const StartPage = Loader(
    lazy(() => import('./containers/StartPage/MainPage'))
);
const ModePage = Loader(
    lazy(() => import('./containers/StartPage/ModePage'))
);

const GamePage = Loader(
    lazy(() => import('./containers/GamePage/index'))
);


const Page404 = Loader(
    lazy(() => import('./content/pages/Page404/index'))
);

const Lobby = Loader(
    lazy(() => import('./containers/Lobby/index'))
);

const Room = Loader(
    lazy(() => import('./containers/RoomPage/index'))
);

const Profile = Loader(
    lazy(() => import('./containers/Profile/index'))
);


export const links = {
    lobby: '/lobby',
    start: '/',
    mode: '/mode',
    game: '/game',
    room: '/room',
    profile: '/profile',
}

export const routes = [
    {
        path: '/',
        element: <StartPage/>,
    },
    {
        path: '/mode',
        element: <ModePage/>,
    },
    {
        path: '/game',
        element: <GamePage/>
    },
    {
        path: '/lobby',
        element: <Lobby/>
    },
    {
        path: '/room',
        element: <Room/>
    },
    {
        path: '/profile',
        element: <Profile/>
    },
    {
        path: "*",
        element: <Page404/>
    }
]
