document.addEventListener('DOMContentLoaded', function() {
  const btnFiltrarPorFecha = document.getElementById('btnFiltrarPorFecha');
  const btnFiltrarPorCategoria = document.getElementById('btnFiltrarPorCategoria');
  const calendarContainer = document.getElementById('calendarContainer');
  const inputStartDate = document.getElementById('startDate');
  const inputEndDate = document.getElementById('endDate');
  const btnApplyDateFilter = document.getElementById('applyDateFilter');
  const btnCloseCalendar = document.getElementById('closeCalendar');
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategorias');

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

  //Filtrar las filas según la fecha seleccionada
  function filterRowsByDate(startDate, endDate) {
    const rows = document.querySelectorAll('#cuerpoTablaGastos tr');
    let anyRowVisible = false;

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
        anyRowVisible = true;
      } else {
        row.style.display = 'none';
      }
    });

    // Mostrar o ocultar el mensaje de advertencia
    const warningMessage = document.getElementById('noRecordsWarning');
    if (anyRowVisible) {
      warningMessage.style.display = 'none';  // Ocultar el mensaje si hay registros
    } else {
      warningMessage.style.display = 'block';  // Mostrar el mensaje si no hay registros
    }
  }

  function filtroPorFecha(pagina = 1, startDate, endDate) {
      const gastosPagina = obtenerPaginaFiltroFecha(pagina, startDate, endDate);
      const gastosBody = document.getElementById('cuerpoTablaGastos');

      gastosBody.innerHTML = '';

      gastosBody.innerHTML = gastosPagina.map(gasto => `
          <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${gasto.fecha}</td>
            <td>${categorias.find(cat => cat.id === Number(gasto.categoria))?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${gasto.monto.toFixed(2)}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor:pointer"></i></td>
          </tr>
      `).join('');

      const warningMessage = document.getElementById('noRecordsWarning');
      if (gastosPagina.length === 0) {
        warningMessage.style.display = 'block';
      } else {
        warningMessage.style.display = 'none';
      }

      renderPaginacionGastos(gastosPagina);
  }

  function obtenerPaginaFiltroFecha(pagina, startDate, endDate) {
    const todosLosGastos = getGastos();

    // Filtrar por fecha si se proporciona rango
    const gastosFiltrados = todosLosGastos.filter(gasto => {
      const gastoDate = new Date(gasto.fecha.split('/').reverse().join('-'));

      if (startDate && gastoDate < startDate) return false;
      if (endDate && gastoDate > endDate) return false;

      return true;
    });

    console.log('Filtrados: ', gastosFiltrados);

    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return gastosFiltrados.slice(inicio, fin);

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

  
  const categoriaSelect = document.getElementById('categoriaSelect');
  const categoriaFiltro = document.getElementById('categoriaFiltro');
  const cancelarCategoriaFiltro = document.getElementById('cancelarCategoriaFiltro');

  btnFiltrarPorCategoria.addEventListener('click', function() {
    // Limpiar opciones previas, dejar solo la opción "Todas las categorías"
    categoriaFiltro.innerHTML = '<option value=""></option>';
    // Agregar opciones dinámicamente si tienes un array de categorías
    categorias.forEach(categoria => {
        if (categoria.user_id === parseInt(idUsuarioActivo)) {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categoriaFiltro.appendChild(option);
        }
    });
    // Mostrar el formulario
    categoriaSelect.style.display = 'block';
  });

  if (categoriaSelect && categoriaFiltro) {
    categoriaSelect.addEventListener('submit', function(e) {
      e.preventDefault();
      const categoriaId = categoriaFiltro.value;

      console.log("Id: ", categoriaId);

      filtroPorCategoria(1, categoriaId);
      updateCategoriaFilterButtonText(categoriaId);
      categoriaSelect.classList.add('visually-hidden');
    });
      

      if (cancelarCategoriaFiltro) {
        cancelarCategoriaFiltro.addEventListener('click', function() {
        categoriaSelect.classList.add('visually-hidden');
        tagFiltrarCategorias.textContent = "Todas las categorías";
        renderGastos(paginaActual);
        renderPaginacionGastos();
        });
      }
      // Mostrar el formulario correctamente quitando la clase visually-hidden
      btnFiltrarPorCategoria.addEventListener('click', function() {
        categoriaSelect.classList.remove('visually-hidden');
      });
  }
  

  function filtroPorCategoria(pagina = 1, categoriaId) {
    const gastosPagina = obtenerPaginaFiltroCategoria(pagina, categoriaId);
    const gastosBody = document.getElementById('cuerpoTablaGastos');

    gastosBody.innerHTML = '';

    gastosBody.innerHTML = gastosPagina.map(gasto => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${gasto.fecha}</td>
            <td>${categorias.find(cat => cat.id === Number(gasto.categoria))?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${gasto.monto.toFixed(2)}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor:pointer"></i></td>
        </tr>
    `).join('');

    const warningMessage = document.getElementById('noRecordsWarning');
    if (gastosPagina.length === 0) {
      warningMessage.querySelector('p').textContent = 'No se han registrado gastos en la categoría seleccionada, ¿desearía registrar algún gasto? Haga clic en "Agregar gasto".';
      warningMessage.style.display = 'block';
    } else {
      warningMessage.style.display = 'none';
    }

    renderPaginacionGastos(gastosPagina);
  }

  function obtenerPaginaFiltroCategoria(pagina, categoriaId) {
    const todosLosGastos = getGastos();

    // Filtrar por categoría si se proporciona
    const gastosFiltrados = categoriaId != "" ? todosLosGastos.filter(gasto => gasto.categoria === parseInt(categoriaId)) : todosLosGastos;


    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return gastosFiltrados.slice(inicio, fin);
  }

  function updateCategoriaFilterButtonText(categoriaId) {
    let filterText = 'Todas las categorías';
    if (categoriaId && categoriaId !== '') {
      console.log("Cats: ", categorias);
      console.log("CATID: ", categoriaId);
      filterText = "Categoría: " + categorias.find(cat => cat.id === parseInt(categoriaId)).nombre;
    }
    tagFiltrarCategorias.textContent = filterText;
  }
  
});
