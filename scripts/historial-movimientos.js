// Reemplazo total: historial de movimientos dinámico, filtros y paginación como gastos.js

let filtrosHistorial = {
    fechaInicio: null,
    fechaFin: null,
    categoria: null
};

setFiltrosGastos(filtrosHistorial); // Reutilizamos la lógica de filtros de gastos

const registrosPorPaginaHistorial = 5;
let paginaActualHistorial = 1;

function obtenerMovimientosCombinados() {
    const gastos = getGastos().map(g => ({
        ...g,
        tipo: 'gasto',
        signo: '-',
        color: 'text-danger'
    }));
    const ingresos = getIngresos().map(i => ({
        ...i,
        tipo: 'ingreso',
        signo: '+',
        color: 'text-success'
    }));
    // Unimos y ordenamos por fecha descendente, luego por id descendente
    const movimientos = [...gastos, ...ingresos];
    movimientos.sort((a, b) => {
        const fechaA = a.fecha.split('/').reverse().join('-');
        const fechaB = b.fecha.split('/').reverse().join('-');
        const fechaComparison = new Date(fechaB) - new Date(fechaA);
        if (fechaComparison === 0) {
            return b.id - a.id;
        }
        return fechaComparison;
    });
    return movimientos;
}

function obtenerMovimientosFiltrados(filtros = {}) {
    let movimientos = obtenerMovimientosCombinados();
    // Filtrar por fecha
    if (filtros.fechaInicio || filtros.fechaFin) {
        movimientos = movimientos.filter(mov => {
            const fecha = new Date(mov.fecha.split('/').reverse().join('/'));
            const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
            const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
            let valido = true;
            if (fechaInicio && fecha < fechaInicio) valido = false;
            if (fechaFin && fecha > fechaFin) valido = false;
            return valido;
        });
    }
    // Filtrar por categoría
    if (filtros.categoria) {
        movimientos = movimientos.filter(mov => mov.categoria === parseInt(filtros.categoria));
    }
    return movimientos;
}

function obtenerPaginaMovimientos(pagina, movimientosFiltrados) {
    const inicio = (pagina - 1) * registrosPorPaginaHistorial;
    const fin = pagina * registrosPorPaginaHistorial;
    return movimientosFiltrados.slice(inicio, fin);
}

function renderHistorial(pagina = 1) {
    const filtros = getFiltrosGastos();
    const movimientosFiltrados = obtenerMovimientosFiltrados(filtros);
    const movimientosPagina = obtenerPaginaMovimientos(pagina, movimientosFiltrados);
    const tbody = document.getElementById('cuerpoTablaGastos');
    tbody.innerHTML = '';
    // Mostrar advertencia si no hay registros
    const warning = document.getElementById('noRecordsWarning');
    if (movimientosPagina.length === 0) {
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }
    tbody.innerHTML = movimientosPagina.map(mov => `
        <tr>
            <td>${mov.fecha}</td>
            <td>${categorias.find(cat => cat.id === Number(mov.categoria))?.nombre ?? 'Sin categoría'}</td>
            <td class="${mov.color}">${mov.signo} S/. ${Number(mov.monto).toFixed(2)}</td>
        </tr>
    `).join('');
}

