import axios from 'axios';
import { API_URL } from '../config.ts';
import type {VideoGame} from '../types/VideoGame';
import type {CreateVideoGame} from '../types/CreateVideoGame';
import type {UpdateVideoGame} from '../types/UpdateVideoGame';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const videoGameService = {
    getAll: async (): Promise<VideoGame[]> => {
        const response = await api.get<VideoGame[]>('/videogames');
        return response.data;
    },

    getById: async (id: number): Promise<VideoGame> => {
        const response = await api.get<VideoGame>(`/videogames/${id}`);
        return response.data;
    },

    create: async (videoGame: CreateVideoGame): Promise<VideoGame> => {
        const response = await api.post<VideoGame>('/videogames', videoGame);
        return response.data;
    },

    update: async (id: number, videoGame: UpdateVideoGame): Promise<VideoGame> => {
        const response = await api.put<VideoGame>(`/videogames/${id}`, videoGame);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/videogames/${id}`);
    },
};