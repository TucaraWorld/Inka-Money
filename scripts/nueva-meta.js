document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formNuevaMeta');
  const tiempoSelect = document.getElementById('tiempo');
  const personalizadoContainer = document.getElementById('personalizadoContainer');
  const montoInput = document.getElementById('monto');
  const montoError = document.getElementById('montoError');
  const templateToast = document.getElementById('toast-template');

  // Mostrar/ocultar campo personalizado según selección
  tiempoSelect.addEventListener('change', function() {
    if (this.value === 'personalizado') {
      personalizadoContainer.style.display = 'block';
    } else {
      personalizadoContainer.style.display = 'none';
    }
  });

  // Validación del formulario
  form.addEventListener('submit', function(e) {
  e.preventDefault();

  const montoValue = montoInput.value.trim();
  const monto = parseFloat(montoValue.replace(',', '.'));

  if (!montoValue || isNaN(monto) || monto <= 0) {
    // No agregues is-invalid ni muestres el mensaje debajo
    mostrarToastError("¡Ingresa un monto valido para establecer la meta!");
    montoInput.value = ""; // Limpia el campo para volver a ingresar
    montoInput.focus();
    // Aquí NO retornes, el usuario puede intentar guardar de nuevo
    return;
  }

    // Validar tiempo personalizado
    if (tiempoSelect.value === 'personalizado' && 
        (!document.getElementById('diasPersonalizado').value || 
         parseInt(document.getElementById('diasPersonalizado').value) <= 0)) {
      alert('Por favor ingrese un número válido de días');
      return;
    }

    
    // Si todo es válido, mostrar toast de éxito y redirigir
    mostrarToastExito();
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = 'metas-ahorro.html';
    }, 2000);
  });

  // Mostrar toast de éxito
  function mostrarToastExito() {
    const toast = templateToast.content.cloneNode(true).children[0];
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  function mostrarToastError(mensaje) {
  // Elimina cualquier toast de error anterior
  document.querySelectorAll('.toast-error').forEach(e => e.remove());

  const template = document.getElementById('toast-error-template');
  const toast = template.content.cloneNode(true);
  toast.querySelector('.mensaje-toast-error').textContent = mensaje;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.querySelectorAll('.toast-error').forEach(e => e.remove());
  }, 2500);
}
  // Validación en tiempo real del monto
  montoInput.addEventListener('input', function() {
    const montoValue = this.value.trim();
    const monto = parseFloat(montoValue.replace(',', '.'));
    if (montoValue && !isNaN(monto) && monto > 0) {
      this.classList.remove('is-invalid');
      montoError.style.display = "none";
    }
  })});
