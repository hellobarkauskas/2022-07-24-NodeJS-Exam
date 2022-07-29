import { MAIN_URL } from '../config.js';
import { navigateToPage } from '../utility.js';

const login = async (userLogin) => {
    const response = await fetch(`${MAIN_URL}/authentication/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    });

    const data = await response.json();

    if (data.error) {
        document.getElementById('error-message').textContent = data.error;
        return;
    };

    localStorage.setItem('token', data.token);

    navigateToPage('groups');
};

document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const elements = event.target.elements;

    login({
        email: elements.email.value,
        password: elements.password.value
    });

    document.getElementById('email').value = '';
    document.getElementsId('password').value = '';
});