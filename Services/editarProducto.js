import CONFIG from './config.js'; // Si tienes configuraciones importadas

// Función para obtener el valor de un parámetro en la URL
function obtenerParametroURL(nombreParametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombreParametro); // Devuelve el valor del parámetro, o null si no existe
}

// Función para cargar las categorías e insumos
async function cargarCategoriasEInsumos() {
    try {
        const token = CONFIG.TOKEN;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const [categoriasResponse, insumosResponse] = await Promise.all([  
            axios.get('http://localhost:3003/categoriasProducto', config),
            axios.get('http://localhost:3003/insumos', config),
        ]);

        if (categoriasResponse.status === 200 && insumosResponse.status === 200) {
            const categorias = categoriasResponse.data;
            const insumos = insumosResponse.data;

            cargarOpciones('nombreCategoria', categorias, '_id'); // Cargar las opciones de categorías usando el _id
            cargarOpciones('nombreInsumo', insumos, '_id'); // Cargar las opciones de insumos usando el _id
        } else {
            console.error('Error al cargar categorías o insumos:', categoriasResponse.status, insumosResponse.status);
        }
    } catch (error) {
        console.error('Error al cargar categorías e insumos:', error);
    }
}

// Función para cargar las opciones en los select
function cargarOpciones(selectId, datos, propiedad) {
    const select = document.getElementById(selectId);

    if (select) {
        select.innerHTML = ''; // Limpiar las opciones anteriores

        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item[propiedad]; // Usar el _id (ObjectId)
            option.textContent = item.nombreCategoria || item.nombre; // Mostrar el nombre de la categoría o insumo
            select.appendChild(option);
        });
    } else {
        console.error(`No se encontró el elemento select con ID: ${selectId}`);
    }
}

// Función para cargar el producto a editar
async function cargarProductoParaEditar() {
    const productoId = obtenerParametroURL('id'); // Obtener el ID del producto desde la URL

    if (!productoId) {
        console.error('No se proporcionó el ID del producto');
        alert('No se encontró el producto a editar.');
        return;
    }

    try {
        const token = CONFIG.TOKEN;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Obtener los datos del producto
        const response = await axios.get(`http://localhost:3003/productos/${productoId}`, config);

        if (response.status === 200) {
            const producto = response.data;
            // Rellenar el formulario con los datos del producto
            document.getElementById('nombreProducto').value = producto.nombreProducto;
            document.getElementById('cantidadStock').value = producto.cantidadStock;
            document.getElementById('precioFinal').value = producto.precioFinal;
            document.getElementById('fechaVencimiento').value = producto.fechaVencimiento.split('T')[0]; // Convertir la fecha

            // Configurar el campo de categoría (catalogoProducto) con el ObjectId
            document.getElementById('nombreCategoria').value = producto.catalogoProducto;

            // Configurar los insumos (nombreInsumo) como múltiple selección
            const insumos = producto.insumos;
            const insumoSelect = document.getElementById('nombreInsumo');
            Array.from(insumoSelect.options).forEach(option => {
                if (insumos.includes(option.value)) {
                    option.selected = true; // Marcar como seleccionado
                }
            });
        } else {
            console.error('Error al obtener el producto:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar el producto para editar:', error);
    }
}

// Función para editar el producto
async function editarProducto(e) {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    const productoId = obtenerParametroURL('id'); // Obtener el ID del producto desde la URL

    if (!productoId) {
        console.error('No se encontró el ID del producto para editar');
        return;
    }

    // Obtener los valores del formulario
    const nombreProducto = document.getElementById('nombreProducto').value;
    const cantidadStock = document.getElementById('cantidadStock').value;
    const precioFinal = document.getElementById('precioFinal').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;

    // Obtener el ObjectId de la categoría seleccionada
    const catalogoProducto = document.getElementById('nombreCategoria').value; // ID de la categoría seleccionada

    // Obtener los ObjectIds de los insumos seleccionados
    const nombreInsumo = Array.from(document.getElementById('nombreInsumo').selectedOptions)
        .map(option => option.value); // Array de ObjectIds de los insumos seleccionados

    // Crear el objeto con los datos actualizados
    const productoActualizado = {
        nombreProducto,
        cantidadStock,
        precioFinal,
        fechaVencimiento,
        insumos: nombreInsumo, // Array de ObjectIds de los insumos
        catalogoProducto, // ObjectId de la categoría seleccionada
    };

    try {
        const token = CONFIG.TOKEN; // Obtener el token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // Realizar la solicitud PUT para actualizar el producto
        const response = await axios.put(`http://localhost:3003/productos/${productoId}`, productoActualizado, config);

        if (response.status === 200) {
            console.log('Producto actualizado correctamente:', response.data);
            alert('Producto actualizado correctamente!');
            // Redirigir o hacer algo después de la actualización, como volver a la lista de productos
            window.location.href = '/HTML/productos.html'; // Cambia la URL a la que desees redirigir
        } else {
            console.error('Error al actualizar el producto:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de actualización:', error);
    }
}

// Cargar categorías e insumos, luego cargar el producto
document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategoriasEInsumos(); // Asegúrate de que esta función esté definida
    await cargarProductoParaEditar(); // Llamar a la función para cargar el producto a editar

    // Verificar si el formulario existe antes de agregar el event listener
    const formEditar = document.getElementById('form-agregar');
    if (formEditar) {
        formEditar.addEventListener('submit', editarProducto);
    } else {
        console.error('Formulario no encontrado');
    }
});
