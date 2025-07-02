document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formNuevoGasto');
  const templateToast = document.getElementById('toast-template');
  const selectAgregarCategoria = document.getElementById('agregar-categoria');

  //selectAgregarCategoria.classList.add('form-select', 'campo');
  selectAgregarCategoria.innerHTML = '<option value="">Seleccione una opción</option>';
  console.log("Categorias: ", categorias);
    categorias.forEach(categoria => {
        if (categoria.user_id === parseInt(idUsuarioActivo)) {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectAgregarCategoria.appendChild(option);
        }
    }
    );

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const monto = document.getElementById('agregar-monto');
    const categoria = document.getElementById('agregar-categoria');
    const descripcion = document.getElementById('agregar-descripcion');

    let errores = 0;
    document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');

    if (!monto.value.trim() || isNaN(parseFloat(monto.value)) || parseFloat(monto.value) <= 0) {
      document.getElementById('error-monto').textContent = 'El monto es obligatorio y debe ser mayor a 0';
      errores++;
    }

    if (!categoria.value.trim()) {
      document.getElementById('error-categoria').textContent = 'Selecciona una categoría';
      errores++;
    }

    if (!descripcion.value.trim()) {
      descripcion.value = 'Sin descripción';
    }

    if (errores === 0) {
      const nuevoGasto = {
        id: getGastos().length + 1,
        user_id: parseInt(localStorage.getItem('idUsuarioActivo')), // Si usas usuarios
        fecha: new Date().toLocaleDateString('es-ES'),
        categoria: categoria.value,
        monto: parseFloat(monto.value),
        descripcion: descripcion.value
      };

      guardarGasto(nuevoGasto);

      mostrarToastExito();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = 'gastos.html';
      }, 2000);
    }
  });

  function mostrarToastExito() {
    const toast = templateToast.content.cloneNode(true).children[0];
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }
});