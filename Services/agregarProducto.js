// Función para verificar si el token ha expirado
function verificarTokenValido() {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    // Verificar si el token o la fecha de expiración no están en el almacenamiento local
    if (!token || !tokenExpiration) {
        console.error('Token no encontrado o expiración no definida.');
        return false;
    }

    // Comprobar si el token ha expirado
    if (Date.now() > tokenExpiration) {
        console.error('El token ha expirado.');
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/HTML/login.html'; // Redirigir al login si el token ha expirado
        return false;
    }

    return true;
}

// Función para agregar producto
async function agregarProducto(e) {
    e.preventDefault(); // Evitar que el formulario se envíe de manera tradicional

    if (!verificarTokenValido()) return; // Verificar si el token es válido antes de hacer la solicitud

    const token = localStorage.getItem('token'); // Obtener el token desde localStorage
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
        const response = await axios.post('https://apitentacion.onrender.com/productos', producto, config);

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

// Función para cargar categorías e insumos
async function cargarCategoriasEInsumos() {
    if (!verificarTokenValido()) return; // Verificar si el token es válido antes de hacer la solicitud

    try {
        const token = localStorage.getItem('token'); // Obtener el token desde localStorage
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const [categoriasResponse, insumosResponse] = await Promise.all([  // Obtener categorías e insumos
            axios.get('https://apitentacion.onrender.com/categoriasProducto', config),
            axios.get('https://apitentacion.onrender.com/insumos', config),
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

// Función para cargar las opciones en los select
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

// Cargar las categorías e insumos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasEInsumos();
});
