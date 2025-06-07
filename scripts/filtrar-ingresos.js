document.addEventListener('DOMContentLoaded', function() {
  const btnFiltrarPorFecha = document.getElementById('btnFiltrarPorFecha');
  const calendarContainer = document.getElementById('calendarContainer');
  const inputStartDate = document.getElementById('startDate');
  const inputEndDate = document.getElementById('endDate');
  const btnApplyDateFilter = document.getElementById('applyDateFilter');
  const btnCloseCalendar = document.getElementById('closeCalendar');
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');

  //Mostrar el calendario cuando se haga clic en el botón de filtro
  btnFiltrarPorFecha.addEventListener('click', function() {
    calendarContainer.style.display = 'block';

    $(inputStartDate).datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true
    });

    $(inputEndDate).datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true
    });
  });

  btnCloseCalendar.addEventListener('click', function() {
    calendarContainer.style.display = 'none';
    inputStartDate.value = '';
    inputEndDate.value = '';
  });

  //Aplicar el filtro de fecha
  btnApplyDateFilter.addEventListener('click', function() {
    const startDate = inputStartDate.value ? new Date(inputStartDate.value.split('/').reverse().join('/')) : null;
    const endDate = inputEndDate.value ? new Date(inputEndDate.value.split('/').reverse().join('/')) : null;
    
    filterRowsByDate(startDate, endDate);
    
    updateFilterButtonText(startDate, endDate);
    
    calendarContainer.style.display = 'none';
  });

  //Filtrar las filas según la fecha seleccionada
  function filterRowsByDate(startDate, endDate) {
    const rows = document.querySelectorAll('#cuerpoTablaIngresos tr');
    rows.forEach(row => {
      const rowDate = row.cells[1].textContent;
      const rowDateObject = new Date(rowDate.split('/').reverse().join('-'));

      let showRow = true;

      if (startDate && rowDateObject < startDate) {
        showRow = false;
      }

      if (endDate && rowDateObject > endDate) {
        showRow = false;
      }

      if (showRow) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  //Actualizar el texto del botón "Todas las fechas"
  function updateFilterButtonText(startDate, endDate) {
    let filterText = 'Todas las fechas';

    if (startDate && endDate) {
      filterText = `Desde: ${formatDate(startDate)}  |  Hasta: ${formatDate(endDate)}`;
    } else if (startDate) {
      filterText = `Desde: ${formatDate(startDate)}`;
    } else if (endDate) {
      filterText = `Hasta: ${formatDate(endDate)}`;
    }

    tagFiltrarFechas.textContent = filterText; // Actualiza el texto del botón
  }

  //Dar formato a la fecha
  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
});
