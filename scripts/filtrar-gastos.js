document.addEventListener('DOMContentLoaded', function() {
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategorias');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');

  // Detectar dispositivo móvil y usar calendario nativo en móviles
  function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  if (esDispositivoMovil()) {
    filtroFechaInicio.type = 'date';
    filtroFechaFin.type = 'date';
    filtroFechaInicio.removeAttribute('readonly');
    filtroFechaFin.removeAttribute('readonly');
    filtroFechaInicio.placeholder = 'Fecha de inicio';
    filtroFechaFin.placeholder = 'Fecha de fin';
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
    // Inicializar datepickers en desktop
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

  // Utilidad para parsear fecha de input (soporta dd/mm/yyyy y yyyy-mm-dd)
  function parseFechaInput(valor) {
    if (!valor) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [y, m, d] = valor.split('-');
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      const [d, m, y] = valor.split('/');
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    return null;
  }

  function handleDateFilterChange(ini) {
    const startDateValue = filtroFechaInicio.value;
    const endDateValue = filtroFechaFin.value;
    let startDate = parseFechaInput(startDateValue);
    let endDate = parseFechaInput(endDateValue);

    console.log('Start Date:', startDate, ' - Prev start date:', prevStartDate);
    console.log('End Date:', endDate, ' - Prev end date:', prevEndDate);
    if (ini && prevStartDate && prevStartDate.getTime() === (startDate ? startDate.getTime() : null)) 
      {
        prevStartDate = null;
        filtroFechaInicio.value = '';
        startDate = null;
        console.log('Fecha de inicio eliminada');
      }
    else {
        prevStartDate = startDate;
      }
    if (!ini && prevEndDate && prevEndDate.getTime() === (endDate ? endDate.getTime() : null)) 
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

  // Asegurar filtrado también con eventos nativos para inputs date en móviles
  filtroFechaInicio.addEventListener('change', function() {
    handleDateFilterChange(true);
  });
  filtroFechaFin.addEventListener('change', function() {
    handleDateFilterChange(false);
  });

  // Resetear filtros al hacer clic en los tags
  tagFiltrarFechas.addEventListener('click', function() {
    filtroFechaInicio.value = '';
    filtroFechaFin.value = '';
    filtroPorFecha(1, null, null);
    updateFilterButtonText();
  });
  tagFiltrarCategorias.addEventListener('click', function() {
    categoriaFiltro.value = '';
    filtroPorCategoria(1, '');
    updateFilterButtonText();
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
