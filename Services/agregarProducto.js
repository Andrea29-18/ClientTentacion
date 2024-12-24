async function cargarCategoriasProducto() {
    try {
        // Realiza la solicitud para obtener las categorías de producto
        const response = await axios.get('http://localhost:3003/categoriasProducto');

        // Verifica que la solicitud fue exitosa
        if (response.status === 200) {
            const categorias = response.data;

            // Llama a la función para cargar las opciones en el select
            cargarOpciones('nombreCategoria', categorias, 'nombreCategoria');
        } else {
            console.error('Error al cargar categorías de producto:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar categorías de producto:', error);
    }
}

// Función para cargar opciones en un select específico
function cargarOpciones(selectId, datos, propiedad) {
    const select = document.getElementById(selectId);

    if (select) {
        // Limpia las opciones actuales
        select.innerHTML = '';

        // Crea una opción por cada elemento en los datos
        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item[propiedad]; // Usamos 'nombreCategoria' como valor
            option.textContent = item[propiedad]; // Mostrar 'nombreCategoria' como texto
            select.appendChild(option);
        });
    } else {
        console.error(`No se encontró el elemento select con ID: ${selectId}`);
    }
}

// Llama a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasProducto();
});
