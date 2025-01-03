// Comprobar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión primero.');
        window.location.href = 'login.html'; // Redirige al login si no hay token
        return;
    }

    // Simulación de carga del nombre del usuario (opcional)
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = 'Bienvenido, Usuario'; // Cambiar por el nombre del usuario si está disponible
});
