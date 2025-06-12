document.addEventListener('DOMContentLoaded', function() {
  // Selectores de periodo
  const btnSemanal = document.querySelector('[data-periodo="semanal"]');
  const btnMensual = document.querySelector('[data-periodo="mensual"]');
  
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

  // Función para actualizar el gráfico
  function actualizarGrafico(data) {
    // Calcular el valor máximo para la escala
    // Calcula el máximo como el siguiente múltiplo de 100 mayor o igual al dato mayor
let maxVal = Math.max(data.ingresos, data.gastos, Math.abs(data.balance));
maxVal = Math.ceil(maxVal / 100) * 100;
if (maxVal < 500) maxVal = 500;
    
    // Actualizar resumen
    document.querySelector('.resumen-container h3').textContent = data.titulo;
    document.querySelectorAll('.resumen-item .monto')[0].textContent = `S/. ${data.ingresos.toFixed(2)}`;
    document.querySelectorAll('.resumen-item .monto')[1].textContent = `S/. ${data.gastos.toFixed(2)}`;
    document.querySelectorAll('.resumen-item .monto')[2].textContent = `S/. ${data.balance.toFixed(2)}`;
    
    // Actualizar barras del gráfico
    document.querySelector('.barra.ingreso').style.width = `${(data.ingresos / maxVal) * 100}%`;
    document.querySelector('.barra.gasto').style.width = `${(data.gastos / maxVal) * 100}%`;
    document.querySelector('.barra.balance').style.width = `${(Math.abs(data.balance) / maxVal) * 100}%`;
    
    // Actualizar valores numéricos
    document.querySelectorAll('.valor-barra')[0].textContent = data.ingresos;
    document.querySelectorAll('.valor-barra')[1].textContent = data.gastos;
    document.querySelectorAll('.valor-barra')[2].textContent = Math.abs(data.balance);
    
    // Actualizar eje X
    const valoresX = [0, maxVal/5, (maxVal/5)*2, (maxVal/5)*3, (maxVal/5)*4, maxVal];
    document.querySelectorAll('.valor-x').forEach((el, i) => {
      el.textContent = valoresX[i];
    });
  }

  // Event listeners para los botones
  btnSemanal.addEventListener('click', function() {
    if (!this.classList.contains('active')) {
      this.classList.add('active');
      btnMensual.classList.remove('active');
      actualizarGrafico(datos.semanal);
    }
  });

  btnMensual.addEventListener('click', function() {
    if (!this.classList.contains('active')) {
      this.classList.add('active');
      btnSemanal.classList.remove('active');
      actualizarGrafico(datos.mensual);
    }
  });

  // Inicializar con vista semanal
  actualizarGrafico(datos.semanal);
});
