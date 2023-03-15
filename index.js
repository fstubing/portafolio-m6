import express from 'express';
import {v4 as uuid} from 'uuid';
import cors from 'cors';
import {create} from 'express-handlebars';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import moment from 'moment';

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.listen(3000, () => console.log("http://localhost:3000"));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "La imágen que está subiendo sobrepasa los 5mb permitidos."
  }));
app.use(cors());
app.use('/public', express.static('public'));

//configuracion de handlebars

const hbs = create({
	partialsDir: [
		"views/partials/",
	],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//FUNCIONES
const leerProductos = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("productos.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al cargar los productos.");
            let productos = JSON.parse(data)
            resolve(productos)
        })
    })
};

const leerProductosPorId = (id) => {
    return new Promise((resolve, reject) => {
        fs.readFile("productos.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al cargar los productos.");
            let productos = JSON.parse(data)
            let found = productos.productos.find(producto => producto.sku == id);
            if(found){
                resolve(found)
            }else{
                reject("Producto no encontrado.")
            }
        })
    })
};

const agregarProducto = (nuevoProducto) => {
    return new Promise((resolve, reject) => {
        leerProductos().then(data => {
            data.productos.push(nuevoProducto);
            fs.writeFile("productos.json", JSON.stringify(data, null, 4), "utf8", (error) => {
                if(error){
                    return reject("error al guardar el producto")
                }
                resolve(nuevoProducto.nombre)   
            })
        })
    })
};

const borrarProductoPorId = (sku) => {
    return new Promise((resolve, reject) => {
        leerProductos().then(data => {

            let dataEliminar = data.productos.find(producto => producto.sku == sku);
            let arrayImagenes = [dataEliminar.imagen1, dataEliminar.imagen2, dataEliminar.imagen3]

            if(dataEliminar){
                let filterProductos = data.productos.filter(producto => producto.sku != sku);
                data.productos = filterProductos;

                arrayImagenes.forEach(img => fs.unlinkSync("./public/img/"+img, (error)=>{
                    if(error) {return reject("error al eliminar imagen del producto")}
                }));

                fs.writeFileSync("productos.json", JSON.stringify(data, null, 4), 'utf8', (error) => {
                    if(error){
                        return reject("error al eliminar el producto")
                    }                    
                })
                resolve('producto eliminado')  
            }else{
                reject("error al eliminar el producto");
            }
        })
    })
};

const leerVentas = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("ventas.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al leer las ventas");
            let ventas = JSON.parse(data)
            resolve(ventas)
        })
    })
};

const leerVentasPorId = (id) => {
    return new Promise((resolve, reject) => {
        fs.readFile("ventas.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al cargar las ventas.");
            let ventas = JSON.parse(data)
            let found = ventas.ventas.find(venta => venta.id == id);
            if(found){
                resolve(found)
            }else{
                reject("Producto no encontrado.")
            }
        })
    })
};

const agregarVenta = (nuevaVenta) => {
    return new Promise((resolve, reject) => {
        leerVentas().then(data => {
            data.ventas.push(nuevaVenta);
            fs.writeFile("ventas.json", JSON.stringify(data, null, 4), "utf8", (error) => {
                if(error){
                    return reject("error al guardar la venta")
                }
                resolve(nuevaVenta.id)   
            })
        })
    })
};

const modificarStock = (productosCarro) => {
    return new Promise((resolve, reject) => {
        leerProductos().then(data => {
            productosCarro.forEach(producto => {
                let sku = producto.codigo
                let cantidad = producto.cantidad
                const indice = data.productos.findIndex(producto => producto.sku == sku);
                if(indice>=0){
                    let stock = data.productos[indice].stock - cantidad
                    data.productos[indice].stock = stock
                    fs.writeFileSync("productos.json", JSON.stringify(data, null, 4), 'utf8', (error) => {
                        if(error){
                            return reject('producto no encontrado')
                        }                    
                    })
                    resolve('stock del producto fue modificado')
                }
            })
        })
    })
};

const leerUsuarios = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("usuarios.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al leer los usuarios");
            let usuarios = JSON.parse(data)
            resolve(usuarios)
        })
    })
};

const leerUsuarioPorId = (id) => {
    return new Promise((resolve, reject) => {
        fs.readFile("usuarios.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al cargar los usuarios.");
            let usuarios = JSON.parse(data)
            let found = usuarios.usuarios.find(user => user.id == id);
            if(found){
                resolve(found)
            }else{
                reject("Producto no encontrado.")
            }
        })
    })
};

// RUTAS DE VISTAS

app.get("/", (req, res) => {
    leerProductos().then(productos=> {
        let productosConStock = productos.productos.filter(producto => producto.stock > 0)
        res.render("home", {
            productosConStock, title: 'home'
        });
    }).catch(error => {
        res.render("home", {
            error
        });
    })
});

app.get("/usuario", (req, res) => {
    let id = req.query.id
    leerUsuarioPorId(id).then(usuario=> {
        let arrayUser = []
        arrayUser.push(usuario)
        res.render("usuario", {
            arrayUser, title: 'Pagina interna usuario'
        });
    }).catch(error => {
        res.render("usuario", {
            error
        });
    })
});

app.get("/usuario/buscador", (req, res) => {
    res.render("buscador", {title: 'Buscador'});
});

app.get("/usuario/inventario", (req, res) => {
    leerProductos().then(productos=> {
        res.render("inventory", {
            productos, title: 'Inventario'
        });
    }).catch(error => {
        res.render("inventory", {
            error
        });
    })
});

