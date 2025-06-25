document.addEventListener('DOMContentLoaded', function () {
    // Obtener los elementos que contienen el saldo, la tarjeta y la alerta
    const saldoAmountTotal = document.getElementById('saldoAmountTotal');
    const saldoCardTotal = document.getElementById('saldoCardTotal');
    const saldoAmountCategoria = document.getElementById('saldoAmountCategoria');
    const saldoCardCategoria = document.getElementById('saldoCardCategoria');
    const noRecordsWarning = document.getElementById('noRecordsWarning');
    const hideElements = document.querySelectorAll('.hide-when-zero');
    const contentElements = document.querySelectorAll('.content');

    const saldoDateElement = document.querySelector('.saldo-date'); 
    const fechaActual = new Date();
    const opciones = { month: 'long', year: 'numeric' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
    saldoDateElement.textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    const ingresos = getIngresos();
    const gastos = getGastos();

    // Función para calcular el saldo
    function calcularSaldoTotal(opt) {
        const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
        const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

        const saldo = totalIngresos - totalGastos;

        if (opt === 1) saldoAmountTotal.textContent = `S/. ${saldo.toFixed(2)}`;
        else saldoAmountCategoria.textContent = `S/. ${saldo.toFixed(2)}`;

        //console.log(`Saldo Total: S/. ${saldo.toFixed(2)}`);
        return saldo;
    }

    // Función para verificar el saldo
    function verificarSaldo() {
        const saldoTotal = parseFloat(saldoAmountTotal.textContent.replace('S/. ', '').replace(',', '').trim());
        const saldoCategoria = parseFloat(saldoAmountCategoria.textContent.replace('S/. ', '').replace(',', '').trim());

        // Verificar si el saldo es 0
        if (saldoTotal === 0 || saldoCategoria === 0) {
            noRecordsWarning.style.display = 'block';

            hideElements.forEach(function (element) {
                element.classList.add('hide');
                element.classList.remove('show');
            });

            // Hacer que las tarjetas sean grises
            saldoCardTotal.classList.add('gris');
            saldoCardCategoria.classList.add('gris');

            saldoAmountTotal.textContent = "S/. 0";
            saldoAmountCategoria.textContent = "S/. 0";

            contentElements.forEach(function (element) {
                element.style.height = '100vh';
            });

        } else {
            noRecordsWarning.style.display = 'none';

            hideElements.forEach(function (element) {
                element.classList.remove('hide');
                element.classList.add('show');
            });

            // Restablecer el color de las tarjetas
            saldoCardTotal.classList.remove('gris');
            saldoCardCategoria.classList.remove('gris');

            contentElements.forEach(function (element) {
                element.style.height = '100%';
            });
        }
    }

    calcularSaldoTotal();
    verificarSaldo();
    
    // Ocultar el saldo desde el inicio
    saldoAmountTotal.textContent = '- - - - -';
    saldoAmountCategoria.textContent = '- - - - -';
    // Obtener los botones de toggle
    const toggleButtonTotal = document.getElementById('toggle-saldo-total');
    const toggleButtonCategoria = document.getElementById('toggle-saldo-categoria');
    // Cambiar el texto y el icono del botón según el estado del saldo total
    function actualizarToggleButtonTotal() {
        if (saldoAmountTotal.textContent === '- - - - -') {
            toggleButtonTotal.innerHTML = 'Mostrar saldo <i class="bi bi-eye"></i>';
        } else {
            toggleButtonTotal.innerHTML = 'Ocultar saldo <i class="bi bi-eye-slash"></i>';
        }
    }

    // Cambiar el texto y el icono del botón según el estado del saldo por categoría
    function actualizarToggleButtonCategoria() {
        if (saldoAmountCategoria.textContent === '- - - - -') {
            toggleButtonCategoria.innerHTML = 'Mostrar saldo <i class="bi bi-eye"></i>';
        } else {
            toggleButtonCategoria.innerHTML = 'Ocultar saldo <i class="bi bi-eye-slash"></i>';
        }
    }

    // Inicializar el texto de los botones
    actualizarToggleButtonTotal();
    actualizarToggleButtonCategoria();
    // Lógica para el toggle del saldo total
    toggleButtonTotal.addEventListener('click', function() {
        if (saldoAmountTotal.textContent === `- - - - -`) {
            saldoAmountTotal.textContent = `S/. ${calcularSaldoTotal(1).toFixed(2)}`;
        } else {
            saldoAmountTotal.textContent = `- - - - -`;
        }

        // Después de actualizar, verifica si el saldo es 0
        verificarSaldo();
        actualizarToggleButtonTotal();
    });

    // Lógica para el toggle del saldo por categoría
    toggleButtonCategoria.addEventListener('click', function() {
        if (saldoAmountCategoria.textContent === `- - - - -`) {
            saldoAmountCategoria.textContent = `S/. ${calcularSaldoTotal(2).toFixed(2)}`;
        } else {
            saldoAmountCategoria.textContent = `- - - - -`;
        }

        // Después de actualizar, verifica si el saldo es 0
        verificarSaldo();
        actualizarToggleButtonCategoria();
    });


    // Cards de mayor y menor de ingreso/gasto
    //Obtener el mayor y menor ingreso
    const mayorIngreso = ingresos.reduce((max, ingreso) => ingreso.monto > max.monto ? ingreso : max, ingresos[0]);
    const menorIngreso = ingresos.reduce((min, ingreso) => ingreso.monto < min.monto ? ingreso : min, ingresos[0]);

    //Obtener el mayor y menor gasto
    const mayorGasto = gastos.reduce((max, gasto) => gasto.monto > max.monto ? gasto : max, gastos[0]);
    const menorGasto = gastos.reduce((min, gasto) => gasto.monto < min.monto ? gasto : min, gastos[0]);

    //Actualizar elementos de mayor ingreso/gasto
    document.getElementById('mayorIngresoCard').querySelector('h6').textContent = `S/. ${mayorIngreso.monto.toFixed(2)}`;
    document.getElementById('mayorIngresoCard').querySelector('p').textContent = `Para ${categorias.find(cat => cat.id === mayorIngreso.categoria)?.nombre ?? 'Sin categoría'}`;

    document.getElementById('mayorGastoCard').querySelector('h6').textContent = `S/. ${mayorGasto.monto.toFixed(2)}`;
    document.getElementById('mayorGastoCard').querySelector('p').textContent = `Para ${categorias.find(cat => cat.id === mayorGasto.categoria)?.nombre ?? 'Sin categoría'}`;

    //Icono
    if (mayorIngreso.monto > mayorGasto.monto) {
        document.getElementById('mayoresLinesCard').querySelector('img').src = 'assets/icons/profit-lines.png';
    } else {
        document.getElementById('mayoresLinesCard').querySelector('img').src = 'assets/icons/loss-lines.png';
    }

    //Actualizar elementos de menor ingreso/gasto
    document.getElementById('menorIngresoCard').querySelector('h6').textContent = `S/. ${menorIngreso.monto.toFixed(2)}`;
    document.getElementById('menorIngresoCard').querySelector('p').textContent = `Para ${categorias.find(cat => cat.id === menorIngreso.categoria)?.nombre ?? 'Sin categoría'}`;
    
    document.getElementById('menorGastoCard').querySelector('h6').textContent = `S/. ${menorGasto.monto.toFixed(2)}`;
    document.getElementById('menorGastoCard').querySelector('p').textContent = `Para ${categorias.find(cat => cat.id === menorGasto.categoria)?.nombre ?? 'Sin categoría'}`;

    //Icono
    if (menorIngreso.monto > menorGasto.monto) {
        document.getElementById('menoresLinesCard').querySelector('img').src = 'assets/icons/profit-lines.png';
    } else {
        document.getElementById('menoresLinesCard').querySelector('img').src = 'assets/icons/loss-lines.png';
    }


    // Cards de saldo por categoría
    function calcularSaldoCategoria(categoriaId) {
        const totalIngresos = ingresos.reduce((total, ingreso) => ingreso.categoria === categoriaId ? total + ingreso.monto : total + 0, 0);
        const totalGastos = gastos.reduce((total, gasto) => gasto.categoria === categoriaId ? total + gasto.monto : total + 0, 0);

        const saldo = totalIngresos - totalGastos;
        return `S/. ${saldo.toFixed(2)}`;
    }

    function renderCardsPorCategoria() {    
        const regCategorias = getCategorias();   
        if (regCategorias.length >= 1) {
            const saldoCategoria1 = document.getElementById('categoriaCard1');
            saldoCategoria1.querySelector('h6').textContent = calcularSaldoCategoria(regCategorias[0].id);
            saldoCategoria1.querySelector('h5').textContent = regCategorias[0].nombre;
        }
        else {
            document.getElementById('categoriaCard1').remove();
        }
        if (regCategorias.length >= 2) {
            const saldoCategoria2 = document.getElementById('categoriaCard2');
            saldoCategoria2.querySelector('h6').textContent = calcularSaldoCategoria(regCategorias[1].id);
            saldoCategoria2.querySelector('h5').textContent = regCategorias[1].nombre;
        }
        else {
            document.getElementById('categoriaCard2').remove();
        }
        
        const container = document.getElementById('containerCardsCategoria');
        container.innerHTML = ''; // Limpia contenido anterior
                
        for (let i = 2; i < regCategorias.length; i += 3) {            
            const fila = document.createElement('div');
            fila.className = 'cards-row';

            const grupo = regCategorias.slice(i, i + 3);

            grupo.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'card';

                const h5 = document.createElement('h5');
                h5.textContent = cat.nombre;

                const h6 = document.createElement('h6');
                h6.textContent = calcularSaldoCategoria(cat.id);

                card.appendChild(h5);
                card.appendChild(h6);
                fila.appendChild(card);
            });

            container.appendChild(fila);
        }
        
    }

    renderCardsPorCategoria();
    

});

