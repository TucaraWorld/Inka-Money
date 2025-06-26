document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tablaGastos');
  const templateConfirmacion = document.getElementById('confirmacion-template');
  const templateToast = document.getElementById('toast-template');

  let gastoEliminado = null;
  let paginaPrevia = 1;

  tabla.addEventListener('click', (e) => {
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
      const indexEnPagina = [...fila.parentNode.children].filter(tr => tr.tagName === 'TR' && !tr.classList.contains('fila-confirmacion')).indexOf(fila);
      const gastosPagina = obtenerPaginaGastos(paginaActual);
      const gasto = gastosPagina[indexEnPagina];

      if (!gasto) return;

      // Eliminar usando la función centralizada
      eliminarGasto(gasto.id);

      // Guardar el eliminado para posible deshacer
      gastoEliminado = gasto;
      paginaPrevia = paginaActual;

      renderGastos(paginaActual);
      renderPaginacionGastos();
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
    toast.querySelector('.btn-deshacer').addEventListener('click', () => {
      if (gastoEliminado) {
        guardarGasto(gastoEliminado);

        renderGastos(paginaPrevia);
        renderPaginacionGastos();

        gastoEliminado = null;
        toast.remove();
      }
    });

    setTimeout(() => toast.remove(), 5000);
  }

  function eliminarToastExistente() {
    const anterior = document.querySelector('.toast-exito');
    if (anterior) anterior.remove();
  }
});