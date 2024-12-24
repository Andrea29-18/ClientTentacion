// Función para obtener todos los productos
async function obtenerProductos() {
    try {
        const response = await axios.get('http://localhost:3003/productos'); 

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
    const tablaBody = document.querySelector('#tabla-productos tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto._id}</td>
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
