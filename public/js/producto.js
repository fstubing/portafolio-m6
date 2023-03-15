let productosCarro=[]

// condición que pregunta si en el local storage hay productos y en caso positivo indica que productosCarro será igual a los productos existentes en el local storage. Se ocupa Json.parse para covertir el código en js
  if(localStorage.getItem("productos")){
    productosCarro = JSON.parse(localStorage.getItem("productos"))
    actualizarCarro(productosCarro)
  }

// función que permite agregar productos al carro. Cuando damos click en el carro se acciona la función que agrega los productos al local storage en forma de objetos. Primero, se inicializa el objeto objProducto. Segundo, se crea la variable productoEncontrado que está relacionada con la condición que se plantea a continuación. Tercero, se establece condición de que en caso que exista productoEncontrado (o sea, en el local storage), en ese caso el agregar producto al carro se representa aumentando la cantidad del objeto producto; en caso de que no exista en el carro en producto agregado, se realiza un push para incluirlo al final del array. Cuarto, se invoca función "actualizarCarro".
function addToCart(sku, stock) {
  let objProducto = {
    codigo: sku,
    cantidad: 1,
  };

  let productoEncontrado = productosCarro.find((producto) => producto.codigo == sku);

  if (productoEncontrado) {
    if(productoEncontrado.cantidad >= stock) {
      alert('Ha alcanzado el stock máximo de este producto')
    } else {
      productoEncontrado.cantidad = productoEncontrado.cantidad + 1
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto agregado correctamente.",
        showConfirmButton: false,
        timer: 1000,
      })
    }
  } else {
    productosCarro.push(objProducto);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto agregado correctamente.",
      showConfirmButton: false,
      timer: 1000,
    })
  }

  actualizarCarro(productosCarro);

}

// función que actualiza el contador del carro. Primero busca en el local storage los elementos existentes. Segundo, con reduce se realiza una suma de las cantidades que existe de cada producto en el local storage. Tercero, envío la información al elemento del documento html que contiene el contador
  function actualizarCarro(listadoProductos) {
    localStorage.setItem("productos", JSON.stringify(listadoProductos))
    //document.querySelector("#cantidad-productos").innerText = listadoProductos.length; --> (me actualiza el contador del carrito según el número de objProducto agregados, pero no me sirve si el almacenamiento local los registra aumentando la cantidad del objProducto. Ej. agregé 2 productos sku a1 y 3 productos sku a2, con este código el contador del carrito me registraría solo dos (a1 y a2). Si en el local storage, no fuera aumentando la cantidad sino que los registrara separado, en ese caso el contador indicaría 5)
    const valorInicial = 0;
    const sumaProductos = listadoProductos.reduce(
        (accumulator, producto) => accumulator + producto.cantidad,
        valorInicial
    );
    document.querySelector("#cantidad-productos").innerText = sumaProductos;
  }




