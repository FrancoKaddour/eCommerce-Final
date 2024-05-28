/*------------------------HEADER--------------------------------- */

/*------------------------CARRITO HEADER------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  const carritoHeader = document.querySelector(".carrito-header");
  const carritoContent = document.querySelector(".carrito-content");

  if (carritoHeader && carritoContent) {
    console.log("Elementos seleccionados correctamente");

    carritoHeader.addEventListener("click", function () {
      carritoContent.classList.toggle("show");
    });
  } else {
    console.error("Error al seleccionar los elementos del carrito");
  }
});
/*------------------------CARRUSEL------------------------- */
const slider = document.querySelector("#slider"),
  sliderSections = document.querySelectorAll(".slider-section");

let currentIndex = 0;
const slideCount = sliderSections.length;
const sectionWidth = sliderSections[0].offsetWidth;
const intervalTime = 6000;

setInterval(moveToRight, intervalTime);

function moveToRight() {
  currentIndex = (currentIndex + 1) % slideCount;
  const displacement = -currentIndex * sectionWidth;
  slider.style.transition = "transform 2s ease";
  slider.style.transform = `translateX(${displacement}px)`;
}

/*------------------------PRODUCTOS------------------------- */
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});
cards.addEventListener("click", (e) => {
  addCarrito(e);
});
items.addEventListener("click", (e) => {
  btnAccion(e);
});
const fetchData = async () => {
  try {
    const res = await fetch("products.json");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  data.forEach((producto) => {
    templateCard.querySelector("h5").textContent = producto.title;
    templateCard.querySelector("p").textContent = producto.precio;
    templateCard
      .querySelector("img")
      .setAttribute("src", "images/" + producto.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = producto.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Producto añadido al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;

    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito Vacio!</th>`;
    return;
  }
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
};

const handlePurchase = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Gracias por su compra",
        text: "Su pedido ha sido realizado con éxito.",
        imageUrl: "./images/Suuave.png",
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: "Custom image",
      });
      carrito = {};
      pintarCarrito();
    }
  });
};

document.getElementById("comprar").addEventListener("click", handlePurchase);
