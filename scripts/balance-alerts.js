/*
  balance-alerts.js
  Logic for showing alerts based on presupuesto limits.
*/

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('presupuestoTableBody');
    const alertContainer = document.getElementById('presupuesto-alert-container');
    const ahorrosImg = document.querySelector('.presupuesto-img-container');

    function clearAlerts() {
        alertContainer.innerHTML = '';
    }

    function showAlert(type, header, body) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-presupuesto-alert alert-${type}`;
        alertDiv.innerHTML = `
            <div class="alert-header">
                <span class="alert-icon">${type === 'danger' ? '!!' : '!'}</span>
                <strong>${header}</strong>
                <button type="button" class="close-alert" aria-label="Cerrar">&times;</button>
            </div>
            <div class="alert-body">${body}</div>
        `;
        alertContainer.appendChild(alertDiv);
        alertDiv.querySelector('.close-alert').onclick = function() {
            alertDiv.remove();
            // If no more alerts, show ahorros image
            if (alertContainer.children.length === 0) {
                ahorrosImg.style.display = '';
            } else {
                ahorrosImg.style.display = 'none';
            }
        };
    }

    
    function checkPresupuestos() {
        clearAlerts();
        let foundAlert = false;
        // Loop through table rows (skip header)
        Array.from(tableBody.querySelectorAll('tr')).forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length < 4) return;
            // Ahora la columna 1 es editar, columna 2 es nombre de categoría, 3 es límite, 4 es actual
            const categoria = tds[1].textContent.trim();
            const limite = parseFloat(tds[2].textContent.replace('S/.', '').replace(',', '').trim());
            const actual = parseFloat(tds[3].textContent.replace('S/.', '').replace(',', '').trim());

            if (isNaN(limite) || isNaN(actual)) return;
            if (actual > limite) {
                showAlert('danger', '¡Exceso!', `Te has excedido en S/. ${(actual-limite).toLocaleString('es-PE', {minimumFractionDigits:2})} soles en el presupuesto de ${categoria}.`);
                foundAlert = true;
            } else if (actual >= 0.85 * limite) {
                showAlert('warning', '¡Cuidado!', `Estás a S/. ${(limite-actual).toLocaleString('es-PE', {minimumFractionDigits:2})} de pasarte de tu presupuesto de ${categoria}.`);
                foundAlert = true;
            }
        });
        // Show/hide ahorros image
        if (foundAlert) {
            ahorrosImg.style.display = 'none';
        } else {
            ahorrosImg.style.display = '';
        }
    }

    // Run on load and after presupuestos are rendered
    checkPresupuestos();
    // Expose for other scripts if needed
    window.checkPresupuestos = checkPresupuestos;
});
