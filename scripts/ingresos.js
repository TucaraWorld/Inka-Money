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
    console.log("Filtros obtenidos:", filtrosIngresos);

    const ingresosFiltrados = obtenerIngresosFiltrados(filtrosIngresos);
    console.log("Ingresos filtrados:", ingresosFiltrados);
    const ingresosPagina = obtenerPagina(pagina, ingresosFiltrados);
    const ingresosBody = document.getElementById('cuerpoTablaIngresos');
    //const ingresosPagina = obtenerPagina(pagina, regIngresos);
    //const ingresosBody = document.getElementById('cuerpoTablaIngresos');

    ingresosBody.innerHTML = '';

    // Verificar si hay registros después de aplicar los filtros
    if (ingresosPagina.length === 0) {
        // Mostrar el mensaje de advertencia si no hay registros
        const warningMessage = document.getElementById('noRecordsWarning');
        warningMessage.style.display = 'block';
    } else {
        // Ocultar el mensaje de advertencia si hay registros
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
      // Filtrar por fecha

        console.log("Filtros de ingresos:", filtrosIngresos);

      if (filtrosIngresos.fechaInicio || filtrosIngresos.fechaFin) {
        console.log("Filtrando por fecha:", filtrosIngresos.fechaInicio, filtrosIngresos.fechaFin);
          return ingresos.filter(ingreso => {
                const fecha = new Date(ingreso.fecha.split('/').reverse().join('/'));
                console.log("Fecha de ingreso:", fecha);

                const fechaInicio = filtrosIngresos.fechaInicio ? new Date(filtrosIngresos.fechaInicio) : null;
                const fechaFin = filtrosIngresos.fechaFin ? new Date(filtrosIngresos.fechaFin) : null;

                console.log("Fecha inicio:", filtrosIngresos.fechaInicio)
                console.log("Fecha fin:", filtrosIngresos.fechaFin);
                
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

      console.log("Ingresos sin filtro:", ingresos);

      return ingresos;  // Si no hay filtro, se devuelven todos los ingresos
  }

// Función para renderizar los botones de paginación
function renderPaginacion() {
    const filtrosIngresos = getFiltros();  // Obtenemos los filtros desde localStorage
    console.log("Filtros en renderPaginacion:", filtrosIngresos);

    const ingresosFiltrados = obtenerIngresosFiltrados(filtrosIngresos);  // Filtramos los ingresos
    const totalPaginas = Math.ceil(ingresosFiltrados.length / registrosPorPagina);
    const paginacion = document.querySelector('.pagination');

    //const totalPaginas = Math.ceil(regIngresos.length / registrosPorPagina);
    ////console.log(`Total de páginas: ${totalPaginas}`);
    //const paginacion = document.querySelector('.pagination');
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

// Inicializar la paginación
renderIngresos(paginaActual);
renderPaginacion();


