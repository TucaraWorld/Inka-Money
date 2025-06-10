document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formPresupuesto').addEventListener('submit', function (e) {
        e.preventDefault();
      
        const monto = document.getElementById('monto');
        const categoria = document.getElementById('categoria');
        const exito = document.getElementById('mensaje-exito');
      
        let errores = 0;
        document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');
        exito.classList.add('d-none');
      
        if (!categoria.value.trim()) {
          document.getElementById('error-categoria').textContent = 'Selecciona una categoría';
          errores++;
        }
      
        if (!monto.value.trim()) {
          document.getElementById('error-monto').textContent = 'El monto es obligatorio';
          errores++;
        }
      
        if (errores === 0) {
          exito.classList.remove('d-none');
  
          // Save to localStorage for balance.html
          const stored = localStorage.getItem('presupuestos');
          let presupuestos = stored ? JSON.parse(stored) : [];
          presupuestos.push({
            categoria: categoria.value,
            limite: monto.value,
            actual: 0 // or monto.value if you want actual = limite initially
          });
          localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
  
          // Insert new row into presupuesto-lista-table
          let tableBody = document.getElementById('presupuesto-lista-table');
          if (!tableBody) {
            // Try to find the table and create tbody if missing
            const table = document.querySelector('table');
            if (table) {
              tableBody = document.createElement('tbody');
              tableBody.id = 'presupuesto-lista-table';
              table.appendChild(tableBody);
            }
          }
          if (tableBody) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
              <td>${categoria.value}</td>
              <td>${monto.value}</td>
            `;
            tableBody.appendChild(newRow);
          } else {
            console.warn('No se encontró el tbody con id "presupuesto-lista-table".');
          }
  
          this.reset();
        }
      });
      localStorage.removeItem('presupuestos'); // Clear previous data for testing purposes
      document.getElementById('cerrarFormulario').addEventListener('click', () => {
        window.history.back();
      });
    });