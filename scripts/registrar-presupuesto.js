document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formNuevoPresupuesto');
  const templateToast = document.getElementById('toast-template-presupuesto');
  const selectAgregarCategoria = document.getElementById('agregar-categoria-presupuesto');

  // Llenar select de categorías dinámicamente usando getCategorias()
  selectAgregarCategoria.innerHTML = '<option value="">Seleccione una opción</option>';
  if (typeof getCategorias === 'function') {
    const categoriasUsuario = getCategorias();
    categoriasUsuario.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectAgregarCategoria.appendChild(option);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const monto = document.getElementById('agregar-monto-presupuesto');
    const categoria = document.getElementById('agregar-categoria-presupuesto');

    let errores = 0;
    document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');

    if (!monto.value.trim() || isNaN(parseFloat(monto.value)) || parseFloat(monto.value) <= 0) {
      document.getElementById('error-monto-presupuesto').textContent = 'El monto es obligatorio y debe ser mayor a 0';
      errores++;
    }

    if (!categoria.value.trim()) {
      document.getElementById('error-categoria-presupuesto').textContent = 'Selecciona una categoría';
      errores++;
    }


    if (errores === 0) {
      const nuevoPresupuesto = {
        id: getPresupuestos().length + 1,
        user_id: parseInt(localStorage.getItem('idUsuarioActivo')),
        categoria: Number(categoria.value),
        limite: parseFloat(monto.value),
        actual: 0
      };

      guardarPresupuesto(nuevoPresupuesto);
      mostrarToastExito();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.assign('presupuesto.html');
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
