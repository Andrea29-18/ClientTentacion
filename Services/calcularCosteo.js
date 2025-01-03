// Obtener todos los insumos al cargar la página
let insumos = [];

async function cargarInsumos() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No estás autenticado. Inicia sesión primero.");
        return;
    }

    try {
        const response = await axios.get("https://apitentacion.onrender.com/insumos", {
            headers: { "Authorization": `Bearer ${token}` },
        });
        insumos = response.data;
    } catch (error) {
        console.error("Error al cargar insumos:", error);
        alert("No se pudieron cargar los insumos.");
    }
}

// Mostrar sugerencias al usuario
function mostrarSugerencias(input, sugerenciasContainer) {
    const query = input.value.toLowerCase().trim();
    const sugerencias = insumos.filter(insumo =>
        insumo.nombre.toLowerCase().includes(query)
    );

    sugerenciasContainer.innerHTML = "";

    sugerencias.forEach(insumo => {
        const opcion = document.createElement("div");
        opcion.textContent = insumo.nombre;
        opcion.classList.add("sugerencia");
        opcion.addEventListener("click", () => {
            input.value = insumo.nombre;
            input.dataset.insumoId = insumo._id;
            sugerenciasContainer.innerHTML = "";
        });
        sugerenciasContainer.appendChild(opcion);
    });
}

// Validar que el insumo tenga un ID asociado
function validarInsumo(input) {
    if (!input.dataset.insumoId || input.dataset.insumoId === "") {
        alert(`Debes seleccionar un insumo válido de las sugerencias para "${input.value}".`);
        throw new Error(`ID de insumo no válido para "${input.value}"`);
    }
}

// Agregar dinámicamente un nuevo insumo
let insumoIndex = 0;
document.getElementById("add-insumo-btn").addEventListener("click", () => {
    const insumosContainer = document.getElementById("insumos-container");

    const insumoItem = document.createElement("div");
    insumoItem.classList.add("insumo-item");
    insumoItem.innerHTML = `
        <label>Nombre del Insumo:</label>
        <input type="text" class="insumo-nombre" placeholder="Nombre del Insumo" autocomplete="off" required>
        <div class="sugerencias-container"></div>
        <label>Cantidad:</label>
        <input type="number" class="cantidad-utilizada" placeholder="Cantidad utilizada" min="0" step="0.01" required>
    `;

    const inputNombre = insumoItem.querySelector(".insumo-nombre");
    const sugerenciasContainer = insumoItem.querySelector(".sugerencias-container");

    inputNombre.addEventListener("input", () => mostrarSugerencias(inputNombre, sugerenciasContainer));

    insumosContainer.appendChild(insumoItem);
    insumoIndex++;
});

// Manejar el envío del formulario para calcular el costeo
document.getElementById("costeo-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const insumosUtilizados = Array.from(document.querySelectorAll(".insumo-item")).map(item => {
            const inputNombre = item.querySelector(".insumo-nombre");
            const cantidadUtilizada = parseFloat(item.querySelector(".cantidad-utilizada").value);

            validarInsumo(inputNombre);

            if (!cantidadUtilizada || cantidadUtilizada <= 0) {
                alert(`La cantidad utilizada para "${inputNombre.value}" debe ser mayor a 0.`);
                throw new Error(`Cantidad no válida para "${inputNombre.value}"`);
            }

            return {
                insumoId: inputNombre.dataset.insumoId,
                cantidadUtilizada,
            };
        });

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión primero.");
            return;
        }

        const response = await axios.post("https://apitentacion.onrender.com/insumos/costeo", {
            insumosUtilizados,
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const { costoTotal } = response.data;
        document.getElementById("costo-total").textContent = `Costo Total: $${costoTotal.toFixed(2)}`;
    } catch (error) {
        console.error("Error al calcular el costeo:", error);
        alert("No se pudo calcular el costeo. Verifica los insumos ingresados.");
    }
});

// Cargar los insumos al inicio
cargarInsumos();
