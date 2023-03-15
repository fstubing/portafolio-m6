# PROYECTO PORTAFOLIO MÓDULO 6

## ALUMNO

FERNANDO STUBING ALVEAR

## CUENTA DE GITHUB

https://github.com/fstubing

## LINK AL PROYECTO PORTAFOLIO MODULO 6

[PROYECTO PORTAFOLIO MODULO 6](https://github.com/fstubing/portafolio-m6)

## PARA TENER PRESENTE EN EL USO DE LA APP
- Al renderizar el proyecto, desde el home se puede ir a las vistas de buscador, inventory y usuario, ingresando a través del login de usuario.
- Los usuarios y password se pueden rescatar del archivo json 'usuarios.json'. Para su revisión se puede usar cualquiera, como por ejemplo usuario: Pedro43, password: 123456
- Para modificar un producto se requiere llenar todos los campos y subir las tres imagenes, debido a que el frontend necesita de ellas para su correcto funcionamiento.

## CONTENIDO DEL PROYECTO

- Se desarrolla un ecommerce que contiene una api rest y un frontend que la consume. La información rescatada por la api se extrae de archivos .json. Se utilizó como base el portafolio desarrollado para el módulo 4, debiendo por tanto modificar la lógica de los archivos .js y la estructura html.
- El archivo index.js contiene el servidor y extructura de la api desarrollada con node express. Se utilizaron diversos paquetes npm como moment, uuid y handlebars.
- En index.js se intentó dividir dentro del mismo archivo la lógica, en endpoints, rutas de vistas y funciones controladoras.
- Se cumplen con las rutas básicas solicitas y se agregan algunas más para mejorar su funcionalidad.
- Las lógicas del carrito de compras y del inventario están vinculadas, de modo que si, por ejemplo, se generase una compra se produce una retroalimentación rebajándose el stock del producto.
- Se crearon archivos .json para hacer las veces de base de datos para las ventas, productos y usuarios.
- El front de la aplicación se desarrolló principalmente con handlebars, utilizando variadas vistas y un layout. Asimismo, se utilizó un helper buil-in (each).