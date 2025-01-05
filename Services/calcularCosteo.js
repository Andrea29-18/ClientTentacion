// Cargar insumos y manejadores
let insumos = [];
async function cargarInsumos() { /* Sin cambios */ }

// Mostrar sugerencias al usuario
function mostrarSugerencias(input, sugerenciasContainer) { /* Sin cambios */ }

// Validar insumo seleccionado
function validarInsumo(input) { /* Sin cambios */ }

// Agregar insumos dinámicamente
let insumoIndex = 0;
document.getElementById("add-insumo-btn").addEventListener("click", () => {
    const insumosContainer = document.getElementById("insumos-container");
    const insumoItem = document.createElement("div");
    insumoItem.classList.add("insumo-item");
    insumoItem.innerHTML = `
        <label>Nombre del Insumo:</label>
        <input type="text" class="insumo-nombre" placeholder="Nombre del Insumo" autocomplete="off" required>
        <div class="sugerencias-container"></div>
        <label>Cantidad Neta:</label>
        <input type="number" class="cantidad-neta" placeholder="Cantidad neta" min="0" step="0.01" required>
        <label>Precio Neto:</label>
        <input type="number" class="precio-neto" placeholder="Precio neto" min="0" step="0.01" required>
        <label>Cantidad Utilizada:</label>
        <input type="number" class="cantidad-utilizada" placeholder="Cantidad utilizada" min="0" step="0.01" required>
    `;

    const inputNombre = insumoItem.querySelector(".insumo-nombre");
    const sugerenciasContainer = insumoItem.querySelector(".sugerencias-container");
    inputNombre.addEventListener("input", () => mostrarSugerencias(inputNombre, sugerenciasContainer));
    insumosContainer.appendChild(insumoItem);
    insumoIndex++;
});

// Manejar envío del formulario
document.getElementById("costeo-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const insumosUtilizados = [];
        let totalGastado = 0;
        let totalUtilizado = 0;

        Array.from(document.querySelectorAll(".insumo-item")).forEach(item => {
            const inputNombre = item.querySelector(".insumo-nombre");
            const cantidadNeta = parseFloat(item.querySelector(".cantidad-neta").value);
            const precioNeto = parseFloat(item.querySelector(".precio-neto").value);
            const cantidadUtilizada = parseFloat(item.querySelector(".cantidad-utilizada").value);

            validarInsumo(inputNombre);

            if (!cantidadNeta || !precioNeto || cantidadNeta <= 0 || precioNeto <= 0 || cantidadUtilizada <= 0) {
                alert("Por favor, verifica todos los campos de insumos.");
                throw new Error("Datos inválidos en insumo");
            }

            const precioPorUnidad = precioNeto / cantidadNeta;
            const costoUtilizado = precioPorUnidad * cantidadUtilizada;

            insumosUtilizados.push({
                insumoId: inputNombre.dataset.insumoId,
                cantidadUtilizada,
            });

            totalGastado += precioNeto;
            totalUtilizado += costoUtilizado;
        });

        const gananciaMultiplicador = parseFloat(document.getElementById("ganancia-multiplicador").value);
        const precioFinal = totalUtilizado * gananciaMultiplicador;

        document.getElementById("costo-gasto").textContent = `Total Gastado: $${totalGastado.toFixed(2)}`;
        document.getElementById("costo-utilizado").textContent = `Total Utilizado: $${totalUtilizado.toFixed(2)}`;
        document.getElementById("precio-final").textContent = `Precio Final: $${precioFinal.toFixed(2)}`;
    } catch (error) {
        console.error("Error al calcular el costeo:", error);
        alert("No se pudo calcular el costeo. Revisa los datos ingresados.");
    }
});

// Cargar los insumos al inicio
cargarInsumos();
