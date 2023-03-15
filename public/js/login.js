function capturador(){
document.getElementById("form-login").addEventListener("submit", function(event){
    event.preventDefault();
    let nombre = document.getElementById("login-usuario").value;
    let password = document.getElementById("login-password").value;

    axios.get(`http://localhost:3000/usuarios/`)
      .then(function (response) {
            let usuarios = response.data.usuarios;
            console.log(usuarios);
            let encontrado = usuarios.find(user => user.usuario == nombre && user.password == password)

            if(encontrado){
                Swal.fire('Usuario autenticado')
                let link = `/usuario?id=${encontrado.id}`
                location.replace(link)
            }else{
                Swal.fire('Datos incorrectos');
            }
      })
 

    
})
}

capturador()



