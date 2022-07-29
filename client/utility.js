import { BASE_URL } from './config.js';

export const navigateToPage = (page) => {
    window.location.href = `${BASE_URL}/${page}`;
}