import axios from './axios';

export const fetchMismatches = () => axios.get('/mismatches').then(r => r.data);
export const resolveMismatch = (id: string) =>
  axios.post(`/mismatches/${id}/resolve`);
