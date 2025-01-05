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

// Función para obtener información de una ubicación por ID
async function obtenerUbicacionPorId(ubicacionId) {
    if (!ubicacionId || typeof ubicacionId !== 'string') {
        console.error("El ID de la ubicación no es válido:", ubicacionId);
        return {
            descripcion: 'Sin descripción',
            longitud: 'N/A',
            latitud: 'N/A',
        };
    }

    try {
        const response = await axios.get(`https://apitentacion.onrender.com/ubicaciones/${ubicacionId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error de respuesta del servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No se recibió respuesta del servidor:", error.request);
        } else {
            console.error("Error al configurar la solicitud:", error.message);
        }
        return {
            descripcion: 'Sin descripción',
            longitud: 'N/A',
            latitud: 'N/A',
        };
    }
}

// Función para renderizar sucursales en la tabla
function mostrarSucursales(datos) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    datos.forEach(sucursal => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${sucursal.nombre}</td>
            <td>${sucursal.descripcion}</td>
            <td>${sucursal.longitud}</td>
            <td>${sucursal.latitud}</td>
            <td>
                <button class="editar-btn" data-id="${sucursal._id}">Editar</button>
                <button class="eliminar-btn" data-id="${sucursal._id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);

        // Agregar eventos para los botones de Editar y Eliminar
        const btnEdit = fila.querySelector('.editar-btn');
        const btnDelete = fila.querySelector('.eliminar-btn');

        btnEdit.addEventListener('click', () => {
            editarSucursal(sucursal._id);
        });

        btnDelete.addEventListener('click', () => {
            eliminarSucursal(sucursal._id);
        });
    });
}

// Configurar la búsqueda
function configurarBusqueda(datos) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir recarga de la página

        const query = inputBuscar.value.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
        const datosFiltrados = datos.filter(d =>
            d.nombre.toLowerCase().includes(query) ||
            d.descripcion.toLowerCase().includes(query)
        );

        mostrarSucursales(datosFiltrados);
    });

    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const datosFiltrados = datos.filter(d =>
            d.nombre.toLowerCase().includes(query) ||
            d.descripcion.toLowerCase().includes(query)
        );

        mostrarSucursales(datosFiltrados);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = getToken();
        if (!token) return;

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        const responseSucursales = await axios.get('https://apitentacion.onrender.com/sucursales', config);
        const sucursales = responseSucursales.data;

        const datosCompletos = await Promise.all(
            sucursales.map(async (sucursal) => {
                const ubicacion = await obtenerUbicacionPorId(sucursal.ubicacion._id);
                return {
                    _id: sucursal._id,
                    nombre: sucursal.nombre,
                    ...ubicacion,
                };
            })
        );

        mostrarSucursales(datosCompletos);
        configurarBusqueda(datosCompletos);
    } catch (error) {
        console.error("Error al obtener sucursales o ubicaciones:", error);
    }
});
