// Número de registros por página
const registrosPorPagina = 5;

let paginaActual = 1;

function obtenerPagina(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return getIngresos().slice(inicio, fin);
}

// Función para renderizar los ingresos en la tabla
function renderIngresos(pagina = 1) {
    const ingresosPagina = obtenerPagina(pagina);
    const ingresosBody = document.getElementById('cuerpoTablaIngresos');

    ingresosBody.innerHTML = '';

    ingresosBody.innerHTML = ingresosPagina.map(ingreso => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${ingreso.fecha}</td>
            <td>${categorias.find(cat => cat.id === ingreso.categoria)?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${ingreso.monto.toFixed(2)}</td>
            <td>${ingreso.descripcion}</td>
            <td>${ingreso.frecuencia}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor: pointer;"></i></td>
        </tr>
    `).join('');
}

// Función para renderizar los botones de paginación
function renderPaginacion(regIngresos = getIngresos()) {
    const totalPaginas = Math.ceil(regIngresos.length / registrosPorPagina);
    //console.log(`Total de páginas: ${totalPaginas}`);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    // Crear el botón "anterior"
    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    // Crear los botones de las páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        if (i === paginaActual) {
            paginaItem.classList.add('page-item', 'active');
        }
        else {
            paginaItem.classList.add('page-item');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    // Crear el botón "siguiente"
    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPagina(${paginaActual + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

//Función para ir a la página seleccionada
function irPagina(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderIngresos(paginaActual);
    renderPaginacion();
}

// Inicializar la paginación
renderIngresos(paginaActual);
renderPaginacion();

// Función para mostrar el Toast de éxito
function mostrarToastExitoRegistro() {
    const prev = document.querySelector('.toast-exito');
    if (prev) prev.remove();

    const template = document.getElementById('register-income-template'); 
    const toastElement = template.content.cloneNode(true).children[0];

    document.body.appendChild(toastElement);

    setTimeout(() => toastElement.remove(), 5000);
}

//Registrar un ingreso
const formAgregarIngreso = document.getElementById('formAgregarIngreso');

// Abrir modal para agregar
document.getElementById('btnAgregarIngreso').addEventListener('click', function () {
    formAgregarIngreso.reset();
    const selectAgregarCategoria = document.getElementById('agregar-categoria');
    selectAgregarCategoria.innerHTML = '<option value="">Seleccione una opción</option>';
    categorias.forEach(categoria => {
        if (categoria.user_id === parseInt(idUsuarioActivo)) {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectAgregarCategoria.appendChild(option);
        }
    }
    );
    new bootstrap.Modal(document.getElementById('modalAgregarIngreso')).show();
});

formAgregarIngreso.addEventListener('submit', function (e) {
    e.preventDefault();

    const monto = document.getElementById('agregar-monto');
    const categoria = document.getElementById('agregar-categoria');
    const descripcion = document.getElementById('agregar-descripcion');
    const frecuencia = document.getElementById('agregar-frecuencia');

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
        renderIngresos();
        renderPaginacion();
            
        bootstrap.Modal.getInstance(document.getElementById('modalAgregarIngreso')).hide();

        mostrarToastExitoRegistro();
    }
        
});
