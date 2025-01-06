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

// Función para enviar un POST al endpoint y crear una nueva categoría
async function crearCategoria(categoria) {
    try {
        const token = getToken(); // Obtener el token desde localStorage
        if (!token) return; // Si no hay token, no continuar

        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar token al header
            },
        };

        const response = await axios.post('https://apitentacion.onrender.com/categoriasProducto', categoria, config);

        if (response.status === 201) {
            alert('¡Categoría creada con éxito!');
            window.location.href = '/HTML/categorias_productos/categorias_productos.html'; // Redirigir a la página de categorías
        } else {
            console.error('Error al crear la categoría:', response.status);
            alert('Hubo un problema al crear la categoría. Inténtalo nuevamente.');
        }
    } catch (error) {
        console.error('Error al hacer la solicitud de creación:', error);
        alert('Hubo un error inesperado. Verifica los datos e inténtalo nuevamente.');
    }
}

// Función para manejar el envío del formulario
function manejarEnvioFormulario(event) {
    event.preventDefault(); // Prevenir la recarga de la página

    // Obtener los valores de los campos del formulario
    const nombreCategoria = document.getElementById('nombreCategoria').value.trim();
    const descripcionCategoria = document.getElementById('descripcion').value.trim();

    // Validar que los campos no estén vacíos
    if (!nombreCategoria || !descripcionCategoria) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear el objeto de categoría
    const nuevaCategoria = {
        nombreCategoria,
        descripcionCategoria,
    };

    // Llamar a la función para crear la categoría
    crearCategoria(nuevaCategoria);
}

// Asignar el evento al formulario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-agregar-categoria');
    formulario.addEventListener('submit', manejarEnvioFormulario);
});
