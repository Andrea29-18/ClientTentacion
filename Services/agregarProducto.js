import CONFIG from './config.js'; // Asegúrate de que este archivo esté correctamente configurado y exportado

async function agregarProducto(e) {
    e.preventDefault(); // Evitar que el formulario se envíe de manera tradicional

    const token = CONFIG.TOKEN;  // Obtener el token desde el archivo config.js
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
            'Content-Type': 'application/json', // Asegurarse de que se envíe como JSON
        },
    };

    const nombreProducto = document.getElementById('nombreProducto').value;
    const cantidadStock = document.getElementById('cantidadStock').value;
    const precioFinal = document.getElementById('precioFinal').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const catalogoProducto = document.getElementById('nombreCategoria').value; // Ahora se usa ObjectId
    const nombreInsumo = Array.from(document.getElementById('nombreInsumo').selectedOptions)
        .map(option => option.value); // Obtener todos los insumos seleccionados

    // Crear el objeto para enviar al backend
    const producto = {
        nombreProducto,
        cantidadStock,
        precioFinal,
        fechaVencimiento,
        catalogoProducto,  // Enviar el ObjectId de la categoría
        insumos: nombreInsumo,  // Array de ObjectIds de los insumos seleccionados
    };

    try {
        const response = await axios.post('http://localhost:3003/productos', producto, config);

        if (response.status === 201) {
            console.log('Producto agregado correctamente:', response.data);
            // Mostrar alerta al usuario
            alert('Producto creado exitosamente!');
            // Aquí puedes agregar alguna lógica para limpiar el formulario, si es necesario
        } else {
            console.error('Error al agregar producto:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
}

// Asegúrate de que el formulario sea capturado correctamente
document.getElementById('form-agregar').addEventListener('submit', agregarProducto);

// Cargar las categorías e insumos en el formulario
async function cargarCategoriasEInsumos() {
    try {
        const token = CONFIG.TOKEN;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const [categoriasResponse, insumosResponse] = await Promise.all([  // Obtener categorías e insumos
            axios.get('http://localhost:3003/categoriasProducto', config),
            axios.get('http://localhost:3003/insumos', config),
        ]);

        if (categoriasResponse.status === 200 && insumosResponse.status === 200) {
            const categorias = categoriasResponse.data;
            const insumos = insumosResponse.data;

            cargarOpciones('nombreCategoria', categorias, '_id'); // Usar el _id de la categoría
            cargarOpciones('nombreInsumo', insumos, '_id'); // Usar el _id de los insumos
        } else {
            console.error('Error al cargar categorías o insumos:', categoriasResponse.status, insumosResponse.status);
        }
    } catch (error) {
        console.error('Error al cargar categorías e insumos:', error);
    }
}

function cargarOpciones(selectId, datos, propiedad) {
    const select = document.getElementById(selectId);

    if (select) {
        select.innerHTML = ''; // Limpiar las opciones anteriores

        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item[propiedad];  // Asignar el ObjectId en el valor
            option.textContent = item.nombreCategoria || item.nombre;  // Mostrar el nombre de la categoría o insumo
            select.appendChild(option);
        });
    } else {
        console.error(`No se encontró el elemento select con ID: ${selectId}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasEInsumos();
});