// Renderizar presupuestos desde localStorage
function renderPresupuestosFromStorage() {
    const tableBody = document.getElementById('presupuestoTableBody');
    // Elimina filas previas agregadas por JS
    Array.from(tableBody.querySelectorAll('tr[data-storage="true"]')).forEach(tr => tr.remove());

    const stored = localStorage.getItem('presupuestos');
    if (stored) {
        const presupuestos = JSON.parse(stored);
        presupuestos.forEach(p => {
            const row = document.createElement('tr');
            row.setAttribute('data-storage', 'true');
            row.innerHTML = `
                <td>${p.categoria}</td>
                <td>S/. ${Number(p.limite).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                <td>S/. ${Number(p.actual).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Mostrar toast de éxito para presupuesto
function mostrarToastPresupuesto() {
    const prev = document.querySelector('.toast-exito');
    if (prev) prev.remove();
    const template = document.getElementById('toast-presupuesto-template');
    if (!template) return;
    const toastElement = template.content.cloneNode(true).children[0];
    // Insertar el toast dentro de balance-container
    const container = document.querySelector('.balance-container');
    if (container) {
        container.appendChild(toastElement);
    } else {
        document.body.appendChild(toastElement);
    }
    setTimeout(() => toastElement.remove(), 3000);
}

// Inicialización de presupuestos y eventos del modal

document.addEventListener('DOMContentLoaded', function () {
    renderPresupuestosFromStorage();

    // Activar pestaña "Presupuesto" si el hash es #presupuesto-content
    if (window.location.hash === '#presupuesto-content') {
        const tab = document.querySelector('.nav-option#presupuesto-tab');
        if (tab) tab.click();
    }

    // Lógica del modal de presupuesto
    const btnAgregarPresupuesto = document.getElementById('btnAgregarPresupuesto');
    const modalAgregarPresupuesto = new bootstrap.Modal(document.getElementById('modalAgregarPresupuesto'));
    const formAgregarPresupuesto = document.getElementById('formAgregarPresupuesto');
    const exitoPresupuesto = document.getElementById('mensaje-exito-presupuesto');

    btnAgregarPresupuesto.addEventListener('click', function () {
        formAgregarPresupuesto.reset();
        document.querySelectorAll('#modalAgregarPresupuesto .mensaje-error').forEach(el => el.textContent = '');
        exitoPresupuesto.classList.add('d-none');
        modalAgregarPresupuesto.show();
    });

    formAgregarPresupuesto.addEventListener('submit', function (e) {
        e.preventDefault();
        const categoria = document.getElementById('presupuesto-categoria');
        const monto = document.getElementById('presupuesto-monto');
        let errores = 0;
        document.getElementById('error-presupuesto-categoria').textContent = '';
        document.getElementById('error-presupuesto-monto').textContent = '';
        exitoPresupuesto.classList.add('d-none');
        if (!categoria.value.trim()) {
            document.getElementById('error-presupuesto-categoria').textContent = 'Selecciona una categoría';
            errores++;
        }
        if (!monto.value.trim() || isNaN(monto.value) || Number(monto.value) <= 0) {
            document.getElementById('error-presupuesto-monto').textContent = 'El monto es obligatorio y debe ser mayor a 0';
            errores++;
        }
        if (errores === 0) {
            // Guardar en localStorage
            const stored = localStorage.getItem('presupuestos');
            let presupuestos = stored ? JSON.parse(stored) : [];
            presupuestos.push({
                categoria: categoria.value,
                limite: Number(monto.value),
                actual: 0
            });
            localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
            // Actualizar tabla
            renderPresupuestosFromStorage();
            // Mostrar toast
            mostrarToastPresupuesto();
            modalAgregarPresupuesto.hide();
        }
    });
});