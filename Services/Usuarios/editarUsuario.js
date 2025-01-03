// Obtener el ID del usuario de la URL
function obtenerIdUsuario() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Función para obtener el token de localStorage
function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Tu sesión ha expirado o no estás autenticado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/login.html'; // Redirigir al inicio de sesión si no hay token
        return null;
    }
    return token;
}

// Función para obtener los datos del usuario
async function obtenerUsuario(id) {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get(`http://localhost:3003/administradores/${id}`, config);

        if (response.status === 200) {
            const usuario = response.data;
            llenarFormulario(usuario); // Llenar el formulario con los datos del usuario
        } else {
            console.error('Error al obtener el usuario:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
    }
}

// Función para llenar el formulario con los datos del usuario
function llenarFormulario(usuario) {
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('apellidos').value = usuario.apellidos;
    document.getElementById('usuario').value = usuario.usuario;
    document.getElementById('telefono').value = usuario.telefono;
    document.getElementById('rol').value = usuario.rol;
}

// Función para actualizar el usuario
async function actualizarUsuario(event) {
    event.preventDefault();

    const id = obtenerIdUsuario();
    const token = getToken(); // Obtener el token desde localStorage
    if (!token) return; // Si no hay token, no continuar

    const usuarioActualizado = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        usuario: document.getElementById('usuario').value,
        telefono: document.getElementById('telefono').value,
        contrasena: document.getElementById('contrasena').value,
        rol: document.getElementById('rol').value,
    };

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.put(`http://localhost:3003/administradores/${id}`, usuarioActualizado, config);

        if (response.status === 200) {
            alert('Usuario actualizado con éxito.');
            window.location.href = '/HTML/Usuarios/usuarios.html'; // Redirigir a la lista de usuarios
        } else {
            console.error('Error al actualizar el usuario:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de actualización:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const id = obtenerIdUsuario();
    if (id) {
        obtenerUsuario(id);
    }

    document.getElementById('user-form').addEventListener('submit', actualizarUsuario);
});