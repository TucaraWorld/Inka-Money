const registrosPorPagina = 5;
let paginaActual = 1;

function obtenerPaginaGastos(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return getGastos().slice(inicio, fin);
}

function renderGastos(pagina = 1) {
    const gastosPagina = obtenerPaginaGastos(pagina);
    const gastosBody = document.getElementById('cuerpoTablaGastos');

    gastosBody.innerHTML = gastosPagina.map(gasto => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${gasto.fecha}</td>
            <td>${categorias.find(cat => cat.id === Number(gasto.categoria))?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${gasto.monto.toFixed(2)}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor:pointer"></i></td>
        </tr>
    `).join('');
}

function renderPaginacionGastos(regIngresos = getGastos()) {
    const totalPaginas = Math.ceil(regIngresos.length / registrosPorPagina);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${paginaActual - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        paginaItem.classList.add('page-item');
        if (i === paginaActual) {
            paginaItem.classList.add('page-item', 'active');
        }
        else {
            paginaItem.classList.add('page-item');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${paginaActual + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

function irPaginaGasto(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderGastos(paginaActual);
    renderPaginacionGastos();
}

renderGastos(paginaActual);
renderPaginacionGastos();

