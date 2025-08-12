import axios from 'axios';
import type { Timer } from './types';

const api = axios.create({ baseURL: '/api' });

export const listTimers = (shop: string) => api.get<Timer[]>('/timers', { params: { shop } }).then(r => r.data);
export const createTimer = (t: Timer) => api.post<Timer>('/timers', t).then(r => r.data);
export const updateTimer = (id: string, t: Partial<Timer>) => api.put<Timer>(`/timers/${id}`, t).then(r => r.data);
export const deleteTimer = (id: string) => api.delete(`/timers/${id}`).then(r => r.data);
