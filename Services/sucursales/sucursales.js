// Función para eliminar una sucursal
async function eliminarSucursal(id) {
    console.log("ID a eliminar:", id); // Log para depuración

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        console.error("Formato de ID no válido:", id);
        alert("El formato del ID no es válido.");
        return;
    }

    const token = getToken(); // Obtener el token
    if (!token) return; // Si no hay token, salimos de la función

    try {
        // Realizar la solicitud DELETE con el token en los encabezados
        const response = await fetch(`https://apitentacion.onrender.com/sucursales/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al eliminar la sucursal:", errorData);
            alert(`Error al eliminar la sucursal: ${errorData.message}`);
            return;
        }

        const data = await response.json();
        console.log("Sucursal eliminada:", data);
        alert('Sucursal eliminada exitosamente.');
        cargarSucursales(); // Recargar la lista de sucursales
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        alert('Error al realizar la solicitud. Inténtalo de nuevo más tarde.');
    }
}

// Función para verificar si el token ha expirado
function isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true;
    return Date.now() > parseInt(expiration, 10);
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
        const response = await fetch(`https://apitentacion.onrender.com/ubicaciones/${ubicacionId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        return {
            descripcion: 'Sin descripción',
            longitud: 'N/A',
            latitud: 'N/A',
        };
    }
}

// Función para mostrar las sucursales en la tabla
function mostrarSucursales(datos) {
    const tablaBody = document.querySelector('.tabla tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    datos.forEach(sucursal => {
        const sucursalId = sucursal._id.toString(); // Convertimos el ObjectId a string
        const ubicacionId = sucursal.ubicacionId?.toString() || 'N/A';

        if (!sucursalId) {
            console.error("ID de sucursal no válido:", sucursal);
            return;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${sucursal.nombre}</td>
            <td>${sucursal.ubicacionDescripcion}</td>
            <td>${sucursal.longitud}</td>
            <td>${sucursal.latitud}</td>
            <td>
                <button class="editar-btn" data-id="${sucursalId}">Editar</button>
                <button class="eliminar-btn" data-id="${sucursalId}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);

        const btnEdit = fila.querySelector('.editar-btn');
        const btnDelete = fila.querySelector('.eliminar-btn');

        // Redirigir a editarSucursal.html con el ID como parámetro en la URL
        btnEdit.addEventListener('click', () => {
            window.location.href = `/HTML/sucursales/editarSucursal.html?id=${sucursalId}`;
        });

        btnDelete.addEventListener('click', () => {
            console.log("Botón eliminar clicado, ID:", sucursalId); // Log para depuración
            eliminarSucursal(sucursalId);
        });
    });
}


// Función para cargar las sucursales y mostrarlas en la tabla
async function cargarSucursales() {
    try {
        const token = getToken();
        if (!token) return;

        const responseSucursales = await fetch('https://apitentacion.onrender.com/sucursales', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!responseSucursales.ok) {
            console.error("Error al obtener sucursales:", await responseSucursales.json());
            return;
        }

        const sucursales = await responseSucursales.json();

        const datosCompletos = await Promise.all(
            sucursales.map(async (sucursal) => {
                const ubicacion = await obtenerUbicacionPorId(sucursal.ubicacion?._id);
                return {
                    _id: sucursal._id,
                    ubicacionId: sucursal.ubicacion?._id,
                    nombre: sucursal.nombre,
                    descripcion: sucursal.descripcion,
                    ubicacionDescripcion: ubicacion.descripcion,
                    longitud: ubicacion.longitud,
                    latitud: ubicacion.latitud,
                };
            })
        );

        mostrarSucursales(datosCompletos);
        configurarBusqueda(datosCompletos);
    } catch (error) {
        console.error("Error al obtener sucursales o ubicaciones:", error);
    }
}
function configurarBusqueda(datos) {
    const formBuscar = document.getElementById('form-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    formBuscar.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = inputBuscar.value.toLowerCase();
        const datosFiltrados = datos.filter(d =>
            (d.nombre?.toLowerCase() || '').includes(query) ||
            (d.descripcion?.toLowerCase() || '').includes(query) ||
            (d.ubicacionDescripcion?.toLowerCase() || '').includes(query)
        );

        mostrarSucursales(datosFiltrados);
    });

    inputBuscar.addEventListener('input', () => {
        const query = inputBuscar.value.toLowerCase();
        const datosFiltrados = datos.filter(d =>
            (d.nombre?.toLowerCase() || '').includes(query) ||
            (d.descripcion?.toLowerCase() || '').includes(query) ||
            (d.ubicacionDescripcion?.toLowerCase() || '').includes(query)
        );

        mostrarSucursales(datosFiltrados);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarSucursales();
});
