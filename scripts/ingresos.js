// Número de registros por página
const registrosPorPagina = 5;

let paginaActual = 1;

function obtenerPagina(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return getIngresos().slice(inicio, fin);
}

// Función para renderizar los ingresos en la tabla
function renderIngresos(pagina = 1) {
    const ingresosPagina = obtenerPagina(pagina);
    const ingresosBody = document.getElementById('cuerpoTablaIngresos');

    ingresosBody.innerHTML = '';

    ingresosBody.innerHTML = ingresosPagina.map(ingreso => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${ingreso.fecha}</td>
            <td>${categorias.find(cat => cat.id === ingreso.categoria)?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${ingreso.monto.toFixed(2)}</td>
            <td>${ingreso.descripcion}</td>
            <td>${ingreso.frecuencia}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor: pointer;"></i></td>
        </tr>
    `).join('');
}

// Función para renderizar los botones de paginación
function renderPaginacion(regIngresos = getIngresos()) {
    const totalPaginas = Math.ceil(regIngresos.length / registrosPorPagina);
    //console.log(`Total de páginas: ${totalPaginas}`);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    // Crear el botón "anterior"
    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    // Crear los botones de las páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        if (i === paginaActual) {
            paginaItem.classList.add('page-item', 'active');
        }
        else {
            paginaItem.classList.add('page-item');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    // Crear el botón "siguiente"
    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

//Función para ir a la página seleccionada
function irPagina(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderIngresos(paginaActual);
    renderPaginacion();
}

// Inicializar la paginación
renderIngresos(paginaActual);
renderPaginacion();