function renderPaginacionHistorial() {
    const filtros = getFiltrosGastos();
    const movimientosFiltrados = obtenerMovimientosFiltrados(filtros);
    const totalPaginas = Math.ceil(movimientosFiltrados.length / registrosPorPaginaHistorial);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';
    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPaginaHistorial(${paginaActualHistorial - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);
    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        paginaItem.classList.add('page-item');
        if (i === paginaActualHistorial) {
            paginaItem.classList.add('active');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPaginaHistorial(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }
    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPaginaHistorial(${paginaActualHistorial + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

window.irPaginaHistorial = function(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActualHistorial = pagina;
    renderHistorial(paginaActualHistorial);
    renderPaginacionHistorial();
};

// Filtros dinámicos (categoría y fechas)
document.addEventListener('DOMContentLoaded', function () {
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategorias');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');
  const categoriaFiltro = document.getElementById('categoriaFiltro');

  // Detectar si es móvil
  function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  if (esDispositivoMovil()) {
    // Usar input nativo tipo date en móviles
    filtroFechaInicio.type = 'date';
    filtroFechaFin.type = 'date';
    filtroFechaInicio.removeAttribute('readonly');
    filtroFechaFin.removeAttribute('readonly');
    filtroFechaInicio.placeholder = 'Fecha de inicio';
    filtroFechaFin.placeholder = 'Fecha de fin';

    // Agregar labels solo en móvil
    if (!document.getElementById('labelFechaInicio')) {
      const labelInicio = document.createElement('label');
      labelInicio.setAttribute('for', 'filtroFechaInicio');
      labelInicio.id = 'labelFechaInicio';
      labelInicio.textContent = 'Fecha de inicio:';
      filtroFechaInicio.parentNode.insertBefore(labelInicio, filtroFechaInicio);
    }
    if (!document.getElementById('labelFechaFin')) {
      const labelFin = document.createElement('label');
      labelFin.setAttribute('for', 'filtroFechaFin');
      labelFin.id = 'labelFechaFin';
      labelFin.textContent = 'Fecha de fin:';
      filtroFechaFin.parentNode.insertBefore(labelFin, filtroFechaFin);
    }
  } else {
    // Inicializar datepickers solo en desktop
    filtroFechaInicio.type = 'text';
    filtroFechaFin.type = 'text';
    filtroFechaInicio.setAttribute('readonly', true);
    filtroFechaFin.setAttribute('readonly', true);
    filtroFechaInicio.placeholder = 'Fecha de inicio';
    filtroFechaFin.placeholder = 'Fecha de fin';
    $(filtroFechaInicio).datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true
    });
    $(filtroFechaFin).datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true
    });
  }

  let prevStartDate = null;
  let prevEndDate = null;

  function updateFilterButtonText(startDate = null, endDate = null, categoriaId = '') {
    let filterTextFecha = 'Todas las fechas';
    if (startDate && endDate) {
      filterTextFecha = `Desde: ${formatDate(startDate)}  |  Hasta: ${formatDate(endDate)}`;
    } else if (startDate) {
      filterTextFecha = `Desde: ${formatDate(startDate)}`;
    } else if (endDate) {
      filterTextFecha = `Hasta: ${formatDate(endDate)}`;
    }
    tagFiltrarFechas.textContent = filterTextFecha;
    if (tagFiltrarFechas.textContent === 'Todas las fechas') {
      filtroFechaInicio.value = '';
      filtroFechaFin.value = '';
    }
    let filterTextCat = 'Todas las categorías';
    if (categoriaId && categoriaId !== '') {
      filterTextCat = "Categoría: " + categorias.find(cat => cat.id === parseInt(categoriaId)).nombre;
    }
    tagFiltrarCategorias.textContent = filterTextCat;
  }

  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  function filtroPorFecha(pagina = 1, startDate, endDate) {
    let filtrosHist = getFiltrosGastos();
    filtrosHist.fechaInicio = startDate;
    filtrosHist.fechaFin = endDate;
    filtrosHist.categoria = null;
    setFiltrosGastos(filtrosHist);
    renderHistorial(pagina);
    renderPaginacionHistorial();
  }

  function filtroPorCategoria(pagina = 1, categoriaId) {
    let filtrosHist = getFiltrosGastos();
    if (categoriaId === "") {
      filtrosHist.categoria = null;
    } else {
      filtrosHist.fechaInicio = null;
      filtrosHist.fechaFin = null;
      filtrosHist.categoria = categoriaId;
    }
    setFiltrosGastos(filtrosHist);
    renderHistorial(pagina);
    renderPaginacionHistorial();
  }

  function parseFechaInput(valor) {
    // Si es yyyy-mm-dd (input type date), lo convertimos a dd/mm/yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [y, m, d] = valor.split('-');
      return `${d}/${m}/${y}`;
    }
    // Si ya es dd/mm/yyyy, lo dejamos igual
    return valor;
  }

  function handleDateFilterChange(ini) {
    const startDateValue = filtroFechaInicio.value;
    const endDateValue = filtroFechaFin.value;
    const parsedStart = startDateValue ? parseFechaInput(startDateValue) : null;
    const parsedEnd = endDateValue ? parseFechaInput(endDateValue) : null;
    let startDate = parsedStart ? new Date(parsedStart.split('/').reverse().join('/')) : null;
    let endDate = parsedEnd ? new Date(parsedEnd.split('/').reverse().join('/')) : null;
    if (ini && prevStartDate && prevStartDate.getTime() === (startDate ? startDate.getTime() : null)) {
      prevStartDate = null;
      filtroFechaInicio.value = '';
      startDate = null;
    } else {
      prevStartDate = startDate;
    }
    if (!ini && prevEndDate && prevEndDate.getTime() === (endDate ? endDate.getTime() : null)) {
      prevEndDate = null;
      filtroFechaFin.value = '';
      endDate = null;
    } else {
      prevEndDate = endDate;
    }
    filtroPorFecha(1, startDate, endDate);
    updateFilterButtonText(startDate, endDate);
  }

  $(filtroFechaInicio).on('changeDate', function() {
    handleDateFilterChange(true);
  });
  $(filtroFechaFin).on('changeDate', function() {
    handleDateFilterChange(false);
  });

  // Asegura filtrado automático también con el evento 'change' estándar
  filtroFechaInicio.addEventListener('change', function() {
    handleDateFilterChange(true);
  });
  filtroFechaFin.addEventListener('change', function() {
    handleDateFilterChange(false);
  });

  categoriaFiltro.innerHTML = '<option value="">Todas las categorías</option>';
  categorias.forEach(categoria => {
    if (categoria.user_id === parseInt(idUsuarioActivo)) {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      categoriaFiltro.appendChild(option);
    }
  });

  function filtrarCategoria() {
    const categoriaId = categoriaFiltro.value;
    filtroPorCategoria(1, categoriaId);
    updateFilterButtonText(null, null, categoriaId);
  }

  categoriaFiltro.addEventListener('change', filtrarCategoria);

  tagFiltrarFechas.addEventListener('click', function () {
    filtroFechaInicio.value = '';
    filtroFechaFin.value = '';
    filtroPorFecha(1, null, null);
    updateFilterButtonText(null, null, categoriaFiltro.value);
  });

  tagFiltrarCategorias.addEventListener('click', function () {
    categoriaFiltro.value = '';
    filtroPorCategoria(1, '');
    updateFilterButtonText(null, null, '');
  });

  // Inicializar
  updateFilterButtonText();
  renderHistorial(1);
  renderPaginacionHistorial();
});
