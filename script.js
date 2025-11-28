// ================= CARRUSEL =================
let slides = document.querySelectorAll('.slide');
let index = 0;

function cambiarSlide() {
  slides.forEach(slide => slide.classList.remove('active'));
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}

setInterval(cambiarSlide, 4000);


// ================= MODAL =================
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalText = document.getElementById("modalText");
const modalPrecio = document.getElementById("modalPrecio");
const modalStock = document.getElementById("modalStock");

const salirZoom = document.getElementById("salirZoom");

const close = document.querySelector(".close");
const cards = document.querySelectorAll(".card img");
const instaBtn = document.getElementById("instaBtn");

instaBtn.href = "https://www.instagram.com/TU_USUARIO";

let scale = 1;

cards.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    modalText.textContent = img.nextElementSibling.textContent;

    modalPrecio.textContent = img.dataset.precio || "";
    modalStock.textContent = img.dataset.stock || "";

    scale = 1;
    modalImg.style.transform = "scale(1)";
    modalImg.style.position = "relative";
    modalImg.style.left = "0";
    modalImg.style.top = "0";

    salirZoom.style.display = "none";
  });
});


// Cerrar modal
close.onclick = () => {
  cerrarTodo();
};

window.onclick = (e) => {
  if (e.target === modal) {
    cerrarTodo();
  }
};

function cerrarTodo() {
  modal.style.display = "none";
  scale = 1;
  modalImg.style.transform = "scale(1)";
  modalImg.style.position = "relative";
  modalImg.style.left = "0";
  modalImg.style.top = "0";
  salirZoom.style.display = "none";
}


// ================= ZOOM =================
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const resetZoom = document.getElementById("resetZoom");

zoomIn.onclick = () => {
  scale += 0.2;
  modalImg.style.transform = `scale(${scale})`;
  salirZoom.style.display = "block";
}

zoomOut.onclick = () => {
  if (scale > 0.6) {
    scale -= 0.2;
    modalImg.style.transform = `scale(${scale})`;
    salirZoom.style.display = "block";
  }
}

resetZoom.onclick = () => {
  scale = 1;
  modalImg.style.transform = "scale(1)";
  modalImg.style.position = "relative";
  modalImg.style.left = "0";
  modalImg.style.top = "0";
  salirZoom.style.display = "none";
}


// Botón "Salir de zoom"
salirZoom.onclick = () => {
  scale = 1;
  modalImg.style.transform = "scale(1)";
  modalImg.style.position = "relative";
  modalImg.style.left = "0";
  modalImg.style.top = "0";
  salirZoom.style.display = "none";
}


// ZOOM CON SCROLL
modalImg.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (e.deltaY < 0) {
    scale += 0.1;
  } else if (scale > 0.6) {
    scale -= 0.1;
  }

  modalImg.style.transform = `scale(${scale})`;

  if (scale != 1) {
    salirZoom.style.display = "block";
  }
});


// ================= ARRASTRAR IMAGEN =================
let isDragging = false;
let startX, startY;

modalImg.addEventListener('mousedown', (e) => {
  if (scale <= 1) return;

  isDragging = true;
  startX = e.clientX - modalImg.offsetLeft;
  startY = e.clientY - modalImg.offsetTop;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  modalImg.style.position = 'absolute';
  modalImg.style.left = `${e.clientX - startX}px`;
  modalImg.style.top = `${e.clientY - startY}px`;
});

