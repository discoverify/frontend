import { Navigate, useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useQuery } from 'react-query';
import { tokenState } from '../store';

export function Authorize() {
  const [searchParams] = useSearchParams();
  const setToken = useSetAtom(tokenState);

  const code = searchParams.get('code');

  const { isSuccess } = useQuery<void, Error, string>(
    ['authorize', code],
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/authorize?code=${code}`,
      );

      const body = await res.text();

      if (res.ok && body) {
        return body;
      }

      throw new Error();
    },
    {
      enabled: !!code,
      suspense: true,
      onSuccess(token) {
        setToken(token);
      },
      onError(e) {
        console.error('Authorize error', e);
      },
    },
  );

  return <Navigate to={isSuccess ? '/dashboard' : '/login'} />;
}
