document.addEventListener('DOMContentLoaded', function () {
    const saldoAmountTotal = document.getElementById('saldoAmountTotal');
    const saldoCardTotal = document.getElementById('saldoCardTotal');
    const saldoDateElement = document.querySelector('.saldo-date');
    const toggleButtonTotal = document.getElementById('toggle-saldo-total');

    // Fecha actual
    const fechaActual = new Date();
    const opciones = { month: 'long', year: 'numeric' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
    saldoDateElement.textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    // Simulación de ingresos y gastos (reemplaza por tu lógica real)
    const ingresos = JSON.parse(localStorage.getItem('ingresos') || '[]');
    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');

    function calcularSaldoTotal() {
        const totalIngresos = ingresos.reduce((total, ingreso) => total + (ingreso.monto || 0), 0);
        const totalGastos = gastos.reduce((total, gasto) => total + (gasto.monto || 0), 0);
        return totalIngresos - totalGastos;
    }

    // Inicialmente oculto
    saldoAmountTotal.textContent = '- - - - -';

    function actualizarToggleButtonTotal() {
        if (saldoAmountTotal.textContent === '- - - - -') {
            toggleButtonTotal.innerHTML = 'Mostrar saldo <i class="bi bi-eye"></i>';
        } else {
            toggleButtonTotal.innerHTML = 'Ocultar saldo <i class="bi bi-eye-slash"></i>';
        }
    }

    actualizarToggleButtonTotal();

    toggleButtonTotal.addEventListener('click', function () {
        if (saldoAmountTotal.textContent === '- - - - -') {
            saldoAmountTotal.textContent = `S/. ${calcularSaldoTotal().toFixed(2)}`;
        } else {
            saldoAmountTotal.textContent = '- - - - -';
        }
        actualizarToggleButtonTotal();
    });
});