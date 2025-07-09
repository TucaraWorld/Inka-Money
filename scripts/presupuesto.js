/*
  presupuesto.js
  Lógica para renderizar, editar, borrar, filtrar y paginar presupuestos.
  Inspirado en gastos.js y filtrar-gastos.js
*/

let filtrosPresupuesto = {
    categoria: null,
    fechaInicio: null,
    fechaFin: null
};

setFiltrosPresupuesto(filtrosPresupuesto);

const registrosPorPaginaPresupuesto = 5;
let paginaActualPresupuesto = 1;

function obtenerPaginaPresupuestos(pagina, presupuestosFiltrados) {
    const inicio = (pagina - 1) * registrosPorPaginaPresupuesto;
    const fin = pagina * registrosPorPaginaPresupuesto;
    return presupuestosFiltrados.slice(inicio, fin);
}

function renderPresupuestos(pagina = 1) {
    const filtros = getFiltrosPresupuesto();
    const presupuestosFiltrados = obtenerPresupuestosFiltrados(filtros);
    const presupuestosPagina = obtenerPaginaPresupuestos(pagina, presupuestosFiltrados);
    const tbody = document.getElementById('presupuestoTableBody');
    tbody.innerHTML = '';

    const warningDiv = document.getElementById('noRecordsWarning');
    const warningText = document.getElementById('noRecordsWarningText');
    if (presupuestosPagina.length === 0) {
        let categoria = filtros.categoria;
        let mensaje = 'No se han registrado presupuestos';
        if (categoria && categoria !== '') {
            mensaje = `No se han registrado presupuestos de ${categoria}.`;
        } else {
            mensaje = 'No se han registrado presupuestos.';
        }
        warningText.textContent = mensaje;
        warningDiv.style.display = 'block';
    } else {
        warningDiv.style.display = 'none';
    }

    // Obtener categorías una sola vez
    const categorias = getCategorias();
    presupuestosPagina.forEach((presupuesto, idx) => {
        const tr = document.createElement('tr');
        // Buscar el nombre de la categoría
        const categoriaObj = categorias.find(cat => cat.id === presupuesto.categoria);
        const categoriaNombre = categoriaObj ? categoriaObj.nombre : 'Sin categoría';
        tr.innerHTML = `
            <td><i class="bi bi-pencil editar-presupuesto" style="cursor:pointer" data-id="${presupuesto.id}"></i></td>
            <td>${categoriaNombre}</td>
            <td>S/. ${Number(presupuesto.limite).toFixed(2)}</td>
            <td>S/. ${Number(presupuesto.actual).toFixed(2)}</td>
            <td><i class="bi bi-trash eliminar-presupuesto" style="cursor:pointer" data-id="${presupuesto.id}"></i></td>
        `;
        tbody.appendChild(tr);
    });

    // Re-ejecutar alertas
    if (window.checkPresupuestos) window.checkPresupuestos();
}

function obtenerPresupuestosFiltrados(filtros = {}) {
    const presupuestos = getPresupuestos();
    let resultado = presupuestos;
    if (filtros.categoria) {
        resultado = resultado.filter(p => p.categoria === Number(filtros.categoria));
    }
    // Filtrar por fecha si hay campos de fecha en presupuestos
    if (filtros.fechaInicio || filtros.fechaFin) {
        resultado = resultado.filter(p => {
            if (!p.fecha) return true; // Si no hay campo fecha, no filtrar
            const fecha = new Date(p.fecha.split('/').reverse().join('/'));
            const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
            const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
            let valido = true;
            if (fechaInicio && fecha < fechaInicio) valido = false;
            if (fechaFin && fecha > fechaFin) valido = false;
            return valido;
        });
    }
    return resultado;
}

function renderPaginacionPresupuestos() {
    const filtros = getFiltrosPresupuesto();
    const presupuestosFiltrados = obtenerPresupuestosFiltrados(filtros);
    const totalPaginas = Math.ceil(presupuestosFiltrados.length / registrosPorPaginaPresupuesto);
    const paginacion = document.querySelector('.pagination-presupuesto');
    paginacion.innerHTML = '';

    const paginaAnterior = document.createElement('li');
    paginaAnterior.classList.add('page-item');
    paginaAnterior.innerHTML = `<a class="page-link" href="#" onclick="irPaginaPresupuesto(${paginaActualPresupuesto - 1}, ${totalPaginas})">‹</a>`;
    paginacion.appendChild(paginaAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const paginaItem = document.createElement('li');
        paginaItem.classList.add('page-item');
        if (i === paginaActualPresupuesto) {
            paginaItem.classList.add('active');
        }
        paginaItem.innerHTML = `<a class="page-link" href="#" onclick="irPaginaPresupuesto(${i}, ${totalPaginas})">${i}</a>`;
        paginacion.appendChild(paginaItem);
    }

    const paginaSiguiente = document.createElement('li');
    paginaSiguiente.classList.add('page-item');
    paginaSiguiente.innerHTML = `<a class="page-link" href="#" onclick="irPaginaPresupuesto(${paginaActualPresupuesto + 1}, ${totalPaginas})">›</a>`;
    paginacion.appendChild(paginaSiguiente);
}

function irPaginaPresupuesto(pagina, totalPaginas) {
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActualPresupuesto = pagina;
    renderPresupuestos(paginaActualPresupuesto);
    renderPaginacionPresupuestos();
}

// Filtros (similar a gastos)
document.addEventListener('DOMContentLoaded', function() {
    renderPresupuestos(paginaActualPresupuesto);
    renderPaginacionPresupuestos();

    // Editar presupuesto
    document.getElementById('presupuestoTableBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('editar-presupuesto')) {
            const id = e.target.getAttribute('data-id');
            abrirModalEditarPresupuesto(id);
        }
        if (e.target.classList.contains('eliminar-presupuesto')) {
            const id = e.target.getAttribute('data-id');
            confirmarEliminarPresupuesto(id);
        }
    });
});


// Modal editar presupuesto
function abrirModalEditarPresupuesto(id) {
    const presupuesto = getPresupuestos().find(p => p.id === Number(id));
    if (!presupuesto) return;
    document.getElementById('editar-presupuesto-limite').value = presupuesto.limite;
    document.getElementById('formEditarPresupuesto').onsubmit = function(e) {
        e.preventDefault();
        const nuevoLimite = document.getElementById('editar-presupuesto-limite').value;
        if (nuevoLimite === '' || isNaN(nuevoLimite) || Number(nuevoLimite) < 0) {
            document.getElementById('error-editar-presupuesto-limite').textContent = 'Ingrese un límite válido';
            return;
        }
        actualizarPresupuesto(id, nuevoLimite);
        renderPresupuestos(paginaActualPresupuesto);
        renderPaginacionPresupuestos();
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditarPresupuesto'));
        modal.hide();
    };
    document.getElementById('error-editar-presupuesto-limite').textContent = '';
    var modal = new bootstrap.Modal(document.getElementById('modalEditarPresupuesto'));
    modal.show();
}

// Confirmar eliminar presupuesto
function confirmarEliminarPresupuesto(id) {
    if (confirm('¿Desea eliminar este presupuesto?')) {
        eliminarPresupuesto(id);
        renderPresupuestos(paginaActualPresupuesto);
        renderPaginacionPresupuestos();
    }
}
