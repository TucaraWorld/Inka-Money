const registrosPorPagina = 5;
let paginaActual = 1;

function obtenerPaginaGastos(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = pagina * registrosPorPagina;
    return getGastos().slice(inicio, fin);
}

function renderGastos(pagina = 1) {
    const gastosPagina = obtenerPaginaGastos(pagina);
    const gastosBody = document.getElementById('cuerpoTablaGastos');

    gastosBody.innerHTML = gastosPagina.map(gasto => `
        <tr>
            <td><i class="bi bi-pencil editar-fila" style="cursor:pointer"></i></td>
            <td>${gasto.fecha}</td>
            <td>${categorias.find(cat => cat.id === Number(gasto.categoria))?.nombre ?? 'Sin categoría'}</td>
            <td>S/. ${gasto.monto.toFixed(2)}</td>
            <td><i class="bi bi-trash eliminar-fila" style="cursor:pointer"></i></td>
        </tr>
    `).join('');
}

function renderPaginacionGastos() {
    const totalPaginas = Math.ceil(getGastos().length / registrosPorPagina);
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${paginaActual - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        paginaItem.classList.add('page-item');
        if (i === paginaActual) {
            paginaItem.classList.add('page-item', 'active');
        }
        else {
            paginaItem.classList.add('page-item');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPaginaGasto(${paginaActual + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

function irPaginaGasto(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderGastos(paginaActual);
    renderPaginacionGastos();
}

renderGastos(paginaActual);
renderPaginacionGastos();

function mostrarToastExitoGasto() {
    const anterior = document.querySelector('.toast-registro');
    if (anterior) anterior.remove();

    const template = document.getElementById('register-expense-template');
    const toast = template.content.cloneNode(true).children[0];

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

const formAgregarGasto = document.getElementById('formAgregarGasto');

document.getElementById('btnAgregarGasto').addEventListener('click', () => {
    formAgregarGasto.reset();
    const selectAgregarCategoria = document.getElementById('agregar-categoria-gasto');
    selectAgregarCategoria.innerHTML = '<option value="">Seleccione una opción</option>';
    getCategorias().forEach(categoria => {
        if (categoria.user_id === parseInt(localStorage.getItem('idUsuarioActivo'))) {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectAgregarCategoria.appendChild(option);
        }
    });
    new bootstrap.Modal(document.getElementById('modalAgregarGasto')).show();
});

formAgregarGasto.addEventListener('submit', function (e) {
    e.preventDefault();
    const monto = document.getElementById('agregar-monto-gasto');
    const categoria = document.getElementById('agregar-categoria-gasto');

    let errores = 0;
    document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');

    if (!monto.value.trim()) {
        document.getElementById('error-monto-gasto').textContent = 'El monto es obligatorio';
        errores++;
    }

    if (!categoria.value.trim()) {
        document.getElementById('error-categoria-gasto').textContent = 'Selecciona una categoría';
        errores++;
    }

    if (errores === 0) {
        const nuevoGasto = {
            id: getGastos().length + 1,
            user_id: parseInt(localStorage.getItem('idUsuarioActivo')),
            fecha: new Date().toLocaleDateString('es-ES'),
            categoria: parseInt(categoria.value),
            monto: parseFloat(monto.value)
        };

        guardarGasto(nuevoGasto);
        renderGastos();
        renderPaginacionGastos();

        bootstrap.Modal.getInstance(document.getElementById('modalAgregarGasto')).hide();
        mostrarToastExitoGasto();
    }
});