// Hover swap robusto: soporta mouse y touch (toggle on touch)
(function () {
  // espera a DOM si es necesario
  document.addEventListener('DOMContentLoaded', () => {
    const wraps = document.querySelectorAll('.hover-wrap');

    wraps.forEach(wrap => {
      // precargar la imagen hover para evitar parpadeos
      const hoverImg = wrap.querySelector('.hover-img-top');
      if (hoverImg) {
        const pre = new Image();
        pre.src = hoverImg.src;
      }

      // mouse: mostrar hover al pasar
      wrap.addEventListener('mouseenter', () => {
        wrap.classList.add('hovering');
      });
      wrap.addEventListener('mouseleave', () => {
        wrap.classList.remove('hovering');
      });

      // touch: primer toque muestra hover (previene abrir modal si aplicase),
      // segundo toque permite interacción normal (p. ej. abrir modal)
      let tapped = false;
      wrap.addEventListener('touchstart', function (e) {
        // si no hay hover (imagen ya visible), mostrar y prevenir el siguiente comportamiento
        if (!tapped) {
          tapped = true;
          wrap.classList.add('touched');
          // cerrar si tocan fuera (listener temporal)
          const cancelar = (ev) => {
            if (!wrap.contains(ev.target)) {
              tapped = false;
              wrap.classList.remove('touched');
              document.removeEventListener('touchstart', cancelar);
            }
          };
          document.addEventListener('touchstart', cancelar);
          // prevenimos que el primer touch haga otras acciones (por ejemplo, abrir enlaces)
          e.preventDefault();
        } else {
          // segundo toque: deja que el evento siga su curso (p.ej. abrir modal)
          tapped = false;
          wrap.classList.remove('touched');
        }
      });

      // por si hay enlaces dentro y quieres que el link abra en nueva pestaña
      // no agregamos nada por defecto; si quieres que el click abra imagen, añádelo aparte.
    });
  });
})();
// --------- VARIANTES / SWATCHES EN EL MODAL ----------
(function () {
  // Asegúrate que esto corre después de que exista el DOM y tus elementos modal/cards
  document.addEventListener('DOMContentLoaded', () => {
    // elementos ya definidos en tu script principal
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const modalText = document.getElementById("modalText");
    const modalPrecio = document.getElementById("modalPrecio");
    const modalStock = document.getElementById("modalStock");
    const swatchesContainer = document.getElementById("swatches");
    
    // selecciona todas las cards (o usa las que ya usas para abrir modal)
    const cards = document.querySelectorAll('.card');

    // función para limpiar swatches
    function clearSwatches() {
      if (!swatchesContainer) return;
      swatchesContainer.innerHTML = '';
    }

    // crear swatch element
    function createSwatch(label, imgSrc, isActive) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch-btn' + (isActive ? ' active' : '');
      btn.setAttribute('data-img', imgSrc || '');
      btn.setAttribute('aria-label', label);

      const circle = document.createElement('span');
      circle.className = 'swatch-circle';

      // Si imgSrc parece imagen, usa como background; si no, intenta interpretar como color (hex)
      if (imgSrc && (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i).test(imgSrc)) {
        circle.style.backgroundImage = `url("${imgSrc}")`;
      } else {
        // si no es imagen, asumimos que es un color CSS (ej: #000)
        circle.style.background = imgSrc || '#ccc';
      }

      const text = document.createElement('span');
      text.textContent = label;

      btn.appendChild(circle);
      btn.appendChild(text);

      return btn;
    }

    // función que abre el modal (usa tu lógica de apertura actual; esto se enfoca en variantes)
    function openModalFromCard(card) {
      if (!card) return;
      // imagen base del card
      const imgEl = card.querySelector('img, .card-img, .base-img');
      const titulo = card.querySelector('p') ? card.querySelector('p').innerText : '';
      const precio = card.dataset.precio || '';
      const stock = card.dataset.stock || '';

      // set modal contenido base
      modalImg.src = imgEl ? imgEl.src : '';
      modalText.textContent = titulo;
      modalPrecio.textContent = precio;
      modalStock.textContent = stock;

      // manejar variantes
      clearSwatches();
      const variantsRaw = card.dataset.variants || '';
      if (variantsRaw.trim() !== '') {
        // formato: "Etiqueta|ruta;Etiqueta2|ruta2"
        const pairs = variantsRaw.split(';').map(s => s.trim()).filter(Boolean);
        pairs.forEach((pair, index) => {
          const parts = pair.split('|').map(p => p.trim());
          const label = parts[0] || (`Var ${index+1}`);
          const src = parts[1] || '';
          const sw = createSwatch(label, src, index === 0); // primera activa
          
          // click en swatch cambia modalImg y activa clase
          sw.addEventListener('click', function () {
            // desactivar todas
            swatchesContainer.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // cambiar imagen grande
            const newSrc = this.getAttribute('data-img');
            if (newSrc) {
              modalImg.src = newSrc;
            }
          });

          swatchesContainer.appendChild(sw);
        });
      }

      // mostrar modal (si usas otra lógica, mantenla)
      modal.style.display = 'flex';
    }

    // si ya tienes listeners que abren modal al click de imagen, reemplaza esa parte
    // por este: cuando se haga click en la card (o su imagen), abre y construye swatches
    cards.forEach(card => {
      card.addEventListener('click', function (e) {
        // evita que clicks en botones internos (p.ej. "ampliar") actúen igual si lo deseas
        const targetIsButton = e.target.closest('button');
        if (targetIsButton) return; // deja que el botón haga su cosa
        openModalFromCard(this);
      });
    });

    // Si en tu proyecto abres el modal de otra forma, llama openModalFromCard(card) con el elemento correcto.

  });
})();

document.querySelectorAll(".card").forEach(card => {
  const img = card.querySelector("img")
  const link = document.createElement("a")

  link.classList.add("fullBtn")
  link.innerText = "Ver Mockup"
  link.href = img.src
  link.target = "_blank"

  card.appendChild(link)
})
