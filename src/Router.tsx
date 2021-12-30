import { RouteObject, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAtomValue } from 'jotai/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { Login } from './routes/Login';
import { Authorize } from './routes/Authorize';
import { Artists } from './routes/Artists';
import { Artist } from './routes/Artist';
import { FollowedArtistsTopTracks } from './routes/FollowedArtistsTopTracks';
import { FollowedArtistsGenres } from './routes/FollowedArtistsGenres';
import { userAtom } from './store';
import { Liked } from './routes/Liked';
import { Recommendations } from './routes/Recommendations';
import { RelatedArtistsTopTracks } from './routes/RelatedArtistsTopTracks';

const Dashboard = lazy(() => import('./routes/Dashboard'));

export function Router() {
  const user = useAtomValue(userAtom);

  const routes: RouteObject[] = [];

  if (user) {
    routes.push(
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/liked',
        element: <Liked />,
      },
      {
        path: '/recommendations',
        element: <Recommendations />,
      },
      {
        path: '/artists',
        element: <Artists />,
      },
      {
        path: '/followed-artists/top-tracks',
        element: <FollowedArtistsTopTracks />,
      },
      {
        path: '/related-artists/top-tracks/:id',
        element: <RelatedArtistsTopTracks />,
      },
      {
        path: '/related-artists/top-tracks',
        element: <RelatedArtistsTopTracks />,
      },
      {
        path: '/followed-artists/genres',
        element: <FollowedArtistsGenres />,
      },
      {
        path: '/artist/:id',
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Artist />
          </Suspense>
        ),
      },
    );
  }

  const element = useRoutes(
    routes.concat([
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/authorize',
        element: <Authorize />,
      },
    ]),
  );

  return element;
}
