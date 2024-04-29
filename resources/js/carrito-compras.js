import Helpers from "./helpers.js";

export default class CarritoDeCompras {
  #productos;
  #porComprar;
  #descuento;
  #tieneDescuento;
  #contadorVentas;
  #ventaSelDescuento;
  constructor() {
    this.#productos = [];
    this.#porComprar = [];
    this.#descuento = 15;
    this.#tieneDescuento = false;
    this.#contadorVentas = 1;
    this.#ventaSelDescuento = Helpers.getRandomInt(1, 10);
  }

  static async crear() {
    const instancia = new CarritoDeCompras();

    await Helpers.cargarPagina(
      "#index-contenido",
      "./resources/views/carrito.html"
    ).catch((error) =>
      Helpers.alertar(
        "#index-contenido",
        "Problemas al acceder al carrito de compras",
        error
      )
    );
    console.log("Cargada la página del carrito");

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

  gestionarVentas() {
    this.#productos.forEach((producto, indice) => {
      let idEnlace = `carrito-producto-${indice}`;
      let fichaProducto = `
        <div class="w-full flex flex-col p-3" id = "card-${indice}">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
            <img
              src="./resources/assets/images/${producto.imagen}"
              alt=""
              class="w-full h-64 object-contain"
            />
            <div class="p-4 flex-1 flex flex-col" style="">
              <h3 class="mb 4 text 2x1">
                ${producto.referencia}. 
                ${new Intl.NumberFormat().format(producto.precio)}
              </h3>
              <div class="mb-4 text-grey-darker text-sm flex-l">
                <p>${producto.resumen}</p>
              </div>
              <a
                id="${idEnlace}"
                data-indice="${indice}"
                href="#"
                class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                style=""
              >
                AGREGAR AL CARRITO
              </a>
            </div>
          </div>
        </div>`;
      document
        .querySelector("#carrito-disponibles")
        .insertAdjacentHTML("beforeend", fichaProducto);
      document.querySelector(`#${idEnlace}`).addEventListener("click", (e) => {
        this.agregaAlCarrito(e.target.dataset.indice);
      });
    });

