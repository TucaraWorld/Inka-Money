document.addEventListener('DOMContentLoaded', function() {
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategorias');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');

  // Inicializar datepickers para los nuevos inputs
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

    console.log('Start Date:', startDate, ' - Prev start date:', prevStartDate);
    console.log('End Date:', endDate, ' - Prev end date:', prevEndDate);
    if (ini && prevStartDate && prevStartDate.getTime() === startDate.getTime()) 
      {
        prevStartDate = null;
        filtroFechaInicio.value = '';
        startDate = null;
        console.log('Fecha de inicio eliminada');
      }
    else {
        prevStartDate = startDate;
      }
    if (!ini && prevEndDate && prevEndDate.getTime() === endDate.getTime()) 
      {
        prevEndDate = null;
        filtroFechaFin.value = '';
        endDate = null;
      }
    else {
        prevEndDate = endDate;
      }
    
    filtroPorFecha(1, startDate, endDate);
    updateFilterButtonText(startDate, endDate);
  }

  function filtroPorFecha(pagina = 1, startDate, endDate) {
      let filtrosGas = getFiltrosGastos();
      
      filtrosGas.fechaInicio = startDate;
      filtrosGas.fechaFin = endDate;
      filtrosGas.categoria = null;

      setFiltrosGastos(filtrosGas);
      console.log('Filtros guardados en fpf:', getFiltrosGastos());

      renderGastos(pagina); 
      renderPaginacionGastos();
  }

  // Función para filtrar los gastos por categoría
  function filtroPorCategoria(pagina = 1, categoriaId) {
      let filtroGas = getFiltrosGastos();
      console.log('Filtros obtenidos en fpc:', filtroGas);

      if (categoriaId === "") {
        filtroGas.categoria = null;
      } else {
        filtroGas.fechaInicio = null;
        filtroGas.fechaFin = null;
        filtroGas.categoria = categoriaId;
      }

      setFiltrosGastos(filtroGas);
      console.log('Filtros guardados en fpc:', getFiltros());

      renderGastos(pagina); 
      renderPaginacionGastos(); 
  }

  $(filtroFechaInicio).on('changeDate', function() {
    handleDateFilterChange(true);
  });
  $(filtroFechaFin).on('changeDate', function() {
    handleDateFilterChange(false);
  });

  //Actualizar el texto del botón "Todas las fechas"
  function updateFilterButtonText(startDate = null, endDate = null, categoriaId = '') {
    let filterTextFecha = 'Todas las fechas';

    if (startDate && endDate) {
      filterTextFecha = `Desde: ${formatDate(startDate)}  |  Hasta: ${formatDate(endDate)}`;
    } else if (startDate) {
      filterTextFecha = `Desde: ${formatDate(startDate)}`;
    } else if (endDate) {
      filterTextFecha = `Hasta: ${formatDate(endDate)}`;
    }

    tagFiltrarFechas.textContent = filterTextFecha; // Actualiza el texto del botón
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

  //Dar formato a la fecha
  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  
  const categoriaFiltro = document.getElementById('categoriaFiltro');

  categoriaFiltro.innerHTML = '<option value="">Todas las categorías</option>';
    // Agregar opciones dinámicamente si tienes un array de categorías
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

    console.log("Id: ", categoriaId);

    filtroPorCategoria(1, categoriaId);
    updateFilterButtonText(null, null, categoriaId);
  }

  categoriaFiltro.addEventListener('change', filtrarCategoria);
  
});
