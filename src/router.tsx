import React, {lazy, Suspense} from "react";
import SuspenseLoader from "./components/SuspenseLoader";

const Loader = (Component: any) => (props: any) =>
    (
        <Suspense fallback={<SuspenseLoader/>}>
            <Component {...props} />
        </Suspense>
    );

const StartPage = Loader(
    lazy(() => import('./containers/StartPage/index'))
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


export const links = {
    lobby: '/lobby',
    start: '/',
    game: '/game',
    room: '/room'
}

export const routes = [
    {
        path: '/',
        element: <StartPage/>,
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
        path: "*",
        element: <Page404/>
    }
]