document.addEventListener('DOMContentLoaded', function () {
  const cuerpo = document.getElementById('cuerpoTablaCategorias');
  let editando = null;

  // Abrir modal para agregar
  document.getElementById('btnAgregarCategoria').addEventListener('click', function () {
    editando = null;
    document.getElementById('modalCategoriaLabel').textContent = 'Agregar Categoría';
    document.getElementById('formCategoria').reset();
    document.getElementById('colorCategoria').value = '#7ed6df';
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
  });

  // Abrir modal para editar
  cuerpo.addEventListener('click', function (e) {
    if (e.target.classList.contains('editar-categoria')) {
      editando = e.target.closest('tr');
      document.getElementById('modalCategoriaLabel').textContent = 'Editar Categoría';
      document.getElementById('nombreCategoria').value = editando.children[1].textContent.trim();
      document.getElementById('descripcionCategoria').value = editando.children[2].textContent.trim();
      document.getElementById('colorCategoria').value = editando.dataset.color || '#7ed6df';
      new bootstrap.Modal(document.getElementById('modalCategoria')).show();
    }
  });

  // Guardar categoría (agregar o editar)
  document.getElementById('formCategoria').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreCategoria').value;
    const descripcion = document.getElementById('descripcionCategoria').value;
    const color = document.getElementById('colorCategoria').value;

    if (editando) {
      editando.children[1].textContent = nombre;
      editando.children[2].textContent = descripcion;
      editando.dataset.color = color;
    } else {
      const tr = document.createElement('tr');
      tr.dataset.color = color;
      tr.innerHTML = `
        <td><i class="bi bi-pencil editar-categoria" style="cursor:pointer"></i></td>
        <td>${nombre}</td>
        <td>${descripcion}</td>
        <td><i class="bi bi-trash eliminar-categoria" style="cursor:pointer"></i></td>
      `;
      cuerpo.appendChild(tr);
    }
    bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
  });

  // Eliminar categoría con confirmación
  cuerpo.addEventListener('click', function (e) {
    if (e.target.classList.contains('eliminar-categoria')) {
      const fila = e.target.closest('tr');
      eliminarConfirmacionExistente();
      const template = document.getElementById('confirmacion-categoria-template');
      const confirmacion = template.content.cloneNode(true);
      const filaConfirmacion = confirmacion.querySelector('tr');
      fila.parentNode.insertBefore(filaConfirmacion, fila.nextSibling);

      filaConfirmacion.querySelector('.cancelar-eliminacion').onclick = () => filaConfirmacion.remove();
      filaConfirmacion.querySelector('.confirmar-eliminacion').onclick = () => {
        fila.remove();
        filaConfirmacion.remove();
      };
    }
  });

  function eliminarConfirmacionExistente() {
    const confirmacion = document.querySelector('.fila-confirmacion');
    if (confirmacion) confirmacion.remove();
  }
});