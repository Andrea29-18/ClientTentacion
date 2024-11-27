document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que la pÃ¡gina se recargue

    // ObtÃ©n los valores del formulario
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('password').value;

    try {
        // Realiza la peticiÃ³n POST al endpoint de login usando fetch
        const response = await fetch('http://192.168.137.1:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario, // Usuario ingresado
                contrasena // ContraseÃ±a ingresada
            })
        });

        // Verifica que la respuesta sea correcta (status 200)
        if (response.ok) {
            const data = await response.json();
            const token = data.token; // Asumiendo que el token viene en 'data.token'
            localStorage.setItem('token', token); // Guarda el token en el localStorage

            alert('Inicio de sesiÃ³n exitoso');
            window.location.href = 'dashboard.html'; // Redirige al dashboard o pÃ¡gina principal
        } else {
            // Si la respuesta no es exitosa, muestra el error
            const errorData = await response.json();
            console.error('Error en el login:', errorData);
            alert('Error: ' + (errorData.error || 'Usuario o contraseÃ±a incorrectos.'));
        }
    } catch (error) {
        // Captura y muestra cualquier otro error
        console.error('Error al hacer la solicitud:', error);
        alert('Error de red. Por favor, verifica tu conexiÃ³n.');
    }
});
