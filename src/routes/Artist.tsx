import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { tokenState } from '../store';

export function Artist() {
  const token = useRecoilValue(tokenState);
  const params = useParams();

  const { data } = useQuery(
    ['artist', params.id],
    async function artistQuery() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/artist/${params.id}?tokenId=${token}`,
      );
      const body = await res.json();

      return body.artist;
    },
    { suspense: true },
  );

  return (
    <>
      <h3>{data.name}</h3>

      <Button
        component={RouterLink}
        to={`/related-artists/top-tracks/${data.id}`}
      >
        Related artists' top tracks
      </Button>
    </>
  );
}
