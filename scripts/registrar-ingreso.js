document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formNuevoIngreso');
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
    const frecuencia = document.getElementById('agregar-frecuencia');

    let errores = 0;
    document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');
    //exito.classList.add('d-none');

    const montoValor = monto.value.trim();
    if (!montoValor || isNaN(parseFloat(montoValor)) || parseFloat(montoValor) <= 0) {
      document.getElementById('error-monto').textContent = 'El monto debe ser un número válido y mayor a 0';
      console.log("Monto inválido:", montoValor);
      errores++;
    }

    console.log("Monto válido:", montoValor);
    if (!categoria.value.trim()) {
        document.getElementById('error-categoria').textContent = 'Selecciona una categoría';
        errores++;
    }

    if (!descripcion.value.trim()) {
        descripcion.value = 'Sin descripción';
    }

    if (!frecuencia.value.trim()) {
        document.getElementById('error-frecuencia').textContent = 'Selecciona una frecuencia válida';
        errores++;
    }

    if (errores === 0) {
        const nuevoIngreso = {
            id: getIngresos().length + 1,
            user_id: parseInt(idUsuarioActivo),
            fecha: new Date().toLocaleDateString('es-ES'),
            categoria: parseInt(categoria.value),
            monto: parseFloat(monto.value),
            descripcion: descripcion.value,
            frecuencia: frecuencia.value
        }

        console.log(nuevoIngreso);

        guardarIngreso(nuevoIngreso);            
        //renderIngresos();
        //renderPaginacion();


        // Si todo es válido, mostrar toast de éxito y redirigir
        mostrarToastExito();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          window.location.href = 'ingresos.html';
        }, 2000);
            
        //bootstrap.Modal.getInstance(document.getElementById('modalAgregarIngreso')).hide();

        //mostrarToastExitoRegistro();
    }
        
});


    // Mostrar toast de éxito
    function mostrarToastExito() {
      const toast = templateToast.content.cloneNode(true).children[0];
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

});
