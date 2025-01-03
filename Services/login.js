document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que la página se recargue

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('password').value;

    if (!usuario || !contrasena) {
        alert('Por favor, ingresa usuario y contraseña.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3003/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // O prueba 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                usuario: usuario, // Cambia al nombre esperado por el servidor
                contrasena: contrasena
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            window.location.href = '/HTML/VistaAdministrador.html';
        } else {
            const errorData = await response.json().catch(() => {});
            console.error('Error en el login:', errorData);
            alert('Error: ' + (errorData?.error || 'Solicitud incorrecta.'));
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        alert('Error al conectar con el servidor.');
    }
});
