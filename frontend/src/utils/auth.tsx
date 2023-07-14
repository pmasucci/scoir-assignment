import { API_PORT } from "../config"
import decode from "jwt-decode";
const ACCESS_TOKEN_KEY = "dogcatcher_token";
const localstorage = window.localStorage;

export type Token = {
  iat: number,
  exp: number,
  sub: string
  username: string
  tokenString: string
}

const storeToken = (accessToken: string) => {
  localstorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

const getStoredToken = (): string | null => {
  return localstorage.getItem(ACCESS_TOKEN_KEY)
}

const removeStoredToken = () => {
  localstorage.removeItem(ACCESS_TOKEN_KEY)
}

const decodeToken = (token: string | null): Token => {
  token = token || getStoredToken()
  if (token === null) {
    throw Error("Error decoding token: Token Missing");
  }
  return {
    ...decode(token),
    tokenString: token
  };
}

const tokenIsValid = (token: Token): boolean => {
  return token.exp - (Date.now() / 1000) > 0
}

async function login(username?: string | null, password?: string | null): Promise<string> {
  const response = await fetch(`http://localhost:${API_PORT}/api/login`,
    {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }
  );
  if (!response.ok) throw Error(`Failed to log in: ${response.status} ${response.statusText}`);
  const { token } = await response.json();
  storeToken(token)
  return token;
}

export {
  storeToken,
  getStoredToken,
  removeStoredToken,
  login,
  decodeToken,
  tokenIsValid
}
