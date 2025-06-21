const renderIngresos = (lista) => {
    const ingresosBody = document.getElementById('cuerpoTablaIngresos');
    ingresosBody.innerHTML = '';
    
    ingresosBody.innerHTML = lista.map(ingreso => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${ingreso.fecha}</td>
            <td>${ingreso.categoria}</td>
            <td>S/. ${ingreso.monto.toFixed(2)}</td>
            <td>${ingreso.descripcion}</td>
            <td>${ingreso.frecuencia}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor: pointer;"></i></td>
        </tr>
    `).join('');
}

renderIngresos(getIngresos());


// Función para mostrar el Toast de éxito
function mostrarToastExitoRegistro() {
    // Eliminar cualquier toast previo antes de mostrar uno nuevo
    const prev = document.querySelector('.toast-exito');
    if (prev) prev.remove(); // Eliminar el toast de éxito existente

    // Clonar el template del toast
    const template = document.getElementById('register-income-template'); // Obtener el template del toast
    const toastElement = template.content.cloneNode(true).children[0];// Clonar el contenido del template

    // Agregar el nuevo toast al contenedor (body o donde desees)
    document.body.appendChild(toastElement);

    setTimeout(() => toastElement.remove(), 5000);
}

//Registrar un ingreso
const formAgregarIngreso = document.getElementById('formAgregarIngreso');

// Abrir modal para agregar
document.getElementById('btnAgregarIngreso').addEventListener('click', function () {
  formAgregarIngreso.reset();
  new bootstrap.Modal(document.getElementById('modalAgregarIngreso')).show();
});

formAgregarIngreso.addEventListener('submit', function (e) {
    e.preventDefault();

    const monto = document.getElementById('agregar-monto');
    const categoria = document.getElementById('agregar-categoria');
    const descripcion = document.getElementById('agregar-descripcion');
    const frecuencia = document.getElementById('agregar-frecuencia');
    const exito = document.getElementById('mensaje-exito');

    let errores = 0;
    document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');
    //exito.classList.add('d-none');

    if (!monto.value.trim()) {
        document.getElementById('error-monto').textContent = 'El monto es obligatorio';
        errores++;
    }

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
        //exito.classList.remove('d-none');
        //this.reset();
        const nuevoIngreso = {
            id: getIngresos().length + 1,
            user_id: 1, //Asumiendo que el usuario activo tiene user_id = 1
            fecha: new Date().toLocaleDateString('es-ES'),
            categoria: categoria.value,
            monto: parseFloat(monto.value),
            descripcion: descripcion.value,
            frecuencia: frecuencia.value
        }

        guardarIngreso(nuevoIngreso);            
        renderIngresos(getIngresos());
            
        bootstrap.Modal.getInstance(document.getElementById('modalAgregarIngreso')).hide();

        mostrarToastExitoRegistro();
    }
        
});
