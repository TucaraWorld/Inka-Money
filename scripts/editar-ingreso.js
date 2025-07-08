document.addEventListener('DOMContentLoaded', function () {
  const cuerpo = document.getElementById('cuerpoTablaIngresos');
  if (!cuerpo) return;

  cuerpo.addEventListener('click', function (e) {
    if (e.target.classList.contains('editar-fila')) {
      const fila = e.target.closest('tr');
      // Get values from the row and data attributes
      const fecha = fila.children[1].textContent.trim();
      const categoria = fila.children[2].textContent.trim();
      const cantidad = fila.children[3].textContent.trim().replace('S/. ', '');
      const descripcion = fila.dataset.descripcion || '';
      const frecuencia = fila.dataset.frecuencia || 'Única vez';

      document.getElementById('editarMonto').value = cantidad;
      document.getElementById('editarCategoria').value = categoria;
      document.getElementById('editarDescripcion').value = descripcion;
      document.getElementById('editarFrecuencia').value = frecuencia;
      document.getElementById('editarFecha').value = fecha;

      window.filaEditandoIngreso = fila;

      const modal = new bootstrap.Modal(document.getElementById('modalEditarIngreso'));
      modal.show();
    }
  });

  // Initialize datepicker for the edit modal
  if (window.jQuery && $('#editarFecha').datepicker) {
    $('#editarFecha').datepicker({
      format: 'dd/mm/yyyy',
      language: 'es',
      autoclose: true,
      todayHighlight: true
    });
  }

  const form = document.getElementById('formEditarIngreso');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fila = window.filaEditandoIngreso;
      if (!fila) return;

      const nuevoMonto = document.getElementById('editarMonto').value;
      const nuevaCategoria = document.getElementById('editarCategoria').value;
      const nuevaDescripcion = document.getElementById('editarDescripcion').value;
      const nuevaFrecuencia = document.getElementById('editarFrecuencia').value;
      const nuevaFecha = document.getElementById('editarFecha').value;

      fila.children[1].textContent = nuevaFecha;
      fila.children[2].textContent = nuevaCategoria;
      fila.children[3].textContent = 'S/. ' + parseFloat(nuevoMonto).toFixed(2);

      // Save extra data in data-attributes
      fila.dataset.descripcion = nuevaDescripcion;
      fila.dataset.frecuencia = nuevaFrecuencia;

      bootstrap.Modal.getInstance(document.getElementById('modalEditarIngreso')).hide();
    });
  }
});