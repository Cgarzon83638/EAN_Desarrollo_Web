// main.js - Maneja la biblioteca de artículos

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecutar en la página de biblioteca
    if (document.getElementById('listaArticulos')) {
        cargarArticulos();
        configurarFiltros();
    }
});

// Función para cargar artículos desde el JSON
async function cargarArticulos() {
    try {
        const response = await fetch('data/articulos.json');
        const data = await response.json();
        
        mostrarArticulos(data.articulos);
        
        // Guardar artículos globalmente para los filtros
        window.todosLosArticulos = data.articulos;
    } catch (error) {
        console.error('Error al cargar artículos:', error);
        mostrarError();
    }
}

// Función para mostrar los artículos en la página
function mostrarArticulos(articulos) {
    const contenedor = document.getElementById('listaArticulos');
    
    if (articulos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">No se encontraron artículos con ese filtro.</p>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = '';
    
    articulos.forEach(articulo => {
        const categoriaColor = obtenerColorCategoria(articulo.categoria);
        
        const card = `
            <div class="col-md-6 col-lg-4 mb-4 fade-in">
                <div class="card articulo-card">
                    <div class="card-body">
                        <span class="badge ${categoriaColor} categoria-badge mb-2">
                            ${capitalizarCategoria(articulo.categoria)}
                        </span>
                        <h5 class="card-title">${articulo.titulo}</h5>
                        <p class="text-muted small mb-2">
                            <span>Por ${articulo.autor}</span> · 
                            <span>${articulo.tiempoLectura}</span>
                        </p>
                        <p class="card-text text-muted">${articulo.resumen}</p>
                        <a href="lector.html?id=${articulo.id}" class="btn btn-primary btn-sm mt-2">
                            Leer artículo →
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.innerHTML += card;
    });
}

// Función para configurar los filtros
function configurarFiltros() {
    const filtroSelect = document.getElementById('filtroCategoria');
    
    if (filtroSelect) {
        filtroSelect.addEventListener('change', (e) => {
            const categoriaSeleccionada = e.target.value;
            
            if (categoriaSeleccionada === 'todos') {
                mostrarArticulos(window.todosLosArticulos);
            } else {
                const articulosFiltrados = window.todosLosArticulos.filter(
                    articulo => articulo.categoria === categoriaSeleccionada
                );
                mostrarArticulos(articulosFiltrados);
            }
        });
    }
}

// Función auxiliar para obtener color según categoría
function obtenerColorCategoria(categoria) {
    const colores = {
        'bienestar': 'bg-success',
        'productividad': 'bg-primary',
        'mindfulness': 'bg-info',
        'tecnologia': 'bg-warning'
    };
    
    return colores[categoria] || 'bg-secondary';
}

// Función auxiliar para capitalizar la categoría
function capitalizarCategoria(categoria) {
    const nombres = {
        'bienestar': 'Bienestar Digital',
        'productividad': 'Productividad',
        'mindfulness': 'Mindfulness',
        'tecnologia': 'Tecnología Consciente'
    };
    
    return nombres[categoria] || categoria;
}

// Función para mostrar error
function mostrarError() {
    const contenedor = document.getElementById('listaArticulos');
    contenedor.innerHTML = `
        <div class="col-12 text-center py-5">
            <p class="text-danger">Error al cargar los artículos. Por favor, intenta de nuevo.</p>
        </div>
    `;
}