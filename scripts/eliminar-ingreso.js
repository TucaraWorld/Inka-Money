document.addEventListener('DOMContentLoaded', function () {
  const tbody = document.getElementById('cuerpoTablaIngresos');
  const templateConfirmacion = document.getElementById('confirmacion-template');
  const templateToast = document.getElementById('toast-template');

  let ingresoEliminado = null;
  let paginaPrevia = 1;

  tbody.addEventListener('click', function (e) {
    if (e.target.classList.contains('eliminar-fila')) {
      const fila = e.target.closest('tr');
      mostrarConfirmacion(fila);
    }
  });

  function mostrarConfirmacion(fila) {
    eliminarConfirmacionExistente();

    fila.classList.add('table-active');
    const nuevaFila = templateConfirmacion.content.cloneNode(true);
    const filaConfirmacion = nuevaFila.querySelector('tr');
    fila.parentNode.insertBefore(filaConfirmacion, fila.nextSibling);

    // Cancelar
    filaConfirmacion.querySelector('.cancelar-eliminacion').addEventListener('click', () => {
      fila.classList.remove('table-active');
      filaConfirmacion.remove();
    });

    // Confirmar
    filaConfirmacion.querySelector('.confirmar-eliminacion').addEventListener('click', () => {
      const filtrosIngresos = typeof getFiltros === 'function' ? getFiltros() : {};
      const ingresosFiltrados = obtenerIngresosFiltrados(filtrosIngresos);
      const ingresosPagina = obtenerPagina(paginaActual, ingresosFiltrados);

      const indexEnPagina = [...fila.parentNode.children]
        .filter(tr => tr.tagName === 'TR' && !tr.classList.contains('fila-confirmacion'))
        .indexOf(fila);

      const ingreso = ingresosPagina[indexEnPagina];
      if (!ingreso) return;

      eliminarIngreso(ingreso.id);

      ingresoEliminado = ingreso;
      paginaPrevia = paginaActual;

      // --- Lógica para evitar páginas vacías ---
      const totalIngresos = ingresosFiltrados.length - 1; // -1 porque ya eliminaste uno
      const registrosPorPagina = 5; // Cambia si usas otro valor
      const totalPaginas = Math.ceil(totalIngresos / registrosPorPagina);

      if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas > 0 ? totalPaginas : 1;
      }
      // ----------------------------------------

      renderIngresos(paginaActual);
      renderPaginacion();
      mostrarToastEliminacion();
    });
  }

  function eliminarConfirmacionExistente() {
    const confirmacion = document.querySelector('.fila-confirmacion');
    if (confirmacion) {
      const anterior = confirmacion.previousElementSibling;
      if (anterior) anterior.classList.remove('table-active');
      confirmacion.remove();
    }
  }

  function mostrarToastEliminacion() {
    eliminarToastExistente();
    const toast = templateToast.content.cloneNode(true).children[0];
    document.body.appendChild(toast);

    // Botón deshacer
    toast.querySelector('.btn-deshacer')?.addEventListener('click', function () {
      if (ingresoEliminado) {
        guardarIngreso(ingresoEliminado);
        renderIngresos(paginaPrevia);
        renderPaginacion();
        ingresoEliminado = null;
        toast.remove();
      }
    });

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 5000);
  }

  function eliminarToastExistente() {
    const prev = document.querySelector('.toast-exito');
    if (prev) prev.remove();
  }
});