// Función para obtener el token desde localStorage
function getToken() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired()) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

// Función para verificar si el token ha expirado
function isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true; // Si no hay expiración, asumimos que está expirado
    return Date.now() > parseInt(expiration, 10); // Verifica si el tiempo actual es mayor al de expiración
}

// Función para obtener los detalles de la categoría
async function obtenerCategoria(id) {
    try {
        const token = getToken();
        if (!token) return;

        const response = await axios.get(`https://apitentacion.onrender.com/categoriasProducto/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const categoria = response.data;
            // Llenar el formulario con los datos de la categoría
            document.getElementById('nombreCategoria').value = categoria.nombreCategoria;
            document.getElementById('descripcion').value = categoria.descripcionCategoria;
        } else {
            console.error('Error al obtener la categoría:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
    }
}

// Función para actualizar la categoría
async function actualizarCategoria(id) {
    const nombreCategoria = document.getElementById('nombreCategoria').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!nombreCategoria || !descripcion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const token = getToken();
        if (!token) return;

        const response = await axios.put(`https://apitentacion.onrender.com/categoriasProducto/${id}`, {
            nombreCategoria,
            descripcionCategoria: descripcion
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            alert('Categoría actualizada con éxito.');
            window.location.href = '/HTML/categorias_productos/categorias_productos.html'; // Redirigir al listado de categorías
        } else {
            console.error('Error al actualizar la categoría:', response.status);
        }
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
    }
}

// Obtener el ID de la categoría desde la URL
const urlParams = new URLSearchParams(window.location.search);
const idCategoria = urlParams.get('id');

// Cargar los datos de la categoría en el formulario
document.addEventListener('DOMContentLoaded', function () {
    if (idCategoria) {
        obtenerCategoria(idCategoria);
    } else {
        alert('ID de categoría no proporcionado');
    }

    // Agregar el evento al formulario para enviar los datos
    const form = document.getElementById('form-agregar-categoria');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        actualizarCategoria(idCategoria);
    });
});
