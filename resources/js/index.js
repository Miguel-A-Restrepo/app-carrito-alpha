"use strict";
import Helpers from "./helpers.js";
import CarritoDeCompras from "./carrito-compras.js";
import productos from "./productos.js";

document.addEventListener("DOMContentLoaded", (event) => {
  let promesa = Helpers.cargarPagina(
    "#index-header",
    "./resources/views/menu.html"
  )
    .then(gestionarOpciones)
    .catch((error) => {
      Helpers.alertar(
        "#index-contenido",
        "Problemas al acceder al menú principal",
        error
      );
    });

  /*
  let url = "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list";

  Helpers.leerJSON(url)
    .then((resultado) => {
      console.log(resultado);
    })
    .catch((error) => {
      console.error(`Houston, tenemos un problema: ${error}`);
    });

  /*
  resultado => resultado.forEach(elemento=> console.log(elemento))
  */

  /*
  -1 assets/image/.jpg los potatiles - tv port1... tort2... tv..
  -2 Crear una página para carrito de compras
  -3 for each productos mostrar en carrito los datos del elemento con su respectiva imagen
  
  */

  /*
  let obtenerResultados = resultado => resultado.forEach(elemento => console.log(elemento));
  */
});

let gestionarOpciones = (resultado) => {
  let elemento = `#${resultado.id}`; // se asigna '#index-header'

  cargarProductos(elemento);
  cargarCarrito(elemento);
  cargarContactenos(elemento);
  cargarNosotros(elemento);
  cargarActualizarDatos(elemento);
  cargarCambiarPassword(elemento);
};

/*
let tipoOperacion = function (a, b) {
  return a + b;
};

function operar(funcion) {
  return funcion(12, 3);
}

console.log(operar(tipoOperacion));
*/

/*
function cargarCarrito(elemento) {
  let referencia = document.querySelector(`${elemento} a[id='menu-carrito']`);
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina("#index-contenido", "./resources/views/carrito.html")
      .then(() => {
        // hacer algo...
      })
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder a contáctenos"
        );
      });
  });
}
*/

let cargarProductos = (elemento) => {
  let referencia = document.querySelector(`${elemento} a[id='menu-productos']`);
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    (async () => {
      let producto = await productos.crear();
      producto.gestionarProductos();
    })();
  });
};

let cargarCarrito = (elemento) => {
  let referencia = document.querySelector(`${elemento} a[id='menu-carrito']`);

  referencia.addEventListener("click", (event) => {
    event.preventDefault();

    (async () => {
      let carrito = await CarritoDeCompras.crear();
      carrito.gestionarVentas();
    })();
  });
  /*
  let referencia = document.querySelector(`${elemento} a[id='menu-carrito']`);
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina("#index-contenido", "./resources/views/carrito.html")
      .then(() => {
        Helpers.leerJSON("./data/productos.json")
          .then((respuesta) => {
            respuesta.forEach((elemento) => {
              let producto = `
                      <p>
                          ${elemento.referencia} - 
                          $${elemento.precio}
                          <br>
                          ${elemento.resumen}
                      </p>
                      <br>`;
              document
                .querySelector("#carrito-lista")
                .insertAdjacentHTML("beforeend", producto);
            });
          })
          .catch((error) => {
            console.error(`Houston, tenemos problemas: ${error}`);
            Helpers.alertar(
              "#index-contenido",
              "Problemas al acceder al listado de productos",
              error
            );
          });
      })
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder al carrito de compras",
          error
        );
      });
  });
  */
};

let cargarContactenos = (elemento) => {
  let referencia = document.querySelector(
    `${elemento} a[id='menu-contactenos']`
  );
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina(
      "#index-contenido",
      "./resources/views/contactenos.html"
    )
      .then(() => {})
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder a contactenos",
          error
        );
      });
  });
};

let cargarNosotros = (elemento) => {
  let referencia = document.querySelector(`${elemento} a[id='menu-nosotros']`);
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina("#index-contenido", "./resources/views/nosotros.html")
      .then(() => {})
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder a nosotros",
          error
        );
      });
  });
};

let cargarActualizarDatos = (elemento) => {
  let referencia = document.querySelector(
    `${elemento} a[id='menu-actualizar']`
  );
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina(
      "#index-contenido",
      "./resources/views/actualizar.html"
    )
      .then(() => {})
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder a actualizar datos",
          error
        );
      });
  });
};

let cargarCambiarPassword = (elemento) => {
  let referencia = document.querySelector(
    `${elemento} a[id='menu-contraseña']`
  );
  referencia.addEventListener("click", (event) => {
    event.preventDefault();
    Helpers.cargarPagina(
      "#index-contenido",
      "./resources/views/contraseña.html"
    )
      .then(() => {})
      .catch((error) => {
        Helpers.alertar(
          "#index-contenido",
          "Problemas al acceder al cambiar contraseña",
          error
        );
      });
  });
};
