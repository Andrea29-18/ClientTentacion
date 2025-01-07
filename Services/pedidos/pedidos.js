// Función para generar un nombre aleatorio
function generarNombreAleatorio() {
    const nombres = [
        "Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofía", "José", "Lucía",
        "Miguel", "Carmen", "Antonio", "Isabel", "Javier", "Marta", "Pablo", "Raquel", "Diego", "Laura",
        "Alejandro", "Paula", "Fernando", "Sara"
    ];
    const indiceAleatorio = Math.floor(Math.random() * nombres.length);
    return nombres[indiceAleatorio];
}

// Función para generar un apellido aleatorio
function generarApellidoAleatorio() {
    const apellidos = [
        "García", "Martínez", "Rodríguez", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores",
        "Rivera", "Gómez", "Morales", "Ortega", "Castillo", "Vargas", "Hernández", "Romero", "Navarro", "Delgado",
        "Cruz", "Mendoza", "Reyes", "Ramos"
    ];
    const indiceAleatorio = Math.floor(Math.random() * apellidos.length);
    return apellidos[indiceAleatorio];
}

// Función para generar un nombre completo aleatorio basado en el ID del pedido
function generarNombreCompletoPorId(id) {
    if (!id || typeof id !== "string" || id.length !== 24) {
        return 'Cliente desconocido'; // Retornar un valor por defecto si el ID es inválido
    }
    const nombreAleatorio = generarNombreAleatorio();
    const apellidoAleatorio = generarApellidoAleatorio();
    return `${nombreAleatorio} ${apellidoAleatorio}`;
}

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
        const API_URLS = {
            pedidos: 'https://apitentacion.onrender.com/pedidos',
            productos: 'https://apitentacion.onrender.com/productos',
            clientes: 'https://apitentacion.onrender.com/clientes'
        };

        const responses = await Promise.all(Object.values(API_URLS).map(url => axios.get(url, { headers: { Authorization: `Bearer ${token}` } })));

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
        const nombreCliente = generarNombreCompletoPorId(pedido._id);

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

        const eliminarBtn = card.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', () => eliminarPedido(pedido._id, obtenerToken()));

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
