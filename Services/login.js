document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que la página se recargue

    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('password').value.trim();

    if (!usuario || !contrasena) {
        alert('Por favor, ingresa usuario y contraseña.');
        return;
    }

    const button = document.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerText = 'Cargando...';


    debugger;

    try {

        debugger;

        const response = await fetch('https://apitentacion.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuario,
                contrasena: contrasena,
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('tokenExpiration', Date.now() + (data.expirationTime || 3600000)); // Ejemplo: 1 hora
                alert('Inicio de sesión exitoso');
                window.location.href = '/HTML/VistaAdministrador.html';
            } else {
                alert('Error: Token no recibido.');
            }
        } else {
            const errorData = await response.json().catch(() => {});
            console.error('Error en el login:', errorData);
            alert('Error: ' + (errorData?.error || 'Solicitud incorrecta.'));
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        alert('Error al conectar con el servidor.');
    } finally {
        button.disabled = false;
        button.innerText = 'Iniciar sesión';
    }
});
