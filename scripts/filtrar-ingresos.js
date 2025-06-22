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
    
    filtroPorFecha(1, startDate, endDate);
    updateFilterButtonText(startDate, endDate);
    
    calendarContainer.style.display = 'none';
  });

  
  function filtroPorFecha(pagina = 1, startDate, endDate) {
      const ingresosPagina = obtenerPaginaFiltroFecha(pagina, startDate, endDate);
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

      const warningMessage = document.getElementById('noRecordsWarning');
      if (ingresosPagina.length === 0) {
        warningMessage.style.display = 'block';
      } else {
        warningMessage.style.display = 'none';
      }

      renderPaginacion(ingresosPagina);
  }

  function obtenerPaginaFiltroFecha(pagina, startDate, endDate) {
    const todosLosIngresos = getIngresos();

    // Filtrar por fecha si se proporciona rango
    const ingresosFiltrados = todosLosIngresos.filter(ingreso => {
      const ingresoDate = new Date(ingreso.fecha.split('/').reverse().join('-'));

      if (startDate && ingresoDate < startDate) return false;
      if (endDate && ingresoDate > endDate) return false;

      return true;
    });

    console.log('Filtrados: ', ingresosFiltrados);

    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return ingresosFiltrados.slice(inicio, fin);

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

    tagFiltrarFechas.textContent = filterText;

    const icono = tagFiltrarFechas.querySelector('i');
    icono.classList.remove('oculto');
    icono.classList.add('visible');
  }

  //Dar formato a la fecha
  function formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
});
