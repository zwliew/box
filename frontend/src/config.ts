const { VITE_APP_API_URL } = import.meta.env;

export const API_URL = VITE_APP_API_URL;

const config = {
  API_URL,
};

export default config;
