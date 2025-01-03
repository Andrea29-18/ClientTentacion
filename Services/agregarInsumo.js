// Función para verificar si el token ha expirado
function verificarTokenValido() {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!token || !tokenExpiration) {
        console.error('Token no encontrado o expiración no definida.');
        return false;
    }

    if (Date.now() > tokenExpiration) {
        console.error('El token ha expirado.');
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/HTML/login.html'; // Redirigir al login si el token ha expirado
        return false;
    }

    return true;
}

// Función para agregar insumo
async function agregarInsumo(e) {
    e.preventDefault(); // Evitar envío tradicional del formulario

    if (!verificarTokenValido()) return; // Verificar si el token es válido antes de proceder

    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
            'Content-Type': 'application/json', // Asegurarse de que se envíe como JSON
        },
    };

    const nombreInsumo = document.getElementById('nombreInsumo').value;
    const cantidadNeta = document.getElementById('cantidadNeta').value;
    const precioNeto = document.getElementById('precioNeto').value;

    // Crear el objeto insumo
    const insumo = {
        nombre: nombreInsumo,
        cantidadNeta: parseFloat(cantidadNeta), // Convertir a número flotante
        precioNeto: parseFloat(precioNeto), // Convertir a número flotante
    };

    try {
        const response = await axios.post('https://apitentacion.onrender.com/insumos', insumo, config);

        if (response.status === 201) {
            console.log('Insumo agregado correctamente:', response.data);
            alert('¡Insumo creado exitosamente!');
            document.getElementById('form-agregar-insumo').reset(); // Limpiar el formulario
        } else {
            console.error('Error al agregar insumo:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
}

// Asegurarse de capturar el formulario y agregar el evento de envío
document.getElementById('form-agregar-insumo').addEventListener('submit', agregarInsumo);
