import Helpers from "./helpers.js";

export default class productos {
  #productos;

  constructor() {
    this.#productos = [];
  }

  static async crear() {
    const instancia = new productos();

    await Helpers.cargarPagina(
      "#index-contenido",
      "./resources/views/productos.html"
    ).catch((error) =>
      Helpers.alertar(
        "#index-contenido",
        "Problemas al acceder a productos",
        error
      )
    );
    console.log("Cargada la página de productos");

    instancia.#productos = await Helpers.leerJSON(
      "./data/productos.json"
    ).catch((error) =>
      Helpers.alertar(
        "#index-contenido",
        "Problemas al acceder a los productos",
        error
      )
    );
    console.log("Cargados los productos", instancia.#productos);

    return instancia;
  }

  gestionarProductos() {
    this.#productos.forEach((producto, indice) => {
      let idEnlace = `productos-${indice}`;
      let fichaProducto = `
        <tr>
            <td class= "border px-4 py-2">
            <img
            src="./resources/assets/images/${producto.imagen}"
            alt=""
            class="object-contain w-full h-64"
            />
            </td>
            <td class= "border px-4 py-2">
            ${producto.id}
            </td>
            <td class= "border px-4 py-2">
            ${producto.referencia}
            </td>
            <td class= "border px-4 py-2">
            ${producto.disponible}
            </td>
            <td class= "border px-4 py-2">
            ${producto.precio}
            </td>
            <td class="border px-4 py-2">${producto.resumen}
            <button id = "${idEnlace}" class="hover:bg-grey-lightest text-grey-darkest font-bold rounded">
              Ver mas...
            </button>  
            </td>
        </tr>
        `;
      document
        .querySelector("#contenido-tabla")
        .insertAdjacentHTML("beforeend", fichaProducto);

      //Creación del modal (a mi manera, debido a que los modals que encontré usaban en su mayoria Vue.js y/o otras cosas que no entendía del todo)
      document.querySelector(`#${idEnlace}`).addEventListener("click", (e) => {
        document.querySelector("#modalt").insertAdjacentHTML(
          "beforeend",
          `
          <div id = "modal" class = "top-0 left-0 fixed w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50"> 
            <div id ="hijo-modal" class = "h-3/12 w-4/12 bg-white rounded-lg shadow-lg overflow-hidden px-10 pt-10 pb-5">
            
            Id: ${producto.id}
            <br>
            Detalles: ${producto.detalles}
            <br>
            <button id="modal-${indice}" data-indice="" 
            class="mt-5 bg-teal-600 w-full hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center">ACEPTAR</button>
            
            </div>
          </div>

        `
        );

        document
          .querySelector(`#modal-${indice}`)
          .addEventListener("click", (e) => {
            let elemento = document.querySelector(`#modal`);
            elemento.parentNode.removeChild(elemento);
          });

        document.querySelector(`#modal`).addEventListener("click", (e) => {
          e.stopPropagation(); // Utilizo este método para evitar que el div hijo-modal herede el evento click de su div padre y que así no se 'cierre'(enrealidad se elimina) la ventana al hacer click dentro de ella (a excepción del botón ACEPTAR)
          let elemento = document.querySelector(`#modal`);
          elemento.parentNode.removeChild(elemento);
        });

        document.querySelector(`#hijo-modal`).addEventListener("click", (e) => {
          e.stopPropagation(); // Utilizo este método para evitar que el div hijo-modal herede el evento click de su div padre y que así no se 'cierre'(enrealidad se elimina) la ventana al hacer click dentro de ella (a excepción del botón ACEPTAR)
        });
      });
    });
  }
}