    let btnPagar = document.querySelector("#carrito-btnpagar");
    btnPagar.style.display = "none"; // visible si hay elementos en el carrito
    btnPagar.addEventListener("click", (event) => this.procesarPago());
  }

  agregaAlCarrito(indice) {
    if (this.#contadorVentas == this.#ventaSelDescuento) {
      //para que se agregue el anuncio de descuento solo una vez
      if (this.#porComprar.length == 0) {
        console.log("Descuento");
        document.querySelector("#card").insertAdjacentHTML(
          "afterbegin",
          `
        <!--  ToastBar  -->
        <div id = "toast" class="w-full bg-orange-200 text-yellow-900 px-4 py-2 flex items-center">
            <img src="https://svgsilh.com/svg/151889.svg" class="w-10 block pr-2">
            <div class="text-sm" id="promo">Felicitaciones usted ha sido elegido para un
                <b>cupón de
                    descuento</b> en este pedido </div>
        </div>
        `
        );
      }
      this.#tieneDescuento = true;
    }
    //elimino el resumen de pago de la venta anterior
    let resumen = document.querySelector("#resumen-pago");
    if (resumen != null) {
      resumen.parentNode.removeChild(resumen);
    }
    //elimino la orden de entrega de la venta anterior
    let orden = document.querySelector("#carrito-orden-envio");
    if (orden != null) {
      orden.parentNode.removeChild(orden);
    }

    let idBtnEliminar = `carrito-btneliminar-${indice}`;
    let idLista = `lstcantidad-${indice}`;
    let disponibles = this.#productos[indice].disponible;
    let item = this.#porComprar.find((producto) => producto.indice === indice);

    if (item) {
      document.querySelector(`#carrito-venta-${item.indice}`).scrollIntoView();
      document.querySelector(`#lstcantidad-${item.indice}`).focus();
      return;
    }

    this.#porComprar.push({
      indice,
      precio: this.#productos[indice].precio,
      cantidad: 1,
    });

    let elementosLista = "<option>1</option>";
    for (let i = 2; i <= disponibles; i++) {
      elementosLista += `<option>${i}</option>`;
    }

    let producto = `
    
        <div id="carrito-venta-${indice}"
            class="border w-full rounded mt-5 flex p-4 justify-between items-center flex-wrap">
            <div class="w-2/4">
                <h3 class="text-lg font-medium">${
                  this.#productos[indice].referencia
                }</h3>
                <h4 class="text-red-700 text-xs font-bold mt-1">Sólo quedan ${disponibles} en stock </h4>
            </div>
            <div id = "descu">
                <h5 class="text-2xl font-medium">
                    <sup class="text-lg text-teal-600">$</sup>
                    ${new Intl.NumberFormat().format(
                      this.#productos[indice].precio
                    )}
                </h5>
                ${
                  this.#tieneDescuento == true
                    ? `
                    <h5 class="text-sm font-bold text-teal-800">
                      Descuento ${this.#descuento}%
                    </h5>
                    `
                    : ``
                }
                
            </div>
            <div class="w-full flex justify-between mt-4">

                <button id="${idBtnEliminar}" data-indice="${indice}" 
                        class="text-red-700 hover:bg-red-100 px-2">ELIMINAR</button>

                <label class="block uppercase tracking-wide text-gray-700"
                    for="grid-first-name">
                    UNIDADES
                    <select id="lstcantidad-${indice}"
                        class="ml-3 text-sm bg-teal-700 border border-teal-200 text-white p-2 rounded leading-tight">
                        ${elementosLista}
                    </select>
                </label>
            </div>
        </div>
    `;

    document
      .querySelector("#carrito-elegidos")
      .insertAdjacentHTML("beforeend", producto);
    document.querySelector("#carrito-btnpagar").style.display = "";

    document
      .querySelector(`#${idBtnEliminar}`)
      .addEventListener("click", (e) => {
        this.eliminarDelCarrito(e.target.dataset.indice);
      });

    document.querySelector(`#${idLista}`).addEventListener("change", (e) => {
      this.actualizarCantidadCompra(e);
    });

    document.querySelector("#vaciar-carrito").addEventListener("click", (e) => {
      this.vaciarCarrito();
    });
  }

  actualizarCantidadCompra(e) {
    /*No me funciona de esta manera
    let indice = e.target.dataset.indice;
    let item = this.#porComprar.find(producto => producto.indice === indice)
    this.#porComprar.indice.cantidad = parseInt(e.target.value);
    */
  }

  eliminarDelCarrito(indice) {
    // eliminar la ficha de la lista de compras
    let elemento = document.querySelector(`#carrito-venta-${indice}`);
    elemento.parentNode.removeChild(elemento); // distinto a dejarlo vacío

    // eliminar el elemento del array de los productos a comprar
    let item = this.#porComprar.find((producto) => producto.indice === indice);
    let i = this.#porComprar.indexOf(item);
    this.#porComprar.splice(i, 1);

    // si no quedan elementos por comprar ocultar el botón de pago
    if (this.#porComprar.length == 0) {
      document.querySelector("#carrito-btnpagar").style.display = "none";
    }
  }

  vaciarCarrito() {
    //lo hice de está manera, por que al hacerlo con un forEach que llamara al método eliminarCarrito para cada elemento, funcionaba antes de hacer una compra pero al llamar a este método al confirmar una compra por alguna razón que desconozco quedaba un elemento
    this.#porComprar.forEach((element) => {
      let elemento = document.querySelector(`#carrito-venta-${element.indice}`);
      elemento.parentNode.removeChild(elemento);
    });
    this.#porComprar = [];
    document.querySelector("#carrito-btnpagar").style.display = "none";
  }

  procesarPago() {
    let valor = 0;

    this.#porComprar.forEach((element) => {
      element.cantidad = document.querySelector(
        `#lstcantidad-${element.indice}`
      ).value;
      if (this.#tieneDescuento == true) {
        valor +=
          element.precio * ((100 - this.#descuento) / 100) * element.cantidad;
      } else {
        valor += element.precio * element.cantidad;
      }
    });

    let iva = valor * 0.19;
    let totalPago = valor + iva;

    let pago = `
        <div class="bg-white rounded shadow p-2 w-full" id = "resumen-pago">
            <div class="w-full bg-orange-200 px-8 py-6">
                <h3 class="text-2xl mt-4 font-bold">Resumen del pago</h3>
                <div class="flex justify-between mt-3">
                    <div class="text-xl text-orange-900 font-bold">Valor</div>
                    <div class='text-xl text-right font-bold '>$${new Intl.NumberFormat().format(
                      valor
                    )}</div>
                </div>
                <div class="flex justify-between mt-3">
                    <div class="text-xl text-orange-900 font-bold">
                         IVA (19%)
                    </div>
                    <div class='text-xl text-right font-bold'>$${new Intl.NumberFormat().format(
                      iva
                    )}</div>
                </div>
                <div class="bg-orange-300 h-1 w-full mt-3"></div>
                <div class="flex justify-between mt-3">
                    <div class="text-xl text-orange-900 font-bold">
                         Total a pagar
                    </div>
                    <div class="text-2xl text-orange-900 font-bold">
                         $${new Intl.NumberFormat().format(totalPago)}
                    </div>
                </div>
                <button id="carrito-btnconfirmar"
                    class="px-2 py-2 bg-teal-600 text-white w-full mt-3
                    rounded shadow font-bold hover:bg-teal-800">
                    CONFIRMAR
                </button>
            </div>
        </div>
    `;
    document.querySelector("#carrito-confirmacion").innerHTML = pago;
    document
      .querySelector("#carrito-btnconfirmar")
      .addEventListener("click", (event) => this.confirmarPago());
  }

  confirmarPago() {
    if (Helpers.existeElemento("#carrito-orden-envio")) return;

    this.#porComprar.forEach((element) => {
      //De esta manera afecto el stock de los productos
      this.#productos[element.indice].disponible -= document.querySelector(
        `#lstcantidad-${element.indice}`
      ).value;

      //Si no hay stock del producto elimino el enlace y agrego un letrero que informe al usuario que no hay stock del producto
      if (this.#productos[element.indice].disponible == 0) {
        let elemento = document.querySelector(
          `#carrito-producto-${element.indice}`
        );
        elemento.parentNode.removeChild(elemento);
        document
          .querySelector(`#card-${element.indice}`)
          .insertAdjacentHTML(
            "beforeend",
            `<h5 class="text-2xl font-medium"> No hay stock de este producto </h5>`
          );
      }
    });
    //cuento las ventas y cada 10 ventas selecciono una venta aleatoria para ser acreedora a un descuento
    if (this.#contadorVentas != 10) {
      this.#contadorVentas++;
    } else {
      this.#contadorVentas = 1;
      this.#ventaSelDescuento = Helpers.getRandomInt(1, 10);
    }
    // muestro por consola que venta fue seleccionada para el descuento y cual será la siguiente venta
    console.log(
      "venta seleccionada para descuento: " + this.#ventaSelDescuento
    );
    console.log("siguiente venta: " + this.#contadorVentas);

    let nroOrden = Helpers.getRandomInt(10000, 9999999);

    let confirmacion = `
        <div id="carrito-orden-envio"
            class="bg-white rounded shadow px-10 py-6 w-full mt-4
                   flex flex-wrap justify-center ">


            <div class="pr-8">
                <h3 class="text-2xl mt-4 font-bold
                    text-teal-900">Gracias por su compra
                </h3>

                <h4 id="carrito-nro-orden" class="text-sm
                        text-gray-600 font-bold">
                    ORDEN DE ENVÍO #${nroOrden}</h4>
            </div>

            <img src="https://image.flaticon.com/icons/svg/1611/1611768.svg"
                 alt="" class="w-24">
        </div>
    `;

    this.vaciarCarrito();

    let elemento = document.querySelector("#toast");
    if (elemento != null) {
      elemento.parentNode.removeChild(elemento);
      this.#tieneDescuento = false;
    }

    document
      .querySelector("#carrito-confirmacion")
      .insertAdjacentHTML("beforeend", confirmacion);
  }
}
