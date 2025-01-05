document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sucursalId = urlParams.get('id'); // Obtener el ID de la sucursal desde la URL

    if (!sucursalId) {
        alert("No se proporcionó un ID válido para la sucursal.");
        return;
    }

    const token = getToken(); // Obtener el token desde el almacenamiento local
    if (!token) return;

    const form = document.getElementById('form-agregar-sucursal');
    const nombreInput = document.getElementById('nombreSucursal');
    const ubicacionSelect = document.getElementById('ubicacion');

    // Cargar datos de la sucursal
    try {
        const responseSucursal = await fetch(`https://apitentacion.onrender.com/sucursales/${sucursalId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!responseSucursal.ok) {
            console.error("Error al obtener la sucursal:", await responseSucursal.json());
            alert("No se pudo cargar la sucursal.");
            return;
        }

        const sucursal = await responseSucursal.json();
        nombreInput.value = sucursal.nombre || '';

        // Cargar ubicaciones dinámicas
        const responseUbicaciones = await fetch('https://apitentacion.onrender.com/ubicaciones', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!responseUbicaciones.ok) {
            console.error("Error al obtener ubicaciones:", await responseUbicaciones.json());
            alert("No se pudieron cargar las ubicaciones.");
            return;
        }

        const ubicaciones = await responseUbicaciones.json();
        ubicacionSelect.innerHTML = '<option value>Seleccionar ubicación</option>';
        ubicaciones.forEach(ubicacion => {
            const option = document.createElement('option');
            option.value = ubicacion._id;
            option.textContent = ubicacion.descripcion;
            if (sucursal.ubicacionId === ubicacion._id) {
                option.selected = true;
            }
            ubicacionSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al cargar los datos. Inténtalo de nuevo más tarde.");
    }

    // Enviar datos actualizados al servidor
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = nombreInput.value.trim();
        const ubicacionId = ubicacionSelect.value;

        if (!nombre || !ubicacionId) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch(`https://apitentacion.onrender.com/sucursales/${sucursalId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, ubicacionId }),
            });

            if (!response.ok) {
                console.error("Error al actualizar la sucursal:", await response.json());
                alert("No se pudo actualizar la sucursal.");
                return;
            }

            alert("Sucursal actualizada exitosamente.");
            window.location.href = '/HTML/sucursales/sucursales.html'; // Redirigir a la lista de sucursales
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Error al enviar los datos. Inténtalo de nuevo más tarde.");
        }
    });
});

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
