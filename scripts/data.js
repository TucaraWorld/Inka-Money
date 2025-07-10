// ---- PRESUPUESTOS ----
const presupuestos = [
    // Ejemplo de estructura, puedes poblar dinámicamente
    { id: 1, user_id: 1, categoria: 1, limite: 9500, actual: 8400 },
    { id: 2, user_id: 1, categoria: 2, limite: 8300, actual: 8400 },
    { id: 3, user_id: 1, categoria: 3, limite: 5000, actual: 3200 },
    { id: 4, user_id: 1, categoria: 4, limite: 2000, actual: 1500 },
    { id: 5, user_id: 1, categoria: 3, limite: 1200, actual: 900 },
    { id: 6, user_id: 1, categoria: 2, limite: 1200, actual: 400 }
];

if (!localStorage.getItem('presupuestos')) {
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

function getPresupuestos() {
    let regPresupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
    let filtrado = regPresupuestos.filter(p => p.user_id === parseInt(idUsuarioActivo));
    return filtrado;
}

function guardarPresupuesto(nuevoPresupuesto) {
    const presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
    presupuestos.push(nuevoPresupuesto);
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

function actualizarPresupuesto(id, nuevoLimite) {
    let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
    presupuestos = presupuestos.map(p => p.id === Number(id) ? { ...p, limite: Number(nuevoLimite) } : p);
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

function eliminarPresupuesto(id) {
    let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
    presupuestos = presupuestos.filter(p => p.id !== Number(id));
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

// Filtros para presupuesto
function setFiltrosPresupuesto(filtros) {
    localStorage.setItem('filtrosPresupuesto', JSON.stringify(filtros));
}

function getFiltrosPresupuesto() {
    const filtrosGuardados = localStorage.getItem('filtrosPresupuesto');
    return filtrosGuardados ? JSON.parse(filtrosGuardados) : { categoria: null, fechaInicio: null, fechaFin: null };
}
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

const idUsuarioActivo = localStorage.getItem('idUsuarioActivo') || 1;

if (!localStorage.getItem('idUsuarioActivo')) {
    localStorage.setItem('idUsuarioActivo', idUsuarioActivo);
}

const setUsuarioActivo = (id) => {
    idUsuarioActivo = id;
    localStorage.setItem('idUsuarioActivo', id);
};

const getUsuarioActivo = () => {
    return usuarios.find(usuario => usuario.id === parseInt(idUsuarioActivo));
};

console.log('Usuario activo:', getUsuarioActivo());

const gastos = [
    {
        id: 1,
        user_id: 1,
        fecha: "20/04/2025",
        categoria: 1,
        monto: 50.00
    },
    {
        id: 2,
        user_id: 1,
        fecha: "18/04/2025",
        categoria: 2,
        monto: 40.00
    },
    {
        id: 3,
        user_id: 1,
        fecha: "16/04/2025",
        categoria: 3,
        monto: 50.00
    },
    {
        id: 4,
        user_id: 1,
        fecha: "15/04/2025",
        categoria: 4,
        monto: 35.00
    },
    {
        id: 5,
        user_id: 1,
        fecha: "14/04/2025",
        categoria: 1,
        monto: 45.00
    }
];


if (!localStorage.getItem('gastos')) {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

// Obtener todos los ingresos desde localStorage
function getGastos() {
    let regGastos = JSON.parse(localStorage.getItem('gastos')) || [];
    let filtradoGastos = regGastos.filter(gasto => gasto.user_id === parseInt(idUsuarioActivo));
    //console.log(filtradoGastos);
    filtradoGastos.sort((a, b) => {
        const fechaA = a.fecha.split('/').reverse().join('-');
        const fechaB = b.fecha.split('/').reverse().join('-');
        const fechaComparison = new Date(fechaB) - new Date(fechaA);

        if (fechaComparison === 0) {
            return b.id - a.id;
        }

        return new Date(fechaB) - new Date(fechaA);
    });

    return filtradoGastos;
}

function guardarGasto(nuevoGasto) {
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.push(nuevoGasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

function eliminarGasto(id) {
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos = gastos.filter(gasto => gasto.id !== id);
    localStorage.setItem('gastos', JSON.stringify(gastos));
}


const ingresos = [
    {
        id: 1,
        user_id: 1,
        fecha: "05/04/2025",
        categoria: 3,
        monto: 100.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 2,
        user_id: 1,
        fecha: "01/04/2025",
        categoria: 2,
        monto: 50.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 3,
        user_id: 1,
        fecha: "01/04/2025",
        categoria: 1,
        monto: 250.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 4,
        user_id: 1,
        fecha: "15/03/2025",
        categoria: 4,
        monto: 230.00,
        descripcion: "Sin descripción",
        frecuencia: "Única vez"
    },
    {
        id: 5,
        user_id: 1,
        fecha: "06/03/2025",
        categoria: 1,
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
    let regIngresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    let filtradoIngresos = regIngresos.filter(ingreso => ingreso.user_id === parseInt(idUsuarioActivo));
    //console.log(filtradoIngresos);
    filtradoIngresos.sort((a, b) => {
        const fechaA = a.fecha.split('/').reverse().join('-');
        const fechaB = b.fecha.split('/').reverse().join('-');
        const fechaComparison = new Date(fechaB) - new Date(fechaA);

        if (fechaComparison === 0) {
            return b.id - a.id;
        }

        return new Date(fechaB) - new Date(fechaA);
    });

    return filtradoIngresos;
}

// Guardar un nuevo ingreso en localStorage
function guardarIngreso(nuevoIngreso) {
    const ingresos = getIngresos(); 
    ingresos.push(nuevoIngreso);
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
}

function eliminarIngreso(id) {
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    ingresos = ingresos.filter(ingreso => ingreso.id !== id);
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
}

const categorias = [
    {
        id: 1,
        user_id: 1,
        nombre: "Comida",
        descripcion: "Gastos en alimentos y restaurantes"
    },
    {
        id: 2,
        user_id: 1,
        nombre: "Transporte",
        descripcion: "Movilidad y transporte público"
    },
    {
        id: 3,
        user_id: 1,
        nombre: "Educación",
        descripcion: "Mensualidad, materiales y otros relacionados con lal universidad"
    },
    {
        id: 4,
        user_id: 1,
        nombre: "Salud",
        descripcion: "Citas médicas y medicamentos"
    },
    {
        id: 5,
        user_id: 1,
        nombre: "Hobbies",
        descripcion: "Salidas con amigos, cine, videojuegos, etc."
    }
];


if (!localStorage.getItem('categorias')) {
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

function getCategorias() {
    let regCategorias = JSON.parse(localStorage.getItem('categorias')) || [];
    let filtradoCategorias = regCategorias.filter(categoria => categoria.user_id === parseInt(idUsuarioActivo));
    console.log(filtradoCategorias);

    return filtradoCategorias;
}

function guardarCategoria(nuevaCategoria) {
    const categorias = getCategorias(); 
    categorias.push(nuevaCategoria);
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

function setFiltros(filtros) {
    localStorage.setItem('filtros', JSON.stringify(filtros));  // Guardamos los filtros en el localStorage
}

// Función para obtener los filtros desde localStorage
function getFiltros() {
    const filtrosGuardados = localStorage.getItem('filtros');
    return filtrosGuardados ? JSON.parse(filtrosGuardados) : { fechaInicio: null, fechaFin: null, categoria: null };  // Si no hay filtros, devolvemos un objeto vacío
}

let filtros = {
    fechaInicio: null,
    fechaFin: null,
    categoria: null
};

setFiltros(filtros);  // Inicializamos los filtros en localStorage


function setFiltrosGastos(filtros) {
    localStorage.setItem('filtrosGastos', JSON.stringify(filtros));  // Guardamos los filtros en el localStorage
}

// Función para obtener los filtros desde localStorage
function getFiltrosGastos() {
    const filtrosGuardados = localStorage.getItem('filtrosGastos');
    return filtrosGuardados ? JSON.parse(filtrosGuardados) : { fechaInicio: null, fechaFin: null, categoria: null };  // Si no hay filtros, devolvemos un objeto vacío
}

let filtrosGastos = {
    fechaInicio: null,
    fechaFin: null,
    categoria: null
};

setFiltros(filtrosGastos);  // Inicializamos los filtros en localStorage