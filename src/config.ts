interface Config {
  omdb: {
    apiKey: string;
    baseUrl: string;
  };
}

const config: Config = {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY || '2817519b',
    baseUrl: 'http://www.omdbapi.com'
  }
} as const;

export default config; 