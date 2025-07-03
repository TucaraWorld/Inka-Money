let filtrosGast = {
    fechaInicio: null,
    fechaFin: null,
    categoria: null
};

setFiltrosGastos(filtrosGast);

const registrosPorPagina = 5;
let paginaActual = 1;

function obtenerPaginaGastos(pagina, gastosFiltrados) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return gastosFiltrados.slice(inicio, fin);
}

function renderGastos(pagina = 1) {
    const filtrosGas = getFiltrosGastos();
    const gastosFiltrados = obtenerGastosFiltrados(filtrosGas);
    const gastosPagina = obtenerPaginaGastos(pagina, gastosFiltrados);
    const gastosBody = document.getElementById('cuerpoTablaGastos');

    gastosBody.innerHTML = '';

    // Verificar si hay registros después de aplicar los filtros
    if (gastosPagina.length === 0) {
        // Mostrar el mensaje de advertencia si no hay registros
        const warningMessage = document.getElementById('noRecordsWarning');
        warningMessage.style.display = 'block';
    } else {
        // Ocultar el mensaje de advertencia si hay registros
        const warningMessage = document.getElementById('noRecordsWarning');
        warningMessage.style.display = 'none';
    }

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

  // Función para obtener los ingresos filtrados por fecha y categoría
function obtenerGastosFiltrados(filtrosGas = {}) {
      const gastos = getGastos();
      // Filtrar por fecha

      //console.log("Filtros de gastos:", filtrosGas);

      if (filtrosGas.fechaInicio || filtrosGas.fechaFin) {
        //console.log("Filtrando por fecha:", filtrosGas.fechaInicio, filtrosGas.fechaFin);
          return gastos.filter(gasto => {
                const fecha = new Date(gasto.fecha.split('/').reverse().join('/'));
                //console.log("Fecha de gasto:", fecha);

                const fechaInicio = filtrosGas.fechaInicio ? new Date(filtrosGas.fechaInicio) : null;
                const fechaFin = filtrosGas.fechaFin ? new Date(filtrosGas.fechaFin) : null;

                //console.log("Fecha inicio:", filtrosGas.fechaInicio)
                //console.log("Fecha fin:", filtrosGas.fechaFin);
                
                let valido = true;
                if (fechaInicio && fecha < fechaInicio) valido = false;
                if (fechaFin && fecha > fechaFin) valido = false;
                return valido;
          });
      }

      // Filtrar por categoría
      if (filtrosGas.categoria) {
          return gastos.filter(gasto => gasto.categoria === parseInt(filtrosGas.categoria));
      }

      //console.log("Gastos sin filtro:", gastos);

      return gastos;
  }

function renderPaginacionGastos() {
    const filtrosGas = getFiltrosGastos();
    const gastosFiltrados = obtenerGastosFiltrados(filtrosGas);
    const totalPaginas = Math.ceil(gastosFiltrados.length / registrosPorPagina);
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

