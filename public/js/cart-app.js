let cupones = [
    {
      nombre: "10%",
      descuento: 10,
      estado: true,
    },
    {
      nombre: "20%",
      descuento: 20,
      estado: true
    },
    {
      nombre: "50%",
      descuento: 50,
      estado: true
    },
  ];

let productosBase=[];

window.addEventListener("load", () => {
  axios.get("http://localhost:3000/productos")
  .then(function (response) {
      response.data.productos.forEach((p)=>{
          productosBase.push(p);
      })  
  })
  .catch(function (error) {
    console.log(error);
     alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
  })
  .then(function(){
    cargarTablaProductos()
  });
})


let productosCarro = [];

let subtotal = 0;

let precioTotalCompra = 0;

let sumaProductos = 0;

if(localStorage.getItem("productos")){
  productosCarro = JSON.parse(localStorage.getItem("productos"))
  actualizarCarro(productosCarro)
}

function actualizarCarro(listadoProductos) {
  localStorage.setItem("productos", JSON.stringify(listadoProductos))
  const valorInicial = 0;
  sumaProductos = listadoProductos.reduce(
      (accumulator, producto) => accumulator + producto.cantidad,
      valorInicial
  );
  document.querySelector("#cantidad-productos").innerText = sumaProductos;
}


function cargarTablaProductos(){

  let acumuladorFilas = "";

  productosCarro.forEach((producto, index)=> {
    
    let descuento = 0
    let productoConDetalles = encontrarProducto(producto.codigo);
    let precioUnitario = productoConDetalles.precio - descuento;
    let totalProducto = precioUnitario * producto.cantidad;
    subtotal += totalProducto;
    precioTotalCompra += totalProducto;

    let template = `
                  <div class="row m-3 p-carro">
                        <div class="col-sm-12 col-md-4"><img class="img-carro" src="../public/img/${productoConDetalles.imagen1}" alt="imagen producto"></div>
                        <div class="col-sm-6 col-md-4">
                            <p>${productoConDetalles.nombre}</p>
                            <p>Stock: ${productoConDetalles.stock}</p>
                            <p>Precio Unitario ${productoConDetalles.precio}</p>
                            <P>          
                              <button onclick="restar('${productoConDetalles.sku}')" class="btn btn-info">-</button>
                              <input type="number" value="${producto.cantidad}" min="0" max="${productoConDetalles.stock}" id="cantidad-carro">
                              <button onclick="sumar('${productoConDetalles.sku}','${productoConDetalles.stock}')" class="btn btn-info my-1">+</button>
                            </P>
                        </div>
                        <div class="col-sm-6 col-md-4"><p>Precio <b>$${totalProducto}</b></p></div>                   
                  </div>
                    `
      acumuladorFilas+=template;
})

  document.querySelector("#productos-carrito").innerHTML= acumuladorFilas;
  document.querySelector("#cantidad-pdcto").innerHTML = `${sumaProductos} PRODUCTOS`;
  document.querySelector("#subtotal").innerHTML = `Subtotal: $ ${subtotal}`;
  document.querySelector("#precio-total").innerHTML= `TOTAL: <strong>$ <span id='ptc'>${precioTotalCompra}</span></strong> `;
}


function encontrarProducto (sku){
  let encontrado =  productosBase.find(producto => producto.sku == sku)
  return encontrado
}



// LÓGICA PARA VACIAR CARRITO
document.getElementById("btn-vaciar").addEventListener("click", function(event){
  event.preventDefault();
  let respuesta= confirm("¿Está seguro que desea vaciar el carro de compras?")
  if(respuesta){
    localStorage.setItem("productos", "[]");
    location.reload();
  }
  

})

  //LÓGICA DESCUENTO POR CUPÓN
  document.getElementById("btn-descuento").addEventListener("click", function (event) {
      let cuponIngresado = document.getElementById("input-cupon").value;
  
      let cuponEncontrado = cupones.find((cupon) => cupon.nombre == cuponIngresado);
 
      if (cuponEncontrado && cuponEncontrado.estado == true) {
        
        Swal.fire('Cupón aplicado')
        descuento = parseInt((precioTotalCompra * cuponEncontrado.descuento)/100);
        precioTotalCompra = precioTotalCompra - descuento;
        document.querySelector("#precio-total").innerHTML = `TOTAL: <strong>$ <span id='ptc'>${precioTotalCompra}</span></strong>`;
        document.querySelector("#descuento").innerHTML = `Descuento: <strong>$ - ${descuento}</strong>`;
        cuponEncontrado.estado = false;

      } else {
       Swal.fire('El cupón no existe o está caducado')

      }
    });
  
  
    //restar PRODUCTOS
  
    function restar(sku){
     
      productosCarro.forEach((producto, index) => { 
        if(sku == producto.codigo){
          producto.cantidad = producto.cantidad - 1;
          if(producto.cantidad <= 0){
            if(confirm("Está seguro que desea eliminar?")){
              productosCarro.splice(index, 1)
            }else{
              producto.cantidad =1;
            }
          }
        }
      })
      actualizarCarro(productosCarro);
      cargarTablaProductos();
      location.reload()
    }
  
  
    //sumar PRODUCTOS
  
    function sumar(sku, stock){
  
      productosCarro.forEach((producto, index) => {
        if(sku == producto.codigo){
          if(producto.cantidad >= stock) {
            alert(`Alcanzo el stock máximo de este producto (${stock} unidades)`)
          } else {
            producto.cantidad = producto.cantidad + 1
            }
        }
      })

      actualizarCarro(productosCarro);
      cargarTablaProductos();
      location.reload()
    } 

    

  document.getElementById('btnComprarAhora').addEventListener('click', (event)=>{
    event.preventDefault()


      if(productosCarro.length == 0){
        alert(`no existen productos agregados al carro`)
      }else{
        axios.post("/venta/", {productosCarro, precioTotalCompra})
        .then(function (response) {
            if(response.data.code != 201){
                alert(response.data.message)
            }else {
              console.log(response.data)
              alert(`VENTA ID ${response.data.nuevaVenta.id}\n
              Tu compra por un total de $${response.data.nuevaVenta.precioTotalCompra} se ha procesado exitosamente.\n
              Te esperamos de vuelta pronto!`)
            }
        })
        .catch(function (error) {
            console.log(error.response.data)
            alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
        })
        .then(function (){
            localStorage.setItem("productos", "[]");
            location.reload()
         });
      }
  })