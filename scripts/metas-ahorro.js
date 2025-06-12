
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

document.addEventListener("DOMContentLoaded", () => {
  const notificacion = document.getElementById("notificacion-meta");
  const filas = document.querySelectorAll("#tablaMetas tbody tr");

  filas.forEach((fila) => {
    const categoria = fila.children[0].textContent.trim();
    const progresoTexto = fila.querySelector(".progress-bar").textContent.trim();
    const progreso = parseInt(progresoTexto.replace("%", ""));

    if (progreso === 100) {
      mostrarNotificacion("success", "¡Felicidades!", `Haz completado satisfactoriamente tu meta “${categoria}”`);
    } else if (progreso >= 80) {
      mostrarNotificacion("info", "¡Estás muy cerca!", `Solo te faltan ${100 - progreso}% para alcanzar tu meta “${categoria}”`);
    }
  });

  function mostrarNotificacion(tipo, titulo, mensaje) {
    let claseTipo = "alert-info";
    let icono = "bi-info-circle-fill";

    if (tipo === "success") {
      claseTipo = "alert-success";
      icono = "bi-check-circle-fill";
    }

    notificacion.className = `alert ${claseTipo}`;
    notificacion.innerHTML = `
      <i class="bi ${icono}"></i>
      <div class="texto-notificacion">
        <strong>${titulo}</strong>
        <div>${mensaje}</div>
      </div>
    `;
    notificacion.classList.remove("d-none");
  }
});


