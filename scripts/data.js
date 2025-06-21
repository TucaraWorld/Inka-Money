const usuarios = [
    {
        id: 1,
        email: 'user1@gmail.com',
        password: 'Admin123',
    },
    {
        id: 2,
        email: 'user2@gmail.com',
        password: 'Admin456',
    }
]

const gastos = [
    {
        id: 1,
        user_id: 1,
        fecha: "20/04/2025",
        categoria: "Comida",
        monto: 50.00
    },
    {
        id: 2,
        user_id: 1,
        fecha: "18/04/2025",
        categoria: "Transporte",
        monto: 40.00
    },
    {
        id: 3,
        user_id: 1,
        fecha: "16/04/2025",
        categoria: "Educación",
        monto: 50.00
    },
    {
        id: 4,
        user_id: 1,
        fecha: "15/04/2025",
        categoria: "Salud",
        monto: 35.00
    },
    {
        id: 5,
        user_id: 1,
        fecha: "14/04/2025",
        categoria: "Comida",
        monto: 45.00
    }
];

const ingresos = [
    {
        id: 1,
        user_id: 1,
        fecha: "05/04/2025",
        categoria: "Educación",
        monto: 100.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 2,
        user_id: 1,
        fecha: "01/04/2025",
        categoria: "Transporte",
        monto: 50.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 3,
        user_id: 1,
        fecha: "01/04/2025",
        categoria: "Comida",
        monto: 250.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 4,
        user_id: 1,
        fecha: "15/03/2025",
        categoria: "Salud",
        monto: 230.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 5,
        user_id: 1,
        fecha: "06/03/2025",
        categoria: "Comida",
        monto: 50.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    }
];

if (!localStorage.getItem('ingresos')) {
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
}

// Obtener todos los ingresos desde localStorage
function getIngresos() {
    const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];

    ingresos.sort((a, b) => {
        // Convertir las fechas a formato ISO (yyyy-MM-dd)
        const fechaA = a.fecha.split('/').reverse().join('-');
        const fechaB = b.fecha.split('/').reverse().join('-');

        // Primero ordenar por fecha
        const fechaComparison = new Date(fechaB) - new Date(fechaA);

        // Si las fechas son iguales, ordenar por ID (o cualquier otro criterio adicional)
        if (fechaComparison === 0) {
            return b.id - a.id;  // Si las fechas son iguales, el ingreso con el ID más alto aparece primero
        }

        // Ordenar las fechas en orden descendente
        return new Date(fechaB) - new Date(fechaA);
    });

    console.log(ingresos);  // Verifica el orden de los ingresos

    return ingresos;
}

// Guardar un nuevo ingreso en localStorage
function guardarIngreso(nuevoIngreso) {
    const ingresos = getIngresos();  // Obtener los ingresos actuales
    ingresos.push(nuevoIngreso);  // Agregar el nuevo ingreso
    localStorage.setItem('ingresos', JSON.stringify(ingresos));  // Guardar el arreglo actualizado
}