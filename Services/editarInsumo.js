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

// Función para obtener el valor de un parámetro en la URL
function obtenerParametroURL(nombreParametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombreParametro); // Devuelve el valor del parámetro, o null si no existe
}

// Función para cargar el insumo a editar
async function cargarInsumoParaEditar() {
    const insumoId = obtenerParametroURL('id'); // Obtener el ID del insumo desde la URL

    if (!insumoId) {
        console.error('No se proporcionó el ID del insumo');
        alert('No se encontró el insumo a editar.');
        return;
    }

    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Obtener los datos del insumo
        const response = await axios.get(`http://localhost:3003/insumos/${insumoId}`, config);

        if (response.status === 200) {
            const insumo = response.data;
            // Rellenar el formulario con los datos del insumo
            document.getElementById('nombre').value = insumo.nombre;
            document.getElementById('cantidadNeta').value = insumo.cantidadNeta;
            document.getElementById('precioNeto').value = insumo.precioNeto;
        } else {
            console.error('Error al obtener el insumo:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar el insumo para editar:', error);
    }
}

// Función para editar el insumo
async function editarInsumo(e) {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    const insumoId = obtenerParametroURL('id'); // Obtener el ID del insumo desde la URL

    if (!insumoId) {
        console.error('No se encontró el ID del insumo para editar');
        return;
    }

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const cantidadNeta = document.getElementById('cantidadNeta').value;
    const precioNeto = document.getElementById('precioNeto').value;

    // Crear el objeto con los datos actualizados
    const insumoActualizado = {
        nombre,
        cantidadNeta,
        precioNeto
    };

    try {
        const token = getToken(); // Obtener el token
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // Realizar la solicitud PUT para actualizar el insumo
        const response = await axios.put(`http://localhost:3003/insumos/${insumoId}`, insumoActualizado, config);

        if (response.status === 200) {
            console.log('Insumo actualizado correctamente:', response.data);
            alert('Insumo actualizado correctamente!');
            // Redirigir o hacer algo después de la actualización, como volver a la lista de insumos
            window.location.href = '/HTML/insumos.html'; // Cambia la URL a la que desees redirigir
        } else {
            console.error('Error al actualizar el insumo:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de actualización:', error);
    }
}

// Cargar el insumo cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    await cargarInsumoParaEditar(); // Llamar a la función para cargar el insumo a editar

    // Verificar si el formulario existe antes de agregar el event listener
    const formEditar = document.getElementById('form-editar-insumo');
    if (formEditar) {
        formEditar.addEventListener('submit', editarInsumo);
    } else {
        console.error('Formulario no encontrado');
    }
});
