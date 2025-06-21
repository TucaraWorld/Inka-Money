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

});