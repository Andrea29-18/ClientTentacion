document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita el recargo de página

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('password').value;

    if (!usuario || !contrasena) {
        alert('Por favor, ingresa usuario y contraseña.');
        return;
    }

    try {
        const response = await fetch('http://192.168.137.1:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuario, // Cambia al nombre esperado por el servidor
                password: contrasena
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            window.location.href = 'dashboard.html';
        } else {
            const errorData = await response.json().catch(() => null);
            console.error('Error en el login:', errorData);
            alert('Error: ' + (errorData?.error || 'Solicitud incorrecta.'));
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Error al conectar con el servidor.');
    }
});