app.get("/cart", (req, res) => {
    leerProductos().then(productos=> {
        res.render("cart", {
            productos, title: 'carro de compras'
        });
    }).catch(error => {
        res.render("cart", {
            error
        });
    })
});

app.get("/detalleProducto/:id", (req, res) => {
    let { id } = req.params;
    leerProductosPorId(id).then(producto => {
        let arrayproductos = []
        arrayproductos.push(producto)
        res.render("detalleProducto", {
            arrayproductos, title: 'detalle producto'
        })

    }).catch(error => {
        res.render("detalleProducto", {
            error
        })
    })
});

app.get("/default", (req, res) => {
    res.render("default", {title: 'Pagina en construccion'});
});


// RUTAS ENDPOINTS
app.get("/productos", (req, res) => {
    leerProductos().then(productos => {
        res.json(productos)
    }).catch(error => {
        res.status(500).json({code:500, message: error})
    })
});

app.get("/producto/:id", (req, res) => {
    let { id } = req.params;
    leerProductosPorId(id).then(producto => {
        res.send(producto)
    }).catch(error => {
        res.status(500).json({code:500, message: error})
    })
})

app.put("/producto", (req, res) => {
    let {sku, nombre, marca, descripcion, precio, stock} = req.body;
    precio = parseInt(precio);
    stock = parseInt(stock);

    if (!req.files) {
        return res.send({
            message: 'No se subió imagen!'
        });
    }

    const file = req.files;
    let fileArray = []

    for (const key in file) {
        fileArray.push(file[key]);
    }

    function move(image) {
        let ruta = __dirname + '/public/img/' + image.name
        try { image.mv(ruta); }
        catch (error) {
            return res.send({
                message: 'error al subir archivo'
            });
        }
    }

    Array.isArray(fileArray) ? fileArray.forEach((file) => move(file)) : move(file);
    
    let productoActualizado = {
        sku,
        nombre, 
        marca,
        descripcion,
        precio,
        stock,
        imagen1: fileArray[0].name,
        imagen2: fileArray[1].name,
        imagen3: fileArray[2].name  
    }

    leerProductos().then(productos => {
        let indice = productos.productos.findIndex(producto=>
            producto.sku == sku)
        if(indice >= 0){
            productos.productos[indice] = productoActualizado;
            fs.writeFile("productos.json", JSON.stringify(productos, null, 4), "utf8", (error) => {
                if(error){
                    return res.status(501).json("error al actualizar el producto")
                }
            })
        }else{return res.status(501).send("error al actualizar el producto")}

        res.status(201).json(`Producto sku: ${productoActualizado.sku} actulizado correctamente`)
    }).catch(error => {
        res.status(501).send({code: 501, error})
    });
});

app.post("/producto", (req, res) => {
    let {nombre, marca, descripcion, precio, stock} = req.body;
    precio = parseInt(precio);
    stock = parseInt(stock);
    if (!req.files) {
        return res.send({
            message: 'No se subió imagen!'
        });
    }

    const file = req.files;
    let fileArray = []

    for (const key in file) {
        fileArray.push(file[key]);
    }

    function move(image) {
        let ruta = __dirname + '/public/img/' + image.name
        try { image.mv(ruta); }
        catch (error) {
            return res.send({
                message: 'error al subir archivo'
            });
        }
    }

    Array.isArray(fileArray) ? fileArray.forEach((file) => move(file)) : move(file);

    let nuevoProducto = {
        sku: uuid().slice(0,6),
        nombre, 
        marca,
        descripcion,
        precio,
        stock,
        imagen1: fileArray[0].name,
        imagen2: fileArray[1].name,
        imagen3: fileArray[2].name
    }

    agregarProducto(nuevoProducto).then(producto => {
        res.status(201).send({code: 201, nuevoProducto})
    }).catch(error => {
        res.status(501).send({code: 501, error})
    })
});


app.delete("/producto/:sku", (req, res) => {
    let { sku } = req.params;
    borrarProductoPorId(sku).then(respuesta => {
        res.json(`Producto sku: ${sku} ha sido eliminado`)
    }).catch(error => {
        res.status(500).json({code: 500, error})
    })
});

app.get("/ventas", (req, res) => {
    leerVentas().then(ventas => {
        res.json(ventas)
    }).catch(error => {
        res.status(500).json({code:500, message: error})
    })
});

app.get("/venta/:id", (req, res) => {
    let { id } = req.params;
    leerVentasPorId(id).then(venta => {
        res.send(venta)
    }).catch(error => {
        res.status(500).json({code:500, message: error})
    })
});

app.post("/venta", (req, res) => {
    let {productosCarro, precioTotalCompra} = req.body;
    let nuevaVenta = {
        id: uuid().slice(0,8),
        fecha: moment().format('DD-MM-YYYY'),
        productosCarro,
        precioTotalCompra
    } 
    agregarVenta(nuevaVenta).then(venta => {
        res.status(201).send({code: 201, nuevaVenta})
    }).catch(error => {
        res.status(501).send({code: 501, error})
    }).then(function(){
        modificarStock(productosCarro);
    })
});

app.get("/usuarios/", (req, res) => {
    leerUsuarios().then(usuarios => {
        res.send(usuarios)
    }).catch(error => {
        res.status(500).json({code:500, message: error})
    })
});

