document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [{
            id: 7890,
            nombre: "TARJETA DE VIDEO 560 4GB",
            precio: 300,
            imagen: 'img/tarjeta.jpg'
        },
        {
            id: 6789,
            nombre: "AURICULARES HYPERX",
            precio: 100,
            imagen: 'img/auris.jpg'
        },
        {
            id: 5678,
            nombre: "GABINETE SENTEY",
            precio: 150,
            imagen: 'img/gabinete.jpg'
        },
        {
            id: 4567,
            nombre: "MONITOR 32 SAMSUNG",
            precio: 200,
            imagen: 'img/monitor.jpg'
        },
        {
            id: 3456,
            nombre: "TECLADO REDRAGON",
            precio: 70,
            imagen: 'img/teclado.jpg'
        },
        {
            id: 2345,
            nombre: "MOUSEPAD REDRAGON XL",
            precio: 50,
            imagen: 'img/mousepad.jpg'
        },
        {
            id: 1234,
            nombre: "MOUSE LOGITECH",
            precio: 70,
            imagen: 'img/mouse.jpg'
        },

    ];

    let carrito = [];
    const divisa = '€';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonFinalizar = document.querySelector('#boton-finalizar');
    const DOMbotonAgregar = document.querySelector('#boton-agregar');
    const inputFiltrar = document.querySelector("input")
    const miLocalStorage = window.localStorage;

    // Funciones

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {

            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    function filtrarProductos() {
        inputFiltrar.value = inputFiltrar.value.trim().toUpperCase()
        if (inputFiltrar.value !== "") {
            let resultado = baseDeDatos.find((baseDeDatos) => baseDeDatos.nombre.includes(inputFiltrar.value))
            if (resultado.length === 0) {
                console.clear()
                console.warn("No se encontraron productos.")
                anyadirProductoAlCarrito()
            } else {
                carrito.push(new Producto(resultado.id, resultado.nombre, resultado.precio))
                anyadirProductoAlCarrito()
            }
        } else {
            anyadirProductoAlCarrito()
        }
    }

    function anyadirProductoAlCarrito(evento) {

        carrito.push(evento.target.getAttribute('marcador'))

        renderizarCarrito();

        guardarCarritoEnLocalStorage();
    }

    function renderizarCarrito() {

        DOMcarrito.textContent = '';

        const carritoSinDuplicados = [...new Set(carrito)];

        carritoSinDuplicados.forEach((item) => {

            const miItem = baseDeDatos.filter((itemBaseDatos) => {

                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {

                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        DOMtotal.textContent = calcularTotal();
    }

    function borrarItemCarrito(evento) {

        const id = evento.target.dataset.item;

        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        renderizarCarrito();

        guardarCarritoEnLocalStorage();

    }

    function calcularTotal() {

        return carrito.reduce((total, item) => {

            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {

        carrito = [];

        renderizarCarrito();

        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {

        if (miLocalStorage.getItem('carrito') !== null) {

            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    function finalizar() {
        Swal.fire(
            'felicidades!',
            'tu compra a sido exitosa!',
            'aceptar'
        )

        carrito = [];

        renderizarCarrito();

        localStorage.clear();

    }


    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonFinalizar.addEventListener('click', finalizar);
    DOMbotonAgregar.addEventListener('click', () => { filtrarProductos() });


    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});