import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import { Card, Box, Typography } from '@mui/material';

async function authUrlMutation() {
  const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/url`);

  if (!req.ok) {
    throw new Error();
  }

  const res = await req.json();

  return res;
}

export function Login() {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading } = useMutation<{ url: string }, Error>(
    authUrlMutation,
    {
      onSuccess(res) {
        window.location.href = res.url;
      },
      onError(error) {
        console.log('Login error', error);

        enqueueSnackbar('Login error', {
          variant: 'error',
        });
      },
    },
  );

  const handleClick = () => mutate();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ maxWidth: 300, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1.5, color: '#fff' }}>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You can login with Spotify by clicking the button below.
        </Typography>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={isLoading}
        >
          Login with Spotify
        </LoadingButton>
      </Card>
    </Box>
  );
}
