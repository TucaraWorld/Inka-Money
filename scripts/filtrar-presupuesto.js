/*
  filtrar-presupuesto.js
  Filtros para la tabla de presupuestos (categoría, fechas si aplica)
  Inspirado en filtrar-gastos.js
*/

document.addEventListener('DOMContentLoaded', function() {
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategoriasPresupuesto');
  const categoriaFiltro = document.getElementById('categoriaFiltroPresupuesto');
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechasPresupuesto');
  const filtroFechaInicio = document.getElementById('filtroFechaInicioPresupuesto');
  const filtroFechaFin = document.getElementById('filtroFechaFinPresupuesto');

  // Llenar select de categorías (usar id como value, igual que en gastos)
  categoriaFiltro.innerHTML = '<option value="">Todas las categorías</option>';
  categorias.forEach(categoria => {
    if (categoria.user_id === parseInt(idUsuarioActivo)) {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      categoriaFiltro.appendChild(option);
    }
  });

  function filtrarCategoriaPresupuesto() {
    const categoriaId = categoriaFiltro.value;
    let filtros = getFiltrosPresupuesto();
    filtros.categoria = categoriaId || null;
    setFiltrosPresupuesto(filtros);
    renderPresupuestos(1);
    renderPaginacionPresupuestos();
    // Buscar el nombre de la categoría seleccionada
    let nombreCategoria = '';
    if (categoriaId) {
      const catObj = categorias.find(cat => cat.id === parseInt(categoriaId));
      if (catObj) nombreCategoria = catObj.nombre;
    }
    setNoRecordsWarningTextPresupuesto(nombreCategoria);
    // Actualiza el tag con el nombre de la categoría seleccionada
    const tag = document.getElementById('tagFiltrarCategoriasPresupuesto');
    if (categoriaId && nombreCategoria) {
      tag.textContent = `Categoría: ${nombreCategoria}`;
    } else {
      tag.textContent = 'Todas las categorías';
    }
    // También actualiza el texto de los botones de filtro (por si acaso)
    updateFilterButtonTextPresupuesto(null, null, categoriaId);
  }

  categoriaFiltro.addEventListener('change', filtrarCategoriaPresupuesto);

  // Filtros de fecha (igual que en gastos, sin container ni orientation extra)
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

  let prevStartDate = null;
  let prevEndDate = null;

  function handleDateFilterChange(ini) {
    const startDateValue = filtroFechaInicio.value;
    const endDateValue = filtroFechaFin.value;

    let startDate = startDateValue ? new Date(startDateValue.split('/').reverse().join('/')) : null;
    let endDate = endDateValue ? new Date(endDateValue.split('/').reverse().join('/')) : null;

    if (ini && prevStartDate && prevStartDate.getTime() === startDate?.getTime()) {
      prevStartDate = null;
      filtroFechaInicio.value = '';
      startDate = null;
    } else {
      prevStartDate = startDate;
    }
    if (!ini && prevEndDate && prevEndDate.getTime() === endDate?.getTime()) {
      prevEndDate = null;
      filtroFechaFin.value = '';
      endDate = null;
    } else {
      prevEndDate = endDate;
    }

    filtroPorFechaPresupuesto(1, startDate, endDate);
    updateFilterButtonTextPresupuesto(startDate, endDate);
  }

  function filtroPorFechaPresupuesto(pagina = 1, startDate, endDate) {
    let filtros = getFiltrosPresupuesto();
    filtros.fechaInicio = startDate;
    filtros.fechaFin = endDate;
    // Al filtrar por fecha, limpiar categoría
    filtros.categoria = null;
    setFiltrosPresupuesto(filtros);
    renderPresupuestos(pagina);
    renderPaginacionPresupuestos();
  }

  $(filtroFechaInicio).on('changeDate', function() {
    handleDateFilterChange(true);
  });
  $(filtroFechaFin).on('changeDate', function() {
    handleDateFilterChange(false);
  });

  //Actualizar el texto de los botones de filtro
  function updateFilterButtonTextPresupuesto(startDate = null, endDate = null, categoriaId = '') {
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
      const catObj = categorias.find(cat => cat.id === parseInt(categoriaId));
      if (catObj) {
        filterTextCat = `Categoría: ${catObj.nombre}`;
      }
    }
    tagFiltrarCategorias.textContent = filterTextCat;
  }

  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  // Inicializar texto
  updateFilterButtonTextPresupuesto();

  // Botón rápido de fechas
  tagFiltrarFechas.addEventListener('click', function() {
    filtroFechaInicio.value = '';
    filtroFechaFin.value = '';
    filtroPorFechaPresupuesto(1, null, null);
    updateFilterButtonTextPresupuesto();
  });

  // Botón rápido de categorías
  tagFiltrarCategorias.addEventListener('click', function() {
    categoriaFiltro.value = '';
    filtrarCategoriaPresupuesto();
    updateFilterButtonTextPresupuesto();
  });
});
