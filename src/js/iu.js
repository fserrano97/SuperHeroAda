
// Loader
export function loader(data) {
  const $loading = document.getElementById("loading");
  if (data) {
    $loading.style.display = "flex";
  } else {
    $loading.style.display = "none"; 
  }
}

//Renderizado de heroes
export function renderHeroes(heroes, gridHeroes) {
  gridHeroes.innerHTML = "";

  // si NO hay héroes
  if (heroes.length === 0) {
    gridHeroes.style.display = "flex"; 
    gridHeroes.style.justifyContent = "center";
    gridHeroes.style.alignItems = "center";
    gridHeroes.style.minHeight = "300px"; 
    gridHeroes.innerHTML =
      '<div class="no-heroes">No se encontraron heroes</div>';
    return;
  }

  // si hay héroes
  gridHeroes.style.display = "grid";
  heroes.forEach((heroe) => {

    //afiliación: se corta por ; y por , y se queda con la primera opción, si no tiene afiliación muestra "Sin afiliación"
    const afiliacion =
      heroe.connections.groupAffiliation
        ?.split(";")[0] 
        ?.split(",")[0]
        ?.trim() || "Sin afiliación";

    //
    const $heroCard = document.createElement("div");

    //Card de cada heroe
    $heroCard.classList.add("cell");
    $heroCard.addEventListener("click", () => {
      abrirModal(heroe);
    });

    //Agregar contenido a la card
    $heroCard.innerHTML = `
    <div class="card">
      <div class="card-image">
        <img src="${heroe.images.md}" alt="${heroe.name}">
      </div>
      <div class="card-content">
        <p class="title is-6">${heroe.name}</p>
        <button class="button-custom">Ver más</button>
      </div>
    </div>
    `;  
// Agregar la card al grid
    gridHeroes.appendChild($heroCard);
  });
}

// Modal
export function abrirModal(hero) {
  const modal = document.getElementById("hero-modal");
  const content = document.getElementById("modal-content");
  const stats = hero.powerstats;

  //Afiliaciones
  const raw = hero.connections?.groupAffiliation;
  const afiliaciones =
    !raw || raw === "-"
      ? ["Sin afiliación"]
      : raw.split(/[,;]+/)
      .map(a => a.trim());

      // Crear barras de poder
  const crearBarra = (label, valor) => {
    const v = valor === "null" ? 0 : valor;
    return `
      <div class="mb-2">
        <p class="is-size-7 mb-1"><strong>${label}</strong></p>
        <progress class="progress is-danger" value="${v}" max="100"></progress>
      </div>
    `;
  };

  // Agregar contenido al modal
  content.innerHTML = `
    <div class="modal-wrapper">
    
      <!-- Nombre -->
      <h2 class="title is-3 m-0">${hero.name}</h2>

      <!-- Imagen  e info-->
      <div class="container-img-info">
        <div class="modal-img">
          <img src="${hero.images.md}" alt="${hero.name}">
        </div>

        <!-- Info todo en un div -->
        <div class="modal-info">
          <p><strong>Nombre real:</strong> ${hero.biography.fullName || "No disponible"}</p>
          <p><strong>Editorial:</strong> ${hero.biography.publisher || "Desconocido"}</p>
          <p><strong>Altura:</strong> ${hero.appearance.height[1]}</p>
          <p><strong>Peso:</strong> ${hero.appearance.weight[1]}</p>

        <!-- Afiliaciones -->
        <div class="mb-3">
          <p><strong>Afiliaciones:</strong></p>
          <div class="chips">
            ${afiliaciones
            .slice(0, 5)
            .map(a => `<span class="chip">${a}</span>`)
            .join("")}
            
            <!-- Si hay más de 5 afiliaciones, mostrar un chip adicional con el número restante -->
            ${afiliaciones.length > 5 ? `<span class="chip">+${afiliaciones.length - 5}</span>` : ""}
          </div>
        </div>

         <!-- Barras de poder -->
          ${crearBarra("Inteligencia", stats.intelligence)}
          ${crearBarra("Fuerza", stats.strength)}
          ${crearBarra("Velocidad", stats.speed)}
          ${crearBarra("Durabilidad", stats.durability)}
          ${crearBarra("Poder", stats.power)}
          ${crearBarra("Combate", stats.combat)}
      </div>
    </div>
  </div>
  `;
  modal.classList.add("is-active");
}

// Cerrar modal
export function cerrarModal() {
  const modal = document.getElementById("hero-modal");
  modal.classList.remove("is-active");
}
