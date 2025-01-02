document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Seleccionamos el formulario directamente

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Obtener los valores de los campos del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const usuario = document.getElementById('usuario').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const contrasena = document.getElementById('contrasena').value.trim();

            // Validar si los campos están completos
            if (!nombre || !apellidos || !usuario || !telefono || !contrasena) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Recuperar el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No estás autenticado. Por favor, inicia sesión.');
                window.location.href = '/login.html'; // Redirigir al inicio de sesión si no hay token
                return;
            }

            // Body siguiendo la estructura de la documentación
            const data = {
                nombre,
                apellidos,
                usuario,
                telefono,
                contrasena,
            };

            // Deshabilitar el botón y cambiar el texto mientras se envía la solicitud
            const button = document.querySelector('button[type="submit"]');
            button.disabled = true;
            button.innerText = 'Enviando...';

            console.log({
                nombre,
                apellidos,
                usuario,
                telefono,
                contrasena,
            });
            

            try {
                // Realizar la solicitud POST con el token en los headers
                const response = await axios.post('http://localhost:3003/administradores', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Incluir el token
                    },
                });

                // Verificar si la respuesta fue exitosa
                if (response.status === 201) {
                    alert('Usuario creado exitosamente.');
                    window.location.href = '/HTML/VistaAdministradores.html'; // Redirigir a otra página
                } else {
                    alert('Ocurrió un error inesperado.');
                }
            } catch (error) {
                console.error('Error al crear usuario:', error.response?.data || error.message);

                // Mostrar mensaje de error personalizado si está disponible
                alert(error.response?.data?.message || 'Error al crear usuario. Por favor, revisa los datos ingresados.');
            } finally {
                // Volver a habilitar el botón y restaurar su texto
                button.disabled = false;
                button.innerText = 'Enviar';
            }
        });
    } else {
        console.error('Formulario no encontrado en el DOM.');
    }
});
