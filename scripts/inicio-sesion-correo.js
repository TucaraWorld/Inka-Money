document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Ocultar mensaje de error previo
    errorMessage.classList.add('d-none');

    // Obtener valores
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validar email
    if (!isValidEmail(email)) {
      showError('Por favor ingrese un email válido.');
      return;
    }

    // Validar contraseña
    if (password !== 'Admin123*') {
      showError('¡Error en la validación de datos!');
      return;
    }

    // Si todo está bien, simula inicio de sesión
    window.location.href = 'home.html';
  });
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.querySelector('i').classList.toggle('bi-eye-slash');
    });
  }

  function showError(msg) {
  // Elimina alertas previas si existen
    const prevAlert = document.getElementById('alertaEmergente');
    if (prevAlert) prevAlert.remove();

    // Crea la alerta Bootstrap personalizada
    const alertDiv = document.createElement('div');
    alertDiv.id = 'alertaEmergente';
    alertDiv.className = 'alerta-error alert alert-dismissible fade show position-fixed start-50 translate-middle-x';
    alertDiv.style.zIndex = '2000';
    alertDiv.style.top = '385px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.maxWidth = '378px';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>${msg}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);

    // Oculta el mensaje de error clásico si existe
    if (errorMessage) errorMessage.classList.add('d-none');
  }

  function isValidEmail(email) {
    // Validación básica de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});