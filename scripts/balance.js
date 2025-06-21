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
    function calcularSaldoTotal() {
        const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
        const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

        const saldo = totalIngresos - totalGastos;

        saldoAmountTotal.textContent = `S/. ${saldo.toFixed(2)}`;
        saldoAmountCategoria.textContent = `S/. ${saldo.toFixed(2)}`;

        console.log(`Saldo Total: S/. ${saldo.toFixed(2)}`);
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
    

    // Obtener los botones de toggle
    const toggleButtonTotal = document.getElementById('toggle-saldo-total');
    const toggleButtonCategoria = document.getElementById('toggle-saldo-categoria');

    // Lógica para el toggle del saldo total
    toggleButtonTotal.addEventListener('click', function() {
        if (saldoAmountTotal.textContent === `S/. ${calcularSaldoTotal().toFixed(2)}`) {
            saldoAmountTotal.textContent = '- - - - -';
        } else {
            saldoAmountTotal.textContent = `S/. ${calcularSaldoTotal().toFixed(2)}`;
        }

        // Después de actualizar, verifica si el saldo es 0
        verificarSaldo();
    });

    // Lógica para el toggle del saldo por categoría
    toggleButtonCategoria.addEventListener('click', function() {
        if (saldoAmountCategoria.textContent === `S/. ${calcularSaldoTotal().toFixed(2)}`) {
            saldoAmountCategoria.textContent = '- - - - -';
        } else {
            saldoAmountCategoria.textContent = `S/. ${calcularSaldoTotal().toFixed(2)}`;
        }

        // Después de actualizar, verifica si el saldo es 0
        verificarSaldo();
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
    document.getElementById('mayorIngresoCard').querySelector('p').textContent = `Para ${mayorIngreso.categoria}`;

    document.getElementById('mayorGastoCard').querySelector('h6').textContent = `S/. ${mayorGasto.monto.toFixed(2)}`;
    document.getElementById('mayorGastoCard').querySelector('p').textContent = `Para ${mayorGasto.categoria}`;

    //Icono
    if (mayorIngreso.monto > mayorGasto.monto) {
        document.getElementById('mayoresLinesCard').querySelector('img').src = 'assets/icons/profit-lines.png';
    } else {
        document.getElementById('mayoresLinesCard').querySelector('img').src = 'assets/icons/loss-lines.png';
    }

    //Actualizar elementos de menor ingreso/gasto
    document.getElementById('menorIngresoCard').querySelector('h6').textContent = `S/. ${menorIngreso.monto.toFixed(2)}`;
    document.getElementById('menorIngresoCard').querySelector('p').textContent = `Para ${menorIngreso.categoria}`;
    
    document.getElementById('menorGastoCard').querySelector('h6').textContent = `S/. ${menorGasto.monto.toFixed(2)}`;
    document.getElementById('menorGastoCard').querySelector('p').textContent = `Para ${menorGasto.categoria}`;

    //Icono
    if (menorIngreso.monto > menorGasto.monto) {
        document.getElementById('menoresLinesCard').querySelector('img').src = 'assets/icons/profit-lines.png';
    } else {
        document.getElementById('menoresLinesCard').querySelector('img').src = 'assets/icons/loss-lines.png';
    }


    // Cards de saldo por categoría
    function calcularSaldoCategoria(categoria) {
        const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
        const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

        const saldo = totalIngresos - totalGastos;

        saldoAmountTotal.textContent = `S/. ${saldo.toFixed(2)}`;
        saldoAmountCategoria.textContent = `S/. ${saldo.toFixed(2)}`;

        console.log(`Saldo Total: S/. ${saldo.toFixed(2)}`);
        return saldo;
    }
});