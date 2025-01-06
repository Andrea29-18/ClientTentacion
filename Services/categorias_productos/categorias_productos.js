// Función para verificar si el token ha expirado
function isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true; // Si no hay expiración, asumimos que está expirado
    return Date.now() > parseInt(expiration, 10); // Verifica si el tiempo actual es mayor al de expiración
}

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

// Función para obtener todas las categorías de productos
async function obtenerCategorias() {
    try {
        const response = await axios.get('https://apitentacion.onrender.com/categoriasProducto');

        if (response.status === 200) {
            const categorias = response.data;
            mostrarCategorias(categorias); // Mostrar todas las categorías
            configurarBusqueda(categorias); // Configurar la búsqueda
        } else {
            console.error('Error al obtener categorías:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

// Función para renderizar categorías en la tabla
function mostrarCategorias(categorias) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    categorias.forEach(categoria => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${categoria.nombreCategoria}</td>
            <td>${categoria.descripcionCategoria}</td>
            <td>
                <button class="editar-btn" data-id="${categoria._id}">Editar</button>
                <button class="eliminar-btn" data-id="${categoria._id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Asignar el evento de edición a los botones
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('editar-btn')) {
        const idCategoria = event.target.getAttribute('data-id'); // Obtener el id de la categoría
        // Redirigir a la página de edición con el id de la categoría
        window.location.href = `editarCategoria.html?id=${idCategoria}`;
    }

    if (event.target && event.target.classList.contains('eliminar-btn')) {
        const idCategoria = event.target.getAttribute('data-id'); // Obtener el id de la categoría
        eliminarCategoria(idCategoria); // Llamar a la función para eliminar
    }
});

// Función para eliminar una categoría
async function eliminarCategoria(id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta categoría?');
    if (confirmacion) {
        try {
            const token = getToken();
            if (!token) return;

            const response = await axios.delete(`https://apitentacion.onrender.com/categoriasProducto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('Categoría eliminada con éxito');
                obtenerCategorias(); // Volver a obtener las categorías actualizadas
            } else {
                console.error('Error al eliminar la categoría:', response.status);
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    }
}

// Configurar la búsqueda
function configurarBusqueda(categorias) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir recarga de la página

        const query = inputBuscar.value.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
        const categoriasFiltradas = categorias.filter(categoria =>
            categoria.nombreCategoria.toLowerCase().includes(query)
        );

        mostrarCategorias(categoriasFiltradas); // Mostrar solo las categorías que coincidan
    });

    // Opcional: Agregar búsqueda en tiempo real
    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const categoriasFiltradas = categorias.filter(categoria =>
            categoria.nombreCategoria.toLowerCase().includes(query)
        );

        mostrarCategorias(categoriasFiltradas); // Mostrar categorías filtradas mientras se escribe
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerCategorias);
