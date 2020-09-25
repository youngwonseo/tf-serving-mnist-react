import axios from 'axios';

export interface DataProfile {}

export const predict = (data: any) => axios.post(`/v1/models/mnist:predict`, data);
