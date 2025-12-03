import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const f1Service = {
  // Drivers
  getDrivers: () => api.get('/drivers/'),
  getDriverByCode: (code) => api.get(`/drivers/code/${code}`), // ✨ NEW Endpoint
  
  // Races
  getNextRace: () => api.get('/races/upcoming'),
  getAllRaces: (season = 2025) => api.get(`/races/?season=${season}`),
  getRaceResults: (raceId) => api.get(`/races/${raceId}/results`),
  getRacePredictions: (raceId) => api.get(`/races/${raceId}/predictions`),
  
  // Standings
  getDriverStandings: (season = 2025) => api.get(`/standings/drivers?season=${season}`),
  getConstructorStandings: (season = 2025) => api.get(`/standings/constructors?season=${season}`),
  
  // Teams
  getTeams: () => api.get('/teams/'),
};

export default api;