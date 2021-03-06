import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import { Login } from './routes/Login';
import { Authorize } from './routes/Authorize';
import { Artists } from './routes/Artists';
import { Artist } from './routes/Artist';
import { FollowedArtistsTopTracks } from './routes/FollowedArtistsTopTracks';
import { FollowedArtistsGenres } from './routes/FollowedArtistsGenres';
import { userState } from './store';
import { Liked } from './routes/Liked';
import { Recommendations } from './routes/Recommendations';
import { RelatedArtistsTopTracks } from './routes/RelatedArtistsTopTracks';
import { TopTracks } from './routes/TopTracks';
import { Playlists } from './routes/Playlists';
import { RecentlyPlayed } from './routes/RecentlyPlayed';
import { Playlist } from './routes/Playlist';
import { Layout } from './components/Layout';

const Dashboard = lazy(() => import('./routes/Dashboard'));

export function Router() {
  const user = useRecoilValue(userState);

  let routes: RouteObject[] = [];

  if (user) {
    routes = [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'liked',
            element: <Liked />,
          },
          {
            path: 'recommendations',
            element: <Recommendations />,
          },
          {
            path: 'playlists',
            element: <Playlists />,
          },
          {
            path: 'playlist/:id',
            element: (
              <Suspense fallback={<CircularProgress />}>
                <Playlist />
              </Suspense>
            ),
          },
          {
            path: 'artists',
            element: <Artists />,
          },
          {
            path: 'top-tracks',
            element: <TopTracks />,
          },
          {
            path: 'recently-played',
            element: <RecentlyPlayed />,
          },
          {
            path: 'followed-artists/top-tracks',
            element: <FollowedArtistsTopTracks />,
          },
          {
            path: 'related-artists/top-tracks/:id',
            element: <RelatedArtistsTopTracks />,
          },
          {
            path: 'related-artists/top-tracks',
            element: <RelatedArtistsTopTracks />,
          },
          {
            path: 'followed-artists/genres',
            element: <FollowedArtistsGenres />,
          },
          {
            path: 'artist/:id',
            element: (
              <Suspense fallback={<CircularProgress />}>
                <Artist />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/login',
        element: <Navigate to="/" replace />,
      },
    ];
  } else {
    routes = [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/authorize',
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Authorize />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />,
      },
    ];
  }

  const element = useRoutes(routes);

  return element;
}
