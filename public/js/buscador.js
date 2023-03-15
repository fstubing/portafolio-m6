let productos;
let ventas;
let productoBuscado = []
let ventaBuscada = []
let tabla = document.querySelector('#tablaModal')
let btnClose = document.querySelectorAll('.btnCerrarModal')
let btnMostrarProductos = document.querySelector('#btnInventario')
let btnProductoxSku = document.querySelector('#btnProductoxSku')
let btnMostrarVentas = document.querySelector('#btnRegistroVentas')
let btnVentaxId = document.querySelector('#btnVentaxId')


btnMostrarProductos.addEventListener("click", () => {

   axios.get("http://localhost:3000/productos")
     .then(function (response) {
            tabla.deleteCaption()
            productos= response.data.productos

            let template1 =  `<tr>
                                <th scope="col">#</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">SKU</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Marca</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Stock</th>
                            </tr>`;
            let template2 = "";
            let contador=0
                productos.forEach(producto => {
                    contador++
                    template2 += `
                    <tr scope="row">
                        <td>${contador}</td>
                        <td><img class="img-inventario" src="../public/img/${producto.imagen1}" alt="Imagen ${producto.nombre}"></td>
                        <td>${producto.sku}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.marca}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                    </tr>
                    `
                });
                document.querySelector("#staticBackdropLabel").innerText = `Inventario de Productos`;
                document.querySelector("#tableHeaders").innerHTML = template1; 
                document.querySelector("#tableBody").innerHTML = template2;
     })
     .catch(function (error) {
        alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
     });

});

btnProductoxSku.addEventListener("click", () => {

   let skuProducto= document.querySelector("#skuProducto").value;

   axios.get(`http://localhost:3000/producto/${skuProducto}`)
     .then(function (response) {
            tabla.deleteCaption()
            console.log(response)
            productoBuscado.push(response.data) 
            if(productoBuscado.length==0){
                return alert('Producto no encontrado'); 
               }else if(skuProducto.length==0){
                    return alert('Debe ingresar el sku del producto');
                }else{
                    let template1 =  `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Imagen</th>
                        <th scope="col">SKU</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Stock</th>
                    </tr>`;
                    let template2 = "";
                    let contador=0
                    productoBuscado.forEach(producto => {
                            contador++
                            template2 += `
                            <tr scope="row">
                                <td>${contador}</td>
                                <td><img class="img-inventario" src="../public/img/${producto.imagen1}" alt="Imagen ${producto.nombre}"></td>
                                <td>${producto.sku}</td>
                                <td>${producto.nombre}</td>
                                <td>${producto.marca}</td>
                                <td>${producto.descripcion}</td>
                                <td>${producto.precio}</td>
                                <td>${producto.stock}</td>
                            </tr>
                            `
                });
                document.querySelector("#staticBackdropLabel").innerText = `Producto Buscado`;
                document.querySelector("#tableHeaders").innerHTML = template1; 
                document.querySelector("#tableBody").innerHTML = template2;
               }
            
     })
     .catch(function (error) {
        console.log(error);
        alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
     });

});

btnMostrarVentas.addEventListener("click", () => {

    axios.get("http://localhost:3000/ventas")
      .then(function (response) {
             tabla.deleteCaption()
             ventas= response.data.ventas
 
             let template1 =  `<tr>
                                 <th scope="col">#</th>
                                 <th scope="col">Id</th>
                                 <th scope="col">Fecha</th>
                                 <th scope="col">Precio Total</th>
                                 <th scope="col">Productos Vendidos</th>
                             </tr>`;
             let template2 = "";
             let contador=0
                 ventas.forEach(venta => {
                     contador++
                     template2 += `
                     <tr scope="row">
                         <td>${contador}</td>
                         <td>${venta.id}</td>
                         <td>${venta.fecha}</td>
                         <td>$ ${venta.precioTotalCompra}</td>
                         <td><button type="button" class="btn btn-info d-block m-2" onclick="detalleProductosVendidos('${venta.id}')">Ver Más</button></td>
                     </tr>
                     `                     
                 });
  
                 document.querySelector("#staticBackdropLabel").innerText = `Inventario de Productos`;
                 document.querySelector("#tableHeaders").innerHTML = template1; 
                 document.querySelector("#tableBody").innerHTML = template2;
      })
      .catch(function (error) {
        console.log(error);
         alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
      });
 
 });

 const detalleProductosVendidos = (id) => {
    
    axios.get(`http://localhost:3000/venta/${id}`)
      .then(function (response) {
             ventaBuscada = response.data.productosCarro
             console.log(ventaBuscada)
             if(ventaBuscada.length==0){
                 return alert('Venta no encontrada'); 
                }else if(id.length==0){
                     return alert('Debe ingresar el ID de la venta');
                 }else{
                     let template1 =  `<tr>
                         <th scope="col">#</th>
                         <th scope="col">SKU Producto</th>
                         <th scope="col">Articulos Vendidos</th>
                     </tr>`;
                     let template2 = "";
                     let contador=0
                     ventaBuscada.forEach(venta => {
                             contador++
                             template2 += `
                             <tr scope="row">
                                 <td>${contador}</td>
                                 <td>${venta.codigo}</td>
                                 <td>${venta.cantidad}</td>
                             </tr>
                             `
                 });

                 document.querySelector("#staticBackdropLabel").innerText = `Detalle de Venta ID ${id} por $ ${response.data.precioTotalCompra}`;
                 document.querySelector("#tableHeaders").innerHTML = template1; 
                 document.querySelector("#tableBody").innerHTML = template2;
                }
             
      })
      .catch(function (error) {
         console.log(error);
         alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
      });
 }
 
 btnVentaxId.addEventListener("click", () => {
 
    let id= document.querySelector("#IdVenta").value;
 
    axios.get(`http://localhost:3000/venta/${id}`)
      .then(function (response) {
             ventaBuscada = response.data.productosCarro
             if(ventaBuscada.length==0){
                 return alert('Venta no encontrada'); 
                }else if(id.length==0){
                     return alert('Debe ingresar el ID de la venta');
                 }else{
                     let template1 =  `<tr>
                         <th scope="col">#</th>
                         <th scope="col">SKU Producto</th>
                         <th scope="col">Articulos Vendidos</th>
                     </tr>`;
                     let template2 = "";
                     let contador=0
                     ventaBuscada.forEach(venta => {
                             contador++
                             template2 += `
                             <tr scope="row">
                                 <td>${contador}</td>
                                 <td>${venta.codigo}</td>
                                 <td>${venta.cantidad}</td>
                             </tr>
                             `
                 });

                 document.querySelector("#staticBackdropLabel").innerText = `Venta ID: ${id}\nPrecio Total: $ ${response.data.precioTotalCompra}`;
                 document.querySelector("#tableHeaders").innerHTML = template1; 
                 document.querySelector("#tableBody").innerHTML = template2;
                }
             
      })
      .catch(function (error) {
         console.log(error);
         alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
      }); 
 });

for (let i = 0; i < btnClose.length; i++) {
    btnClose[i].addEventListener('click',  () => {

        document.querySelector("#tableBody").innerHTML = `
        <tr scope="row">
        </tr>
        `;
    })
}

function cambio(){
    Swal.fire('Cerraste cesión correctamente');
    location.replace("/")
  }