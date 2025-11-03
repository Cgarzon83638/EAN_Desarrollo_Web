// lector.js - Maneja la vista de lectura

let tamañoActual = 'mediano';
let modoOscuroActivo = false;

document.addEventListener('DOMContentLoaded', () => {
    cargarArticulo();
    configurarControles();
    configurarBarraProgreso();
});

// Cargar el artículo desde el parámetro URL
async function cargarArticulo() {
    // Obtener el ID del artículo desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const articuloId = parseInt(urlParams.get('id'));
    
    if (!articuloId) {
        mostrarError('No se especificó un artículo');
        return;
    }
    
    try {
        const response = await fetch('data/articulos.json');
        const data = await response.json();
        
        const articulo = data.articulos.find(a => a.id === articuloId);
        
        if (articulo) {
            mostrarArticulo(articulo);
        } else {
            mostrarError('Artículo no encontrado');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el artículo');
    }
}

// Mostrar el artículo en la página
function mostrarArticulo(articulo) {
    const contenedor = document.getElementById('articuloContenido');
    
    contenedor.innerHTML = `
        <h1>${articulo.titulo}</h1>
        <div class="metadata">
            <span>Por ${articulo.autor}</span> · 
            <span>${articulo.fecha}</span> · 
            <span>${articulo.tiempoLectura} de lectura</span>
        </div>
        <div class="contenido-articulo">
            ${articulo.contenido}
        </div>
    `;
    
    // Actualizar tiempo estimado
    document.getElementById('tiempoLectura').textContent = 
        `Tiempo estimado: ${articulo.tiempoLectura}`;
    
    // Agregar clase para tamaño de texto
    contenedor.classList.add('texto-mediano');
}

// Configurar controles (tamaño de texto y modo oscuro)
function configurarControles() {
    // Botón de tamaño de texto
    const btnTamaño = document.getElementById('btnTamañoTexto');
    if (btnTamaño) {
        btnTamaño.addEventListener('click', cambiarTamañoTexto);
    }
    
    // Botón de modo oscuro
    const btnModoOscuro = document.getElementById('btnModoOscuro');
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', toggleModoOscuro);
    }
}

// Cambiar tamaño del texto
function cambiarTamañoTexto() {
    const contenedor = document.getElementById('articuloContenido');
    
    // Remover clases anteriores
    contenedor.classList.remove('texto-pequeno', 'texto-mediano', 'texto-grande');
    
    // Ciclar entre tamaños
    if (tamañoActual === 'pequeno') {
        tamañoActual = 'mediano';
        contenedor.classList.add('texto-mediano');
    } else if (tamañoActual === 'mediano') {
        tamañoActual = 'grande';
        contenedor.classList.add('texto-grande');
    } else {
        tamañoActual = 'pequeno';
        contenedor.classList.add('texto-pequeno');
    }
}

// Toggle modo oscuro
function toggleModoOscuro() {
    modoOscuroActivo = !modoOscuroActivo;
    
    if (modoOscuroActivo) {
        document.body.classList.add('modo-oscuro');
        document.getElementById('btnModoOscuro').textContent = '☀️';
    } else {
        document.body.classList.remove('modo-oscuro');
        document.getElementById('btnModoOscuro').textContent = '🌙';
    }
}

// Barra de progreso de lectura
function configurarBarraProgreso() {
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const progreso = (scrollTop / documentHeight) * 100;
        
        document.getElementById('progressBar').style.width = progreso + '%';
    });
}

// Mostrar error
function mostrarError(mensaje) {
    const contenedor = document.getElementById('articuloContenido');
    contenedor.innerHTML = `
        <div class="text-center py-5">
            <p class="text-danger">${mensaje}</p>
            <a href="biblioteca.html" class="btn btn-primary mt-3">Volver a la biblioteca</a>
        </div>
    `;
}