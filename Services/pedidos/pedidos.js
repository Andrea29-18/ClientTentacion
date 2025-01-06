// Obtener el token desde localStorage
function obtenerToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('Token no encontrado en el localStorage.');
        alert('No se encontró un token válido. Por favor, inicia sesión.');
        window.location.href = '/login.html'; // Redirige al login si no hay token
        return null;
    }
    return token;
}

// Obtener datos desde los endpoints
async function obtenerPedidos() {
    const token = obtenerToken(); // Obtener el token desde localStorage
    if (!token) return; // Si no hay token, detener la ejecución

    try {
        const urls = [
            'https://apitentacion.onrender.com/pedidos',
            'https://apitentacion.onrender.com/productos',
            'https://apitentacion.onrender.com/clientes'
        ];

        const responses = await Promise.all(urls.map(url => axios.get(url, { headers: { Authorization: `Bearer ${token}` } })));

        const [pedidos, productos, clientes] = responses.map(response => response.data);

        mostrarPedidos(pedidos, productos, clientes);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        alert('Error al obtener los datos. Por favor, revisa tu conexión o inicia sesión nuevamente.');
    }
}

// Mostrar pedidos en el contenedor
function mostrarPedidos(pedidos, productos, clientes) {
    const container = document.getElementById('pedidos-container');
    container.innerHTML = ''; // Limpiar el contenedor

    pedidos.forEach((pedido) => {
        const clienteData = Array.isArray(pedido.Cliente) && pedido.Cliente.length > 0 ? pedido.Cliente[0] : null;
        const cliente = clienteData ? clientes.find(c => c._id === clienteData._id) : null;
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente desconocido';

        const card = document.createElement('div');
        card.classList.add('pedido-card');

        card.innerHTML = `
            <h3>Pedido de: ${nombreCliente}</h3>
            <p>Precio Total: $${pedido.precioTotal}</p>
            <button class="toggle-detalles-btn">Ver Productos</button>
            <div class="pedido-detalles" style="display: none;">
                <h4>Productos:</h4>
                <div class="productos-lista"></div>
            </div>
            <div class="pedido-acciones">
                <button class="editar-btn" data-id="${pedido._id}">Editar</button>
                <button class="eliminar-btn" data-id="${pedido._id}">Eliminar</button>
            </div>
        `;

        const productosLista = card.querySelector('.productos-lista');
        pedido.productos.forEach(producto => {
            const productoNombre = producto ? producto.nombreProducto : 'Producto desconocido';
            const productoPrecio = producto ? `$${producto.precioFinal}` : 'Precio desconocido';

            const productoDiv = document.createElement('div');
            productoDiv.classList.add('productos-pedidos');
            productoDiv.textContent = `${productoNombre} - ${productoPrecio}`;
            productosLista.appendChild(productoDiv);
        });

        const toggleBtn = card.querySelector('.toggle-detalles-btn');
        const detallesDiv = card.querySelector('.pedido-detalles');
        toggleBtn.addEventListener('click', () => {
            const isVisible = detallesDiv.style.display === 'block';
            detallesDiv.style.display = isVisible ? 'none' : 'block';
            toggleBtn.textContent = isVisible ? 'Ver Productos' : 'Ocultar Productos';
        });

        const editarBtn = card.querySelector('.editar-btn');
        editarBtn.addEventListener('click', () => {
            window.location.href = `editarPedido.html?pedidoId=${pedido._id}`;
        });

        const eliminarBtn = card.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', () => eliminarPedido(pedido._id, token));

        container.appendChild(card);
    });
}

// Eliminar pedido
async function eliminarPedido(pedidoId, token) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este pedido?');
    if (!confirmacion) return;

    try {
        await axios.delete(`https://apitentacion.onrender.com/pedidos/${pedidoId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('Pedido eliminado con éxito.');
        obtenerPedidos(); // Recargar pedidos
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        alert('Ocurrió un error al intentar eliminar el pedido.');
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerPedidos);
