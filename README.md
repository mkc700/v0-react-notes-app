
esta es una aplicacion de notas con diferentes implementaciones 

hicimos uso de npm para manejar diferentes librerias iniciales de react

-  react navigation drawer
- react navigation
- react native gesture handler
- reac native reanimated
- react native safe area context
- react native screens
- react native 

empezaremos a hablar del flujo de archivos y detalles sobre la marcha 

===notas==

$$comandos- en- terminal$$
- npx expo start: comando para iniciar el servidor
-  npx expo start -c: iniciar el servidor local y limpiar el cache


![[ReactNotes_app/resources/Pasted image 20251102133846.png]]

en ==index .js==  se importa el gesture handler para el uso del drawer en la aplicacion y creamos la instancia de la carga de la aplicacion y que el empaquetado para android funcione propiamente, de ahi nos redirige a ==forge.js== donde instanciamos el navigation container que permitira la navegacion entre diferentes pantallas.

de ahi se redirige a donde estaran las rutas de las pantallas y la navegacion funcional: con el componente de stack navigator y las pantallas en ==routes.js== crearemos el esquema funcional de la aplicacion 

==inicio.js== es la primera ventana que ve el usuario, la ventana de bienvenida de la aplicacion , la sintaxis de react en la parte de la estructura de componentes se me asemeja mucho a html y los stylesheet a css, asi que es cuestion de crearlo con eso en mente, y con ciertas precauciones que se resuelven consultando la documentacion oficial, lo mas util para mi al momento fue estar consultando:

https://reactnavigation.org/

**la documentacion de react navigation para las ventanas y tal**

public maid: voy a meter cosas random aca

  

comandos de github:

  

para volcar el arbol local para tomar el del servidor y que sea identico al del servidor,

  

git reset --hard origin/main

  

borra el ultimo commit y todos los cambios

  

git reset --hard HEAD~1

  

descarta cambios de un archivo que aun no guardas

  

git restore <archivo>

  
  

para la instalacion basica de desarrollo de esta aplicacion, hicimos uso de npm

  

npx react-native@latest init TuNombreDeApp

  
  

## error de servicios remotos

  

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
