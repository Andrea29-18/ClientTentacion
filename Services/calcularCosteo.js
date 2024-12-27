const form = document.getElementById("costeo-form");
const insumosContainer = document.getElementById("insumos-container");
const costoTotalElement = document.getElementById("costo-total");
const addInsumoBtn = document.getElementById("add-insumo-btn");

let insumoIndex = 1;

// Evento para agregar un nuevo insumo
addInsumoBtn.addEventListener("click", () => {
    const newInsumo = document.createElement("div");
    newInsumo.classList.add("insumo-item");
    newInsumo.innerHTML = `
        <label for="insumo-id-${insumoIndex}">ID del Insumo:</label>
        <input type="text" id="insumo-id-${insumoIndex}" name="insumoId" placeholder="ID del Insumo" required>
        <label for="cantidad-${insumoIndex}">Cantidad Utilizada:</label>
        <input type="number" id="cantidad-${insumoIndex}" name="cantidadUtilizada" placeholder="Cantidad" required>
    `;
    insumosContainer.appendChild(newInsumo);
    insumoIndex++;
});

// Evento para enviar el formulario y calcular el costeo
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Recopilar datos del formulario
    const insumosUtilizados = Array.from(insumosContainer.querySelectorAll(".insumo-item")).map(item => {
        const insumoId = item.querySelector("input[name='insumoId']").value;
        const cantidadUtilizada = parseFloat(item.querySelector("input[name='cantidadUtilizada']").value);
        return { insumoId, cantidadUtilizada };
    });

    try {
        const response = await fetch("http://localhost:3000/insumos/costeo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer <TU_TOKEN>` // Reemplaza <TU_TOKEN> con tu token real
            },
            body: JSON.stringify({ insumosUtilizados })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! Status: ${response.status}`);
        }

        const { costoTotal } = await response.json();
        costoTotalElement.textContent = `Costo Total: $${costoTotal.toFixed(2)}`;
    } catch (error) {
        console.error("Error al calcular el costeo:", error);
        costoTotalElement.textContent = `Error: ${error.message}`;
    }
});
