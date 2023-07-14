import { useState, createContext } from 'react'
import * as React from 'react'
import { Token, tokenIsValid, getStoredToken, decodeToken } from "./utils/auth";
import Login from "./components/Login";
import Home from "./components/Home";
import { CssBaseline, Box, Container } from '@mui/material';


export type AuthContextType = {
  token: Token | null,
  setToken: React.Dispatch<React.SetStateAction<Token | null>>,
}

const AuthContext = createContext<AuthContextType | null>(null);

const tokenString = getStoredToken();
const initialToken = tokenString ? decodeToken(tokenString) : null;
function App() {
  const [token, setToken] = useState<Token | null>(initialToken);
  const showLogin = !(token && tokenIsValid(token));

  return (
    <>
      <CssBaseline />
      <AuthContext.Provider value={
        { token, setToken }
      }>
        <Container component="main" maxWidth="lg">
          <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {showLogin ? <Login setToken={setToken} /> : <Home token={token} />}
          </Box>
        </Container>
      </AuthContext.Provider >
    </>
  )
}

export default App
