let filtrosIng = {
    fechaInicio: null,
    fechaFin: null,
    categoria: null
};

setFiltros(filtrosIng);


// Número de registros por página
const registrosPorPagina = 5;

let paginaActual = 1;

function obtenerPagina(pagina, ingresosFiltrados) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return ingresosFiltrados.slice(inicio, fin);
}

/*
function obtenerPagina(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return getIngresos().slice(inicio, fin);
}*/

// Función para renderizar los ingresos en la tabla
function renderIngresos(pagina = 1) {
    const filtrosIngresos = getFiltros();  // Obtenemos los filtros desde localStorage
    const ingresosFiltrados = obtenerIngresosFiltrados(filtrosIngresos);
    const ingresosPagina = obtenerPagina(pagina, ingresosFiltrados);
    const ingresosBody = document.getElementById('cuerpoTablaIngresos');

    ingresosBody.innerHTML = '';

    // Verificar si hay registros después de aplicar los filtros
    if (ingresosPagina.length === 0) {
        const warningMessage = document.getElementById('noRecordsWarning');
        warningMessage.style.display = 'block';
    } else {
        const warningMessage = document.getElementById('noRecordsWarning');
        warningMessage.style.display = 'none';
    }

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
}


  // Función para obtener los ingresos filtrados por fecha y categoría
  function obtenerIngresosFiltrados(filtrosIngresos = {}) {
      const ingresos = getIngresos();
      // Utilidad para convertir yyyy-mm-dd a dd/mm/yyyy
      function normalizarFechaInput(valor) {
          if (!valor) return null;
          if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
              const [y, m, d] = valor.split('-');
              return `${d}/${m}/${y}`;
          }
          return valor;
      }
      // Filtrar por fecha
      if (filtrosIngresos.fechaInicio || filtrosIngresos.fechaFin) {
          const fechaInicioStr = normalizarFechaInput(filtrosIngresos.fechaInicio);
          const fechaFinStr = normalizarFechaInput(filtrosIngresos.fechaFin);
          return ingresos.filter(ingreso => {
              let fecha = new Date(ingreso.fecha.split('/').reverse().join('/'));
              fecha.setHours(12,0,0,0);
              let fechaInicio = fechaInicioStr ? new Date(fechaInicioStr.split('/').reverse().join('/')) : null;
              let fechaFin = fechaFinStr ? new Date(fechaFinStr.split('/').reverse().join('/')) : null;
              if (fechaInicio) fechaInicio.setHours(0,0,0,0);
              if (fechaFin) fechaFin.setHours(23,59,59,999);
              let valido = true;
              if (fechaInicio && fecha < fechaInicio) valido = false;
              if (fechaFin && fecha > fechaFin) valido = false;
              return valido;
          });
      }

      // Filtrar por categoría
      if (filtrosIngresos.categoria) {
          return ingresos.filter(ingreso => ingreso.categoria === parseInt(filtrosIngresos.categoria));
      }

      //console.log("Ingresos sin filtro:", ingresos);

      return ingresos;  // Si no hay filtro, se devuelven todos los ingresos
  }

// Función para renderizar los botones de paginación
function renderPaginacion() {
    const filtrosIngresos = getFiltros();

    const ingresosFiltrados = obtenerIngresosFiltrados(filtrosIngresos);
    const totalPaginas = Math.ceil(ingresosFiltrados.length / registrosPorPagina);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    // Crear el botón "anterior"
    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    // Crear los botones de las páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        if (i === paginaActual) {
            paginaItem.classList.add('page-item', 'active');
        }
        else {
            paginaItem.classList.add('page-item');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    // Crear el botón "siguiente"
    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

//Función para ir a la página seleccionada
function irPagina(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderIngresos(paginaActual);
    renderPaginacion();
}

// Filtros dinámicos de fecha y categoría para ingresos (adaptado de historial-movimientos.js)
document.addEventListener('DOMContentLoaded', function () {
  const tagFiltrarFechas = document.getElementById('tagFiltrarFechas');
  const tagFiltrarCategorias = document.getElementById('tagFiltrarCategorias');
  const filtroFechaInicio = document.getElementById('filtroFechaInicio');
  const filtroFechaFin = document.getElementById('filtroFechaFin');
  const categoriaFiltro = document.getElementById('categoriaFiltro');

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

  function parseFechaInput(valor) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [y, m, d] = valor.split('-');
      return `${d}/${m}/${y}`;
    }
    return valor;
  }

  function updateFilterButtonText(startDate = null, endDate = null, categoriaId = '') {
    let filterTextFecha = 'Todas las fechas';
    if (startDate && endDate) {
      filterTextFecha = `Desde: ${startDate}  |  Hasta: ${endDate}`;
    } else if (startDate) {
      filterTextFecha = `Desde: ${startDate}`;
    } else if (endDate) {
      filterTextFecha = `Hasta: ${endDate}`;
    }
    tagFiltrarFechas.textContent = filterTextFecha;
    if (tagFiltrarFechas.textContent === 'Todas las fechas') {
      filtroFechaInicio.value = '';
      filtroFechaFin.value = '';
    }
    let filterTextCat = 'Todas las categorías';
    if (categoriaId && categoriaId !== '') {
      filterTextCat = "Categoría: " + (categorias.find(cat => cat.id === parseInt(categoriaId))?.nombre || '');
    }
    tagFiltrarCategorias.textContent = filterTextCat;
  }

  function filtroPorFecha(pagina = 1, startDate, endDate) {
    let filtrosIng = getFiltros();
    filtrosIng.fechaInicio = startDate ? parseFechaInput(startDate) : null;
    filtrosIng.fechaFin = endDate ? parseFechaInput(endDate) : null;
    filtrosIng.categoria = null;
    setFiltros(filtrosIng);
    renderIngresos(pagina);
    renderPaginacion();
  }

  function filtroPorCategoria(pagina = 1, categoriaId) {
    let filtrosIng = getFiltros();
    if (categoriaId === "") {
      filtrosIng.categoria = null;
    } else {
      filtrosIng.fechaInicio = null;
      filtrosIng.fechaFin = null;
      filtrosIng.categoria = categoriaId;
    }
    setFiltros(filtrosIng);
    renderIngresos(pagina);
    renderPaginacion();
  }

  function handleDateFilterChange() {
    const startDateValue = filtroFechaInicio.value;
    const endDateValue = filtroFechaFin.value;
    filtroPorFecha(1, startDateValue, endDateValue);
    updateFilterButtonText(startDateValue, endDateValue, categoriaFiltro.value);
  }

  $(filtroFechaInicio).on('changeDate', handleDateFilterChange);
  $(filtroFechaFin).on('changeDate', handleDateFilterChange);
  filtroFechaInicio.addEventListener('change', handleDateFilterChange);
  filtroFechaFin.addEventListener('change', handleDateFilterChange);

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
  renderIngresos(1);
  renderPaginacion();
});

// Inicializar la paginación
renderIngresos(paginaActual);
renderPaginacion();


