document.addEventListener('DOMContentLoaded', function () {
    // Obtener los elementos que contienen el saldo, la tarjeta y la alerta
    const saldoAmountTotal = document.getElementById('saldoAmountTotal');
    const saldoCardTotal = document.getElementById('saldoCardTotal');
    const saldoAmountCategoria = document.getElementById('saldoAmountCategoria');
    const saldoCardCategoria = document.getElementById('saldoCardCategoria');
    const noRecordsWarning = document.getElementById('noRecordsWarning');
    const hideElements = document.querySelectorAll('.hide-when-zero');
    const contentElements = document.querySelectorAll('.content');

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

    verificarSaldo();


});