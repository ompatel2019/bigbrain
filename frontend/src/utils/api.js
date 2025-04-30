import config from "../../backend.config.json";

const BASE_URL = `http://localhost:${config.BACKEND_PORT}`;

export const API = {
  LOGIN: `${BASE_URL}/admin/auth/login`,
  REGISTER: `${BASE_URL}/admin/auth/register`,
  LOGOUT: `${BASE_URL}/admin/auth/logout`,
  GET_GAMES: `${BASE_URL}/admin/games`,
  PUT_GAMES: `${BASE_URL}/admin/games`,
  MUTATE_GAME: `${BASE_URL}/admin/game`,
  GET_SESSION: `${BASE_URL}/admin/session`,
  PLAYER: `${BASE_URL}/play/join`,
  PLAYER_GET: `${BASE_URL}/play`,
  PLAYER_PUT: `${BASE_URL}/play`,
};
