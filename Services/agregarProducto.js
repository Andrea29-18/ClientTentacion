// Importar configuración
import CONFIG from './config.js';

async function cargarCategoriasEInsumos() {
    try {
        const token = CONFIG.TOKEN; // Usar el token desde la configuración
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const [categoriasResponse, insumosResponse] = await Promise.all([
            axios.get('http://localhost:3003/categoriasProducto', config),
            axios.get('http://localhost:3003/insumos', config),
        ]);

        if (categoriasResponse.status === 200 && insumosResponse.status === 200) {
            const categorias = categoriasResponse.data;
            const insumos = insumosResponse.data;

            // Cargar categorías
            cargarOpciones('nombreCategoria', categorias, 'nombreCategoria');

            // Cargar insumos
            cargarOpciones('nombreInsumo', insumos, 'nombre');
        } else {
            console.error(
                'Error al cargar categorías o insumos:',
                categoriasResponse.status,
                insumosResponse.status
            );
        }
    } catch (error) {
        console.error('Error al cargar categorías e insumos:', error);
    }
}

function cargarOpciones(selectId, datos, propiedad) {
    const select = document.getElementById(selectId);

    if (select) {
        select.innerHTML = '';

        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item[propiedad];
            option.textContent = item[propiedad];
            select.appendChild(option);
        });
    } else {
        console.error(`No se encontró el elemento select con ID: ${selectId}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasEInsumos();
});
