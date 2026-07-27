
import { fetchHeroes } from "./api.js";
import { loader } from "./iu.js";
import { renderHeroes } from "./iu.js";
import { abrirModal } from "./iu.js";
import { cerrarModal } from "./iu.js";
import { iniciarCarrusel } from "./iu.js";

let heroesFiltrados = [];
let heroesGlobal = [];
let paginaActual = 1;

const heroesPorPagina = 8;

// DOMContentLoaded para asegurar que el HTML esté listo
document.addEventListener("DOMContentLoaded", async () => {
  const $heroesGrid = document.getElementById("heroes-grid");
  const buscador = document.getElementById("buscador");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");
  const first = document.getElementById("first");
  const last = document.getElementById("last");
  

  //Loader true = están cargando los heroes
  loader(true);

  //fetch de los heroes
  const heroes = await fetchHeroes();

  //Loader false = ya cargaron los heroes
  loader(false);

  //Guardamos heroes en array
  heroesGlobal = heroes;
  heroesFiltrados = heroes; 

  cargarEditoriales(heroes);
  actualizarVista($heroesGrid);
  iniciarCarrusel();
  
  // si hay heroes
  if (heroes && heroes.length > 0) {
    heroesGlobal = heroes; // 🔥 GUARDAR
    actualizarVista($heroesGrid); // 🔥 usar paginación
  } else {
    $heroesGrid.innerHTML =
      '<div class="cell">No se encontraron heroes. Intente nuevamente</div>';
  }

  

  //Paginación
  next.addEventListener("click", () => {
    const totalPaginas = Math.ceil(heroesFiltrados.length / heroesPorPagina);
    if (paginaActual < totalPaginas) {
      paginaActual++;
      actualizarVista($heroesGrid);
    }
  });

  prev.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      actualizarVista($heroesGrid);
    }
  });
  
  // Filtros
  document.getElementById("buscador").addEventListener("input", () => {
    aplicarFiltros();
    actualizarVista($heroesGrid);
  });

  document.getElementById("tipo").addEventListener("change", () => {
    aplicarFiltros();
    actualizarVista($heroesGrid);
  });

  document.getElementById("editorial").addEventListener("change", () => {
    aplicarFiltros();
    actualizarVista($heroesGrid);
  });

  document.getElementById("orden").addEventListener("change", () => {
    paginaActual = 1;
    actualizarVista($heroesGrid);
  });

  document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("buscador").value = "";
    document.getElementById("tipo").value = "todos";
    document.getElementById("editorial").value = "todos";
    paginaActual = 1;
    aplicarFiltros();
    actualizarVista($heroesGrid);
  });

  // Modal
  document.querySelector("#hero-modal .modal-background").addEventListener("click", cerrarModal);
  document.querySelector("#hero-modal .modal-close").addEventListener("click", cerrarModal);
  
  // Botones de primera y última página
  first.addEventListener("click", () => {
    paginaActual = 1;
    actualizarVista($heroesGrid);
  });

  last.addEventListener("click", () => {
  const totalPaginas = Math.ceil(heroesFiltrados.length / heroesPorPagina);
  paginaActual = totalPaginas;
  actualizarVista($heroesGrid);
  });

  //termina domContentLoaded
});

// Funciones
function obtenerHeroesPaginados(heroes) {
  const inicio = (paginaActual - 1) * heroesPorPagina;
  return heroes.slice(inicio, inicio + heroesPorPagina);
}

function actualizarVista($heroesGrid) {
  const heroesOrdenados = ordenarHeroes([...heroesFiltrados]);
  const heroesPagina = obtenerHeroesPaginados(heroesOrdenados);
  renderHeroes(heroesPagina, $heroesGrid);
  const totalPaginas = Math.ceil(heroesFiltrados.length / heroesPorPagina);
  document.getElementById("pagina-info").textContent =
    `Página ${paginaActual} de ${totalPaginas} | ${heroesFiltrados.length} resultados`;
  actualizarBotones(totalPaginas);
}

function aplicarFiltros() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const tipo = document.getElementById("tipo").value;
  const editorial = document.getElementById("editorial").value;

  heroesFiltrados = heroesGlobal.filter(hero => {
    const coincideNombre = hero.name.toLowerCase().includes(texto);
    const coincideTipo =
      tipo === "todos" ||
      hero.biography.alignment.toLowerCase() === tipo;

    const coincideEditorial =
      editorial === "todos" ||
      (hero.biography.publisher &&
        hero.biography.publisher.toLowerCase().includes(editorial));

    return (
      coincideNombre &&
      coincideTipo &&
      coincideEditorial
    );
  });
  paginaActual = 1;
}

function cargarEditoriales(heroes) {
  const select = document.getElementById("editorial");

  // sacar publishers
  const editoriales = heroes
    .map(hero => hero.biography.publisher)
    .filter(Boolean); // elimina null o undefined

  // eliminar duplicados
  const unicas = [...new Set(editoriales)];

  // limpiar (dejar "todos")
  select.innerHTML = `<option value="todos">Todas las editoriales</option>`;

  // agrega todas las editoriales al select
  unicas.forEach(edit => {
    const option = document.createElement("option");
    option.value = edit.toLowerCase();
    option.textContent = edit;
    select.appendChild(option);
  });
}

function ordenarHeroes(heroes) {
  const select = document.getElementById("orden");
  if (!select) return heroes;
  const orden = select.value;
  if (orden === "az") {
    return heroes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (orden === "za") {
    return heroes.sort((a, b) => b.name.localeCompare(a.name));
  }
  return heroes;
}

function actualizarBotones(totalPaginas) {
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const first = document.getElementById("first");
  const last = document.getElementById("last");

  // primera página
  if (paginaActual === 1) {
    prev.disabled = true;
    first.disabled = true;
  } else {
    prev.disabled = false;
    first.disabled = false;
  }

  // última página
  if (paginaActual === totalPaginas) {
    next.disabled = true;
    last.disabled = true;
  } else {
    next.disabled = false;
    last.disabled = false;
  }
}