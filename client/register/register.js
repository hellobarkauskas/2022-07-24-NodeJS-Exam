import { MAIN_URL } from '../config.js';
import { navigateToPage } from '../utility.js';

const register = async (user) => {
    const response = await fetch(`${MAIN_URL}/authentication/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const data = await response.json();

    if (data.error) {
        document.getElementById('error-message').textContent = data.error;
        return;
    };

    navigateToPage('/login');
};

document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const elements = event.target.elements;

    if (elements.password.value === elements.repeatpassword.value) {
        console.log('success');
    
    } else {
        console.log('error');
        document.getElementById('error-message').textContent = `Passwords don't match`;
        return;
    };

    register({
        full_name: elements.fullname.value,
        email: elements.email.value,
        password: elements.password.value && elements.repeatpassword.value,
    });

    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('repeatpassword').value = '';
});