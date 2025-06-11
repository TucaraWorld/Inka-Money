
document.addEventListener('DOMContentLoaded', function() {
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroTiempo = document.getElementById('filtroTiempo');
  const tabla = document.getElementById('tablaMetas');
  const filas = tabla.querySelectorAll('tbody tr');

  function filtrarTabla() {
    const categoria = filtroCategoria.value;
    const tiempo = filtroTiempo.value;

    filas.forEach(fila => {
      const tdCategoria = fila.children[0].textContent.trim();
      const tdTiempo = fila.children[2].textContent.trim();

      const coincideCategoria = !categoria || tdCategoria === categoria;
      const coincideTiempo = !tiempo || tdTiempo === tiempo;

      fila.style.display = (coincideCategoria && coincideTiempo) ? '' : 'none';
    });
  }

  filtroCategoria.addEventListener('change', filtrarTabla);
  filtroTiempo.addEventListener('change', filtrarTabla);
});