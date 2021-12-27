import { useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridActionsCellItem,
  type GridColumns,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Breadcrumbs, IconButton, Link } from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import {
  mdiCardsHeartOutline,
  mdiPlayCircleOutline,
  mdiPauseCircleOutline,
  mdiSpotify,
} from '@mdi/js';
import Icon from '@mdi/react';
import { loadingTrackPreview, tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { RecommendationToolbar } from '../components/RecommendationToolbar';

const columns: GridColumns = [
  {
    type: 'actions',
    field: 'actionss',
    headerName: '',
    width: 50,
    sortable: false,
    getActions: (params) => {
      const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);
      const isLoadingTrackPreview = useAtomValue(loadingTrackPreview);
      const isCurrentlyPlaying =
        trackPreview?.url === params.row.preview_url &&
        trackPreview?.context === params.row;

      return [
        <GridActionsCellItem
          color={isCurrentlyPlaying ? 'primary' : 'default'}
          icon={
            <Icon
              path={
                isCurrentlyPlaying && trackPreview?.state === 'playing'
                  ? mdiPauseCircleOutline
                  : mdiPlayCircleOutline
              }
              size={1}
            />
          }
          onClick={() =>
            setTrackPreview({
              url: params.row.preview_url,
              context: params.row,
              state: 'playing',
            })
          }
          disabled={isLoadingTrackPreview}
          label="Play"
        />,
      ];
    },
  },
  {
    field: 'name',
    sortable: false,
    headerName: 'Track name',
    flex: 0.3,
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => (
      <Breadcrumbs>
        {(params.value as any[]).map((artist) => (
          <Link component={RouterLink} to={`/artist/${artist.id}`}>
            {artist.name}
          </Link>
        ))}
      </Breadcrumbs>
    ),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    getActions: (params) => {
      const apiRef = useGridApiContext();

      return [
        <IconButton
          size="small"
          aria-label="Open in Spotify"
          href={params.row.uri}
          target="_blank"
        >
          <Icon path={mdiSpotify} size={1} />
        </IconButton>,

        <GridActionsCellItem
          icon={<Icon path={mdiCardsHeartOutline} size={1} />}
          onClick={() => apiRef.current.publishEvent('saveTrack', params.row)}
          label="Save"
        />,
      ];
    },
  },
];

export function FollowedArtistsTopTracks() {
  const tokenId = useAtomValue(tokenIdState);
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);

  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const genre = searchParams.get('genre');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => trackApi.saveTrack(tokenId, id),
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-tracks', genre],
    async ({ pageParam = 0 }) =>
      artistApi.getFollowedArtistsTopTracks(
        tokenId,
        searchParams.get('genre'),
        pageParam,
      ),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  useEffect(() => {
    if (!apiRef.current || isFetching) return;

    apiRef.current.subscribeEvent('saveTrack', (params) => {
      saveTrack(params.id);
    });
  }, [apiRef, isFetching]);

  const { selectedSeeds, setSelectedSeeds, isSeedSelectable } =
    useSeedSelection();

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Top tracks from followed artists
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that you
        follow. The list does not include tracks that you have already saved in
        your library.
      </Typography>

      <div style={{ height: 800, width: '100%' }}>
        <DataGridPro
          pagination
          paginationMode="server"
          hideFooterPagination
          onRowsScrollEnd={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          checkboxSelection
          onSelectionModelChange={(newSelection) =>
            setSelectedSeeds(newSelection)
          }
          selectionModel={selectedSeeds}
          isRowSelectable={isSeedSelectable}
          disableSelectionOnClick
          disableColumnResize
          disableColumnMenu
          disableColumnReorder
          disableColumnSelector
          disableDensitySelector
          disableMultipleColumnsSorting
          disableColumnFilter
          disableMultipleColumnsFiltering
          hideFooter
          apiRef={apiRef}
          rows={data?.pages.map((page) => page.data).flat()}
          columns={columns}
          loading={isFetching}
          initialState={{
            pinnedColumns: {
              right: ['actions'],
            },
          }}
          components={{
            Toolbar: RecommendationToolbar,
          }}
        />
      </div>
    </Layout>
  );
}
