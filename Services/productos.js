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

// Función para obtener todos los productos
async function obtenerProductos() {
    try {
        const response = await axios.get('https://apitentacion.onrender.com/productos'); 

        if (response.status === 200) {
            const productos = response.data;
            mostrarProductos(productos); // Mostrar todos los productos inicialmente
            configurarBusqueda(productos); // Configurar la búsqueda
        } else {
            console.error('Error al obtener productos:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Función para renderizar productos en la tabla
function mostrarProductos(productos) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombreProducto}</td>
            <td>${producto.cantidadStock}</td>
            <td>${producto.precioFinal}</td>
            <td>
                <button class="editar-btn" data-id="${producto._id}">Editar</button>
                <button class="eliminar-btn" data-id="${producto._id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Agregar eventos a los botones "Editar"
    document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const productoId = event.target.getAttribute('data-id');
            redirigirAEditarProducto(productoId);
        });
    });

    // Agregar evento a los botones "Eliminar"
    document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const productoId = event.target.getAttribute('data-id');
            confirmarEliminarProducto(productoId);
        });
    });
}

// Función para redirigir a la página de edición
function redirigirAEditarProducto(productoId) {
    window.location.href = `editarProducto.html?id=${productoId}`;
}

// Función para confirmar la eliminación del producto
function confirmarEliminarProducto(productoId) {
    const confirmar = confirm("¿Seguro que quiere eliminar el producto? Esta acción no se puede deshacer.");

    if (confirmar) {
        eliminarProducto(productoId);
    }
}

// Función para eliminar el producto
async function eliminarProducto(productoId) {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.delete(`https://apitentacion.onrender.com/productos/${productoId}`, config);

        if (response.status === 200) {
            // Mostrar el mensaje de éxito
            alert('Producto eliminado con éxito.');
            // Recargar los productos después de la eliminación
            obtenerProductos();
        } else {
            console.error('Error al eliminar el producto:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de eliminación:', error);
    }
}

// Configurar la búsqueda
function configurarBusqueda(productos) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir recarga de la página

        const query = inputBuscar.value.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
        const productosFiltrados = productos.filter(producto =>
            producto.nombreProducto.toLowerCase().includes(query)
        );

        mostrarProductos(productosFiltrados); // Mostrar solo los productos que coincidan
    });

    // Opcional: Agregar búsqueda en tiempo real
    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const productosFiltrados = productos.filter(producto =>
            producto.nombreProducto.toLowerCase().includes(query)
        );

        mostrarProductos(productosFiltrados); // Mostrar productos filtrados mientras se escribe
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);
