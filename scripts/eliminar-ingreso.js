document.addEventListener('DOMContentLoaded', function () {
  const tabla = document.getElementById('tablaIngresos');
  const templateConfirmacion = document.getElementById('confirmacion-template');
  const templateToast = document.getElementById('toast-template');
  let filaEliminada = null;
  let datosFila = null;

  tabla.addEventListener('click', function (e) {
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

    filaConfirmacion.querySelector('.cancelar-eliminacion').addEventListener('click', () => {
      fila.classList.remove('table-active');
      filaConfirmacion.remove();
    });

    filaConfirmacion.querySelector('.confirmar-eliminacion').addEventListener('click', () => {
      datosFila = [...fila.children].map(td => td.innerHTML);
      filaEliminada = fila;
      fila.remove();
      filaConfirmacion.remove();
      mostrarToastExito();
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

  function mostrarToastExito() {
    eliminarToastExistente();
    const toast = templateToast.content.cloneNode(true).children[0];
    document.body.appendChild(toast);

    toast.querySelector('.btn-deshacer').addEventListener('click', function () {
      if (filaEliminada && datosFila) {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = datosFila.map(cell => `<td>${cell}</td>`).join('');
        tabla.querySelector('tbody').prepend(nuevaFila);
        filaEliminada = null;
        datosFila = null;
        toast.remove();
      }
    });

    setTimeout(() => toast.remove(), 5000);
  }

  function eliminarToastExistente() {
    const prev = document.querySelector('.toast-exito');
    if (prev) prev.remove();
  }
});
