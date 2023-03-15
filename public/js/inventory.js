function cambio(){
    Swal.fire('Cerraste cesión correctamente');
    location.replace("/")
  }


let formulario = document.getElementById("crud_form");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    axios.post("/producto/", formulario)
        .then(function (response) {
            if(response.data.code != 201){
                console.log(response.data.message)
                alert(response.data.message)
            }else {
                alert("Producto agregado correctamente.")
            }
        })
        .catch(function (error) {
            console.log(error.response.data)
            alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.message}`);
        })
        .then(function (){
            location.reload()
         });
})

const btnEliminar = (sku) =>{
    confirmacion = confirm(`¿Está seguro de eliminar el producto sku: ${sku}?`);
            
    if(confirmacion){
        axios.delete(`http://localhost:3000/producto/${sku}`)
        .then(function (response) {
            console.log(response)
            alert(response.data);
        })
        .catch(function (error) {
            console.log(error)
            alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.error}`);
        })
        .then(function (){
            location.reload()
        });
    }    
}


const btnModal = (sku) => {
    axios.get(`http://localhost:3000/producto/${sku}`)
     .then(function (response) {
            let atributosProducto=[]
            atributosProducto.push(response.data)
            if(atributosProducto.length==0){
                return alert('Producto no encontrada'); 
               }else{
                let template=""
                    atributosProducto.forEach(producto => {                        
                            template += `
                                <label for="update-sku" class="form-label px-2"><b>SKU:</b></label>
                                <input readonly class="form-control-plaintext form-control-lg px-2" type="text" id="update_sku" name="sku" value="${producto.sku}">
                                <hr>
                                <label for="update_nombre" class="form-label px-2">Nombre:</label>
                                <input class="form-control px-2" type="text" id="update_nombre" name="nombre" required value="${producto.nombre}">
                                <label for="update_marca" class="form-label px-2">Marca:</label>
                                <input class="form-control px-2" type="text" id="update_marca" name="marca" required value="${producto.marca}">
                                <label for="update_descripcion" class="form-label px-2">Descripcion</label>
                                <input class="form-control px-2" type="text" id="update_descripcion" name="descripcion" required value="${producto.descripcion}">
                                <label for="update_precio" class="form-label px-2">Precio</label>
                                <input class="form-control px-2" type="number" id="update_precio" name="precio" required value=${producto.precio}>
                                <label for="update_stock" class="form-label px-2">Stock</label>
                                <input class="form-control px-2" type="number" id="update_stock" name="stock" required value=${producto.stock}>
                                <label for="update_imagen1" class="form-label px-2">Imagen 1: ${producto.imagen1}</label>
                                <input class="form-control px-2" type="file" id="update_imagen1" name="imagen1" required>
                                <label for="update_imagen2" class="form-label px-2">Imagen 2: ${producto.imagen2}</label>
                                <input class="form-control px-2" type="file" id="update_imagen2" name="imagen2" required>
                                <label for="update_imagen3" class="form-label px-2">Imagen 3: ${producto.imagen3}</label>
                                <input class="form-control px-2" type="file" id="update_imagen3" name="imagen3" required>
                            `
                    });
                document.querySelector("#staticBackdropLabel").innerText = `Editor de Productos`;
                document.querySelector("#formContainer").innerHTML = template; 
               }
            
     })
     .catch(function (error) {
        console.log(error)
        alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.error}`);
     });
}

let updateForm = document.getElementById("update_form");
updateForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    axios.put(`http://localhost:3000/producto/`, updateForm)
     .then(function (response) {
        alert(response.data);
     })
     .catch(function (error) {
        console.log(error)
        alert(`Código: ${error.response.data.code} \nMensaje: ${error.response.data.error}`);
     })
     .then(function (){
        location.reload()
     });
})