// Evento para manejar el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que la página se recargue

    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('password').value.trim();

    // Validar campos vacíos
    if (!usuario || !contrasena) {
        alert('Por favor, ingresa usuario y contraseña.');
        return;
    }

    const button = document.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerText = 'Cargando...';

    try {
        // Hacer solicitud al endpoint de login
        const response = await fetch('https://apitentacion.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuario,
                contrasena: contrasena,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                // Guardar el token y la expiración en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('tokenExpiration', Date.now() + (data.expirationTime || 3600000)); // Expiración predeterminada: 1 hora

                alert('Inicio de sesión exitoso');
                window.location.href = '/HTML/VistaAdministrador.html'; // Redirigir al dashboard
            } else {
                alert('Error: Token no recibido del servidor.');
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error en el login:', errorData);
            alert('Error: ' + (errorData?.error || 'Credenciales incorrectas o problema en la solicitud.'));
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        alert('Error al conectar con el servidor. Por favor, verifica tu conexión.');
    } finally {
        // Restaurar estado del botón
        button.disabled = false;
        button.innerText = 'Iniciar sesión';
    }
});

// Overlay para "¿Olvidaste tu contraseña?"
// Overlay para "¿Olvidaste tu contraseña?"
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const olvideContrasenaLink = document.getElementById('olvide-contrasena-link');
    const cerrarOverlayBtn = document.getElementById('cerrar-overlay-btn');
    const enviarRecuperacionBtn = document.getElementById('enviar-recuperacion-btn');
    const correoRecuperacionInput = document.getElementById('correo-recuperacion');

    // Asegurarse de que el overlay esté oculto al cargar la página
    if (!overlay.classList.contains('overlay-hidden')) {
        overlay.classList.add('overlay-hidden');
    }

    // Mostrar el overlay al hacer clic en "¿Olvidaste tu contraseña?"
    olvideContrasenaLink.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.classList.remove('overlay-hidden'); // Mostrar overlay
    });

    // Cerrar el overlay al hacer clic en "Cerrar"
    cerrarOverlayBtn.addEventListener('click', () => {
        overlay.classList.add('overlay-hidden'); // Ocultar overlay
    });

    // Enviar correo de recuperación
    enviarRecuperacionBtn.addEventListener('click', () => {
        const correo = correoRecuperacionInput.value.trim();

        if (!correo) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Simular el envío del correo (puedes reemplazarlo con una solicitud real a tu backend)
        setTimeout(() => {
            alert(`Se ha enviado un correo de recuperación a: ${correo}`);
            overlay.classList.add('overlay-hidden'); // Ocultar overlay después de enviar
            correoRecuperacionInput.value = ''; // Limpiar el campo de correo
        }, 500); // Simulación de tiempo de envío
    });
});


// Script para el funcionamiento del boton mostrar contrasña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function (e) {
    // Cambiar el tipo de input entre 'password' y 'text'
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Cambiar el ícono del boton mostrar contraseña
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});
