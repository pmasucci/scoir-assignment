import { Box, Typography, TextField, Button, } from "@mui/material"
import { login, decodeToken } from "../utils/auth"
import { AuthContextType } from "../App";

type Props = { setToken: AuthContextType["setToken"] };

function Login({ setToken }: Props) {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const token = await login(data.get("username")?.toString(), data.get("password")?.toString());
      setToken(decodeToken(token))
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit</Button>
        </Box>
      </Box>
    </>)
}

export default Login