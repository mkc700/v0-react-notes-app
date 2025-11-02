// react-native-gesture-handler must be imported at the top-level before any navigation
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './forge';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// App.js (¡Este ya debe estar correcto!)


/*

El flujo es una cadena clara. Piensa en ello como cajas, una dentro de otra:

index.js solo conoce a forge.js.

App.js solo conoce a routes.js (y al NavigationContainer).

routes.js solo conoce tus pantallas (HomeScreen, principal.js).





*/
