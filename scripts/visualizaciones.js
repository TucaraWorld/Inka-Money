document.addEventListener('DOMContentLoaded', function() {
  // Selectores de periodo
  const tipoResumen = document.getElementById('tipoResumen');
  
  // Datos para los gráficos
  const datos = {
    semanal: {
      ingresos: 400,
      gastos: 250,
      balance: 150,
      titulo: 'Resumen semanal (L - D)'
    },
    mensual: {
      ingresos: 3100,
      gastos: 2400,
      balance: 700,
      titulo: 'Resumen mensual'
    }
  };
  let graficoBarras = null;
  function renderizarGraficoBarras(data) {
  const ctx = document.getElementById('graficoBarras').getContext('2d');
  if (graficoBarras) {
    graficoBarras.destroy();
  }
  graficoBarras = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Gastos', 'Balance'],
      datasets: [{
        data: [data.ingresos, data.gastos, data.balance],
        backgroundColor: ['#7ed6df', '#e056fd', '#686de0'],
        borderWidth: 2,
        borderColor: '#222',
        borderRadius: 6,
        barPercentage: 0.95,
        categoryPercentage: 0.7,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: '#e9ecef',
            borderDash: [5, 5],
            lineWidth: 1
          },
          ticks: {
            color: '#222',
            font: { size: 16 }
          },
          max: Math.max(data.ingresos, data.gastos, Math.abs(data.balance), 500)
        },
        y: {
          grid: { display: false },
          ticks: {
            color: '#0a2c53',
            font: { size: 18, style: 'italic' }
          }
        }
      }
    }
  });
}
  // Función para actualizar el gráfico
  function actualizarGrafico(data) {
  // Actualizar resumen
  document.querySelectorAll('.resumen-item .monto')[0].textContent = `S/. ${data.ingresos.toFixed(2)}`;
  document.querySelectorAll('.resumen-item .monto')[1].textContent = `S/. ${data.gastos.toFixed(2)}`;
  document.querySelectorAll('.resumen-item .monto')[2].textContent = `S/. ${data.balance.toFixed(2)}`;
  // Actualizar gráfico
  renderizarGraficoBarras(data);
}

  // Event listeners para los botones
  const btnsPeriodo = document.querySelectorAll('.btn-periodo');
  btnsPeriodo.forEach(btn => {
    btn.addEventListener('click', function() {
      btnsPeriodo.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (this.dataset.periodo === 'semanal') {
        actualizarGrafico(datos.semanal);
      } else {
        actualizarGrafico(datos.mensual);
      }
    });
  });
  

  // Inicializar con vista semanal
  actualizarGrafico(datos.semanal);
});
