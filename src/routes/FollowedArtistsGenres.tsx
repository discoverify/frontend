import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { type GridColumns } from '@mui/x-data-grid-premium';
import { useAtomValue } from 'jotai';
import { useQuery } from 'react-query';
import { tokenState } from '../store';
import { Layout } from '../components/Layout';
import { Table } from '../components/Table';

const columns: GridColumns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
    sortable: false,
  },
  {
    field: 'count',
    headerName: 'Count',
    width: 100,
    sortable: false,
  },
  {
    field: 'actions',
    headerName: 'Top tracks from genre',
    width: 300,
    sortable: false,
    renderCell: (params) => (
      <Button
        component={RouterLink}
        to={`/followed-artists/top-tracks?genre=${encodeURIComponent(
          params.row.name,
        )}`}
      >
        Top tracks
      </Button>
    ),
  },
];

async function fetchFollowedArtistsGenres(token) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/followed-artists/genres?tokenId=${token}`,
  );

  const body = await res.json();

  return body;
}

export function FollowedArtistsGenres() {
  const token = useAtomValue(tokenState);

  const { isLoading, data } = useQuery(['followed-artists-genres', token], () =>
    fetchFollowedArtistsGenres(token),
  );

  return (
    <Layout>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Genres from followed artists
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are genres
      </Typography>

      <div style={{ height: 800 }}>
        <Table
          loading={isLoading}
          rows={data}
          columns={columns}
          getRowId={(row) => row.name}
        />
      </div>
    </Layout>
  );
}
