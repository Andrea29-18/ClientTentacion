// Función para obtener todos los productos
async function obtenerProductos() {
    try {
        const response = await axios.get('http://localhost:3003/productos');  // Sin paginación
        
        // Verificamos si la respuesta fue exitosa
        if (response.status === 200) {
            const productos = response.data;
            mostrarProductos(productos); // Función para mostrar los productos en la tabla
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
    tablaBody.innerHTML = ''; // Limpiamos la tabla antes de agregar nuevos productos

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
                <button class="actualizar-btn" data-id="${producto._id}">Actualizar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);
