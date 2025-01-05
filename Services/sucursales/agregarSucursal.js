document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-agregar-sucursal');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            return;
        }

        const nombreSucursal = document.getElementById('nombreSucursal').value;
        const ubicacion = document.getElementById('ubicacion').value;

        try {
            const response = await axios.post(
                'https://apitentacion.onrender.com/sucursales',
                {
                    nombre: nombreSucursal,
                    ubicacion: ubicacion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
                    },
                }
            );

            if (response.status === 201) {
                alert('Sucursal agregada exitosamente.');
                form.reset();
            }
        } catch (error) {
            console.error('Error al agregar la sucursal:', error);
            alert('Error al agregar la sucursal. Por favor, intenta nuevamente.');
        }
    });

    // Cargar ubicaciones para el select
    try {
        const responseUbicaciones = await axios.get('https://apitentacion.onrender.com/ubicaciones');
        const ubicaciones = responseUbicaciones.data;

        const selectUbicacion = document.getElementById('ubicacion');
        ubicaciones.forEach(ubicacion => {
            const option = document.createElement('option');
            option.value = ubicacion._id;
            option.textContent = ubicacion.descripcion;
            selectUbicacion.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
    }
});
