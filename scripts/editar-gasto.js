document.addEventListener('DOMContentLoaded', function () {
  const cuerpo = document.getElementById('cuerpoTablaGastos');
  if (!cuerpo) return;

  cuerpo.addEventListener('click', function (e) {
    if (e.target.classList.contains('bi-pencil')) {
      const fila = e.target.closest('tr');
      // Get values from the row and data attributes
      const fecha = fila.children[1].textContent.trim();
      const categoria = fila.children[2].textContent.trim();
      const cantidad = fila.children[3].textContent.trim().replace('S/. ', '');
      const descripcion = fila.dataset.descripcion || '';

      document.getElementById('editarMontoGasto').value = cantidad;
      document.getElementById('editarCategoriaGasto').value = categoria;
      document.getElementById('editarDescripcionGasto').value = descripcion;
      document.getElementById('editarFechaGasto').value = fecha;

      window.filaEditandoGasto = fila;

      const modal = new bootstrap.Modal(document.getElementById('modalEditarGasto'));
      modal.show();
    }
  });

  // Initialize datepicker for the edit modal (if you use one)
  if (window.jQuery && $('#editarFechaGasto').datepicker) {
    $('#editarFechaGasto').datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true,
      todayHighlight: true
    });
  }

  const form = document.getElementById('formEditarGasto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fila = window.filaEditandoGasto;
      if (!fila) return;

      const nuevoMonto = document.getElementById('editarMontoGasto').value;
      const nuevaCategoria = document.getElementById('editarCategoriaGasto').value;
      const nuevaDescripcion = document.getElementById('editarDescripcionGasto').value;
      const nuevaFecha = document.getElementById('editarFechaGasto').value;

      fila.children[1].textContent = nuevaFecha;
      fila.children[2].textContent = nuevaCategoria;
      fila.children[3].textContent = 'S/. ' + parseFloat(nuevoMonto).toFixed(2);

      // Save extra data in data-attributes
      fila.dataset.descripcion = nuevaDescripcion;

      bootstrap.Modal.getInstance(document.getElementById('modalEditarGasto')).hide();
    });
  }
});