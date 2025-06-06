document.getElementById('formGasto').addEventListener('submit', function (e) {
  e.preventDefault();

  const monto = document.getElementById('monto');
  const categoria = document.getElementById('categoria');
  const fecha = document.getElementById('fecha');
  const exito = document.getElementById('mensaje-exito');

  let errores = 0;
  document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');
  exito.classList.add('d-none');

  if (!monto.value.trim()) {
    document.getElementById('error-monto').textContent = 'El monto es obligatorio';
    errores++;
  }

  if (!categoria.value.trim()) {
    document.getElementById('error-categoria').textContent = 'Selecciona una categoría';
    errores++;
  }

  if (!fecha.value.trim()) {
    document.getElementById('error-fecha').textContent = 'Selecciona una fecha';
    errores++;
  }

  if (errores === 0) {
    exito.classList.remove('d-none');
    this.reset();
  }
});

document.getElementById('cerrarFormulario').addEventListener('click', () => {
  window.history.back(); // o redirige con location.href
});
