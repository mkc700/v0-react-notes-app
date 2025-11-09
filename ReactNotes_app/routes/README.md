Resumen de cambios previos

- Añadí configuración para ocultar el botón "back" globalmente en `routes/route.js` y deshabilitar gestos de retroceso.
- Preparé un Drawer Navigator inicial (`routes/drawer.js`) y añadí un `GestureHandlerRootView` en `forge.js` y la importación de `react-native-gesture-handler` en `index.js` para asegurar compatibilidad Android/web.
- Creé `screens/Notes_dev/NotesSimple.js` y lo usé inicialmente para garantizar estabilidad.

Qué hice ahora

- Añadí 5 pantallas accesibles desde el Drawer (solo dentro de la sección Notes):
  - `notes_main` (componente: `screens/Notes_dev/NotesMain.js`)
  - `timers` (componente: `screens/Notes_dev/Timers.js`)
  - `calendar` (componente: `screens/Notes_dev/Calendar.js`)
  - `lists` (componente: `screens/Notes_dev/Lists.js`)
  - `settings` (componente: `screens/Notes_dev/Settings.js`)

- Actualicé `routes/drawer.js` para exponer esas 5 entradas del Drawer. Cada pantalla en el Drawer tiene una opción `headerLeft` que renderiza un botón (☰) en la esquina superior izquierda que llama a `navigation.toggleDrawer()`.

Notas de uso y pruebas

- El Drawer solo está disponible cuando entras en la pantalla `Notes` desde el Stack principal, porque en `routes/route.js` la ruta `Notes` carga `DrawerNavigator`.
- Para abrir el Drawer desde cada pantalla (además del botón de la cabecera), puedes usar en cualquier componente `navigation.toggleDrawer()` / `navigation.openDrawer()` / `navigation.closeDrawer()`.

Archivos añadidos/modificados

- Añadidos:
  - `screens/Notes_dev/NotesMain.js`
  - `screens/Notes_dev/Timers.js`
  - `screens/Notes_dev/Calendar.js`
  - `screens/Notes_dev/Lists.js`
  - `screens/Notes_dev/Settings.js`
- Modificados:
  - `routes/drawer.js` (agregué las entradas del Drawer y el `headerLeft` para abrir el Drawer)
  - `routes/route.js` (sigue cargando el Drawer en la ruta `Notes`)
  - `index.js` (import `react-native-gesture-handler` al inicio)
  - `forge.js` (envolví la app con `GestureHandlerRootView`)

Siguientes pasos (opcionales)

- Reemplazar el botón de texto ☰ por un ícono (p. ej. `react-native-vector-icons`) y aplicarle estilos (margen, tamaño, color).
- Si prefieres que cada sección del Drawer tenga su propio Stack (para navegación interna), puedo crear un stack por sección y ponerlo como componente del `Drawer.Screen`.
- Puedo añadir contenido personalizado al Drawer (`drawerContent`) con avatar, enlaces y logout.


saquen al puto pedromon y que me la mamen los demas