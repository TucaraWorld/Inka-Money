// Filtro de fechas para historial-movimientos (copiado y adaptado de filtrar-gastos.js)

document.addEventListener('DOMContentLoaded', function () {
  const btnFiltrarPorFecha = document.getElementById('btnFiltrarPorFecha');
  const calendarContainer = document.getElementById('calendarContainer');
  const inputStartDate = document.getElementById('startDate');
  const inputEndDate = document.getElementById('endDate');
  const btnApplyDateFilter = document.getElementById('applyDateFilter');
  const btnCloseCalendar = document.getElementById('closeCalendar');
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');

  // Mostrar el calendario al hacer clic en el botón de filtro
  btnFiltrarPorFecha.addEventListener('click', function () {
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

  btnCloseCalendar.addEventListener('click', function () {
    calendarContainer.style.display = 'none';
    inputStartDate.value = '';
    inputEndDate.value = '';
  });

  // Aplicar el filtro de fecha
  btnApplyDateFilter.addEventListener('click', function () {
    const startDate = inputStartDate.value ? new Date(inputStartDate.value.split('/').reverse().join('/')) : null;
    const endDate = inputEndDate.value ? new Date(inputEndDate.value.split('/').reverse().join('/')) : null;

    filterRowsByDate(startDate, endDate);
    updateFilterButtonText(startDate, endDate);

    calendarContainer.style.display = 'none';
  });

  // Eliminar el filtro de fechas al hacer clic en la "x"
  tagFiltrarFechas.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-date-filter')) {
      // Resetear filtro
      inputStartDate.value = '';
      inputEndDate.value = '';
      filterRowsByDate(null, null);
      updateFilterButtonText(null, null);
    }
  });

  // Filtrar las filas según la fecha seleccionada
  function filterRowsByDate(startDate, endDate) {
    const rows = document.querySelectorAll('#cuerpoTablaGastos tr');
    rows.forEach(row => {
      const rowDate = row.cells[0].textContent;
      // Parse as local date: dd/mm/yyyy
      const [day, month, year] = rowDate.split('/').map(Number);
      const rowDateObject = new Date(year, month - 1, day); // months are 0-based

      let showRow = true;

      if (startDate && rowDateObject < startDate) {
        showRow = false;
      }

      if (endDate && rowDateObject > endDate) {
        showRow = false;
      }

      row.style.display = showRow ? '' : 'none';
    });
  }

  // Actualizar el texto del botón "Todas las fechas" y añadir botón para quitar filtro
  function updateFilterButtonText(startDate, endDate) {
    let filterText = 'Todas las fechas';

    if (startDate && endDate) {
      filterText = `Desde: ${formatDate(startDate)}  |  Hasta: ${formatDate(endDate)}`;
    } else if (startDate) {
      filterText = `Desde: ${formatDate(startDate)}`;
    } else if (endDate) {
      filterText = `Hasta: ${formatDate(endDate)}`;
    }

    // Si hay filtro, añade la "x" para quitarlo
    if (startDate || endDate) {
      tagFiltrarFechas.innerHTML = `${filterText} <span class="remove-date-filter" style="cursor:pointer;margin-left:8px;">&times;</span>`;
    } else {
      tagFiltrarFechas.textContent = filterText;
    }
  }

  // Dar formato a la fecha
  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
});
