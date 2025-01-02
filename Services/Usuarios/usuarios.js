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

// Función para obtener todos los usuarios
async function obtenerUsuarios() {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get('http://localhost:3003/administradores', config);

        if (response.status === 200) {
            const usuarios = response.data;
            mostrarUsuarios(usuarios); // Mostrar todos los usuarios inicialmente
            configurarBusqueda(usuarios); // Configurar la búsqueda
        } else {
            console.error('Error al obtener usuarios:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// Función para renderizar usuarios en la tabla
function mostrarUsuarios(usuarios) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario._id}</td>
            <td>${usuario.nombre} ${usuario.apellidos}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.rol}</td>
            <td>
                <button class="editar-btn" data-id="${usuario._id}">Editar</button>
                <button class="eliminar-btn" data-id="${usuario._id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Agregar eventos a los botones "Editar"
    document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const usuarioId = event.target.getAttribute('data-id');
            redirigirAEditarUsuario(usuarioId);
        });
    });

    // Agregar evento a los botones "Eliminar"
    document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const usuarioId = event.target.getAttribute('data-id');
            confirmarEliminarUsuario(usuarioId);
        });
    });
}

// Función para redirigir a la página de edición
function redirigirAEditarUsuario(usuarioId) {
    window.location.href = `/HTML/Usuarios/editarUsuario.html?id=${usuarioId}`;
}

// Función para confirmar la eliminación del usuario
function confirmarEliminarUsuario(usuarioId) {
    const confirmar = confirm("¿Seguro que quiere eliminar el usuario? Esta acción no se puede deshacer.");

    if (confirmar) {
        eliminarUsuario(usuarioId);
    }
}

// Función para eliminar el usuario
async function eliminarUsuario(usuarioId) {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.delete(`http://localhost:3003/administradores/${usuarioId}`, config);

        if (response.status === 200) {
            alert('Usuario eliminado con éxito.');
            obtenerUsuarios(); // Recargar los usuarios después de la eliminación
        } else {
            console.error('Error al eliminar el usuario:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de eliminación:', error);
    }
}

// Configurar la búsqueda
function configurarBusqueda(usuarios) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = inputBuscar.value.toLowerCase();
        const usuariosFiltrados = usuarios.filter(usuario =>
            usuario.nombre.toLowerCase().includes(query) ||
            usuario.apellidos.toLowerCase().includes(query) ||
            usuario.telefono.toLowerCase().includes(query)
        );

        mostrarUsuarios(usuariosFiltrados);
    });

    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const usuariosFiltrados = usuarios.filter(usuario =>
            usuario.nombre.toLowerCase().includes(query) ||
            usuario.apellidos.toLowerCase().includes(query) ||
            usuario.telefono.toLowerCase().includes(query)
        );

        mostrarUsuarios(usuariosFiltrados);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerUsuarios);
