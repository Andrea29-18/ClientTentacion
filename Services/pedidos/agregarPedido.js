document.addEventListener('DOMContentLoaded', async () => {
    console.log("Evento DOMContentLoaded disparado.");

    // Elementos del DOM
    const clienteSelect = document.getElementById('cliente-select');
    const productoSelect = document.getElementById('producto-select');
    const precioTotalEl = document.querySelector('#pedido-form p'); // Selección más específica
    const pedidoForm = document.getElementById('pedido-form');

    if (!clienteSelect || !productoSelect || !precioTotalEl || !pedidoForm) {
        console.error('No se encontraron los elementos del formulario.');
        return;
    }

    let productosData = [];

    const obtenerToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No se encontró un token válido. Por favor, inicia sesión.');
            window.location.href = '/login.html';
            return null;
        }
        return token;
    };

    const cargarClientesYProductos = async () => {
        const token = obtenerToken();
        if (!token) return;

        try {
            const [clientesResponse, productosResponse] = await Promise.all([
                axios.get('https://apitentacion.onrender.com/clientes', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('https://apitentacion.onrender.com/productos', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const clientes = clientesResponse.data;
            productosData = productosResponse.data;

            clientes.forEach(cliente => {
                clienteSelect.insertAdjacentHTML(
                    'beforeend',
                    `<option value="${cliente._id}">${cliente.nombre} ${cliente.apellidos}</option>`
                );
            });

            productosData.forEach(producto => {
                productoSelect.insertAdjacentHTML(
                    'beforeend',
                    `<option value="${producto._id}">${producto.nombreProducto} - $${producto.precioFinal}</option>`
                );
            });
        } catch (error) {
            console.error('Error al cargar clientes y productos:', error.response ? error.response.data : error.message);
            alert('Error al cargar clientes y productos. Intenta nuevamente.');
        }
    };

    const actualizarPrecioTotal = () => {
        const seleccionados = Array.from(productoSelect.selectedOptions);
        const total = seleccionados.reduce((sum, option) => {
            const producto = productosData.find(p => p._id === option.value);
            return sum + (producto ? producto.precioFinal : 0);
        }, 0);
        precioTotalEl.textContent = `Precio Total: $${total.toFixed(2)}`;
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();

        const token = obtenerToken();
        if (!token) return;

        const clienteId = clienteSelect.value;
        const productosIds = Array.from(productoSelect.selectedOptions).map(option => option.value);

        if (!clienteId || productosIds.length === 0) {
            alert('Debe seleccionar un cliente y al menos un producto.');
            return;
        }

        // Estructura del pedido según la API
        const nuevoPedido = {
            cliente: [clienteId], // Enviar como un array con un único ID
            productos: productosIds,
            precioTotal: parseFloat(precioTotalEl.textContent.replace('Precio Total: $', '')),
        };

        console.log('Datos enviados al servidor:', nuevoPedido);

        try {
            const respuesta = await axios.post('https://apitentacion.onrender.com/pedidos', nuevoPedido, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Respuesta del servidor:', respuesta.data);
            alert('Pedido creado con éxito.');
            pedidoForm.reset();
            precioTotalEl.textContent = 'Precio Total: $0';
        } catch (error) {
            console.error('Error al crear el pedido:', error.response ? error.response.data : error.message);
            const mensajeError = error.response?.data?.message || 'Ocurrió un error al crear el pedido. Intenta nuevamente.';
            alert(mensajeError);
        }
    };

    productoSelect.addEventListener('change', actualizarPrecioTotal);
    pedidoForm.addEventListener('submit', enviarFormulario);

    await cargarClientesYProductos();
});
