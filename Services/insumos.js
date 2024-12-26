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

// Función para obtener todos los insumos
async function obtenerInsumos() {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get('http://localhost:3003/insumos', config);

        if (response.status === 200) {
            const insumos = response.data;
            mostrarInsumos(insumos); // Mostrar todos los insumos inicialmente
            configurarBusqueda(insumos); // Configurar la búsqueda
        } else {
            console.error('Error al obtener insumos:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener insumos:', error);
    }
}

// Función para renderizar insumos en la tabla
function mostrarInsumos(insumos) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    insumos.forEach(insumo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${insumo.nombre}</td>
            <td>${insumo.cantidadNeta}</td>
            <td>${insumo.precioNeto}</td>
            <td>
                <button class="editar-btn" data-id="${insumo._id}">Editar</button>
                <button class="eliminar-btn" data-id="${insumo._id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Agregar eventos a los botones "Editar"
    document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const insumoId = event.target.getAttribute('data-id');
            redirigirAEditarInsumo(insumoId);
        });
    });

    // Agregar evento a los botones "Eliminar"
    document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const insumoId = event.target.getAttribute('data-id');
            confirmarEliminarInsumo(insumoId);
        });
    });
}

// Función para redirigir a la página de edición
function redirigirAEditarInsumo(insumoId) {
    window.location.href = `editarInsumo.html?id=${insumoId}`;
}

// Función para confirmar la eliminación del insumo
function confirmarEliminarInsumo(insumoId) {
    const confirmar = confirm("¿Seguro que quiere eliminar el insumo? Esta acción no se puede deshacer.");

    if (confirmar) {
        eliminarInsumo(insumoId);
    }
}

// Función para eliminar el insumo
async function eliminarInsumo(insumoId) {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.delete(`http://localhost:3003/insumos/${insumoId}`, config);

        if (response.status === 200) {
            alert('Insumo eliminado con éxito.');
            obtenerInsumos(); // Recargar los insumos después de la eliminación
        } else {
            console.error('Error al eliminar el insumo:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de eliminación:', error);
    }
}

// Configurar la búsqueda
function configurarBusqueda(insumos) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = inputBuscar.value.toLowerCase();
        const insumosFiltrados = insumos.filter(insumo =>
            insumo.nombre.toLowerCase().includes(query)
        );

        mostrarInsumos(insumosFiltrados);
    });

    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const insumosFiltrados = insumos.filter(insumo =>
            insumo.nombre.toLowerCase().includes(query)
        );

        mostrarInsumos(insumosFiltrados);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerInsumos);
