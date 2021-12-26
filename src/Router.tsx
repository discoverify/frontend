import { Route, RouteObject, Routes, useRoutes} from 'react-router-dom';
import { lazy } from 'react';
import { Login } from './routes/Login';
import { Authorize } from './routes/Authorize';
import { Artists } from './routes/Artists';
import { Artist } from './routes/Artist';
import { FollowedArtistsTopTracks } from './routes/FollowedArtistsTopTracks';
import { FollowedArtistsGenres } from './routes/FollowedArtistsGenres';
import { userSelector } from './store';
import { Liked } from './routes/Liked';
import { Recommendations } from './routes/Recommendations';
import { useAtomValue } from 'jotai/utils';
const Dashboard = lazy(() => import('./routes/Dashboard'));

export function Router() {
  const user = useAtomValue(userSelector);

  const routes: RouteObject[] = [];

  if (user) {
    routes.push(
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/liked",
        element: <Liked />,
      },
      {
        path: "/recommendations",
        element: <Recommendations />,
      },
      {
        path: "/artists",
        element: <Artists />,
      },
      {
        path: "/followed-artists/top-tracks",
        element: <FollowedArtistsTopTracks />,
      },
      {
        path: "/followed-artists/genres",
        element: <FollowedArtistsGenres />,
      },
      {
        path: "/artist/:id",
        element: <Artist />,
      },
    )
  }

  const element = useRoutes(routes.concat([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/authorize",
      element: <Authorize />,
    },
  ]));

  return (
    element
  );
}
