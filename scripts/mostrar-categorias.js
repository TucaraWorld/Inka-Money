const categorias = ['Comida', 'Transporte', 'Educación', 'Salud', 'Hobbies'];
//categorias = []
const colores = ['#7ed6df', '#e056fd', '#686de0', '#f6e58d', '#30336b'];
const gastos = [250, 20, 1300, 100, 30];

// Handle empty state
if (categorias.length === 0) {
  document.querySelector('section').innerHTML = `
    <div class="text-center py-5">
      <h4 class="mb-4">No hay categorías registradas</h4>
      <a href="formulario-categoria.html" class="btn btn-warning fw-bold" id="btnAddCategory">Agregar categoría</a>
    </div>
  `;
} else {
  // Bar chart
  const canvas = document.getElementById('gastosCategoriaChart');
  const barHeight = 40;
  const chartHeight = Math.max(200, Math.min(categorias.length * barHeight, 600));
  canvas.height = chartHeight;

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categorias,
      datasets: [{
        data: gastos,
        backgroundColor: colores,
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
            color: '#222',
            borderDash: [5, 5],
            lineWidth: 1
          },
          ticks: {
            color: '#222',
            font: { size: 16 }
          },
          max: 1500
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

  // Doughnut chart with percentage labels
  const doughnutCtx = document.getElementById('gastosCategoriaDoughnut').getContext('2d');
  const totalGastos = gastos.reduce((a, b) => a + b, 0);
  new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: categorias,
      datasets: [{
        data: gastos,
        backgroundColor: colores,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      cutout: '70%',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#333',
          font: { weight: 'bold', size: 14 },
          formatter: function(value, context) {
            const percent = ((value / totalGastos) * 100);
            return percent >= 3 ? percent.toFixed(2) + '%' : ''; // Hide if less than 3%
          },
          anchor: 'end',
          align: 'end',
          offset: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 4
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const percent = ((value / totalGastos) * 100).toFixed(2);
              return `${context.label}: ${value} (${percent}%)`;
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  // Custom legend with percentages
  const legend = document.getElementById('doughnutLegend');
  legend.innerHTML = categorias.map((cat, i) => {
    const percent = ((gastos[i] / totalGastos) * 100).toFixed(2);
    return `<li class="mb-2 d-flex align-items-center">
      <span style="display:inline-block;width:18px;height:18px;background:${colores[i]};border-radius:3px;margin-right:10px;"></span>
      <span>${cat}</span>
      <span class="ms-auto fw-bold">${percent}%</span>
    </li>`;
  }).join('');
}