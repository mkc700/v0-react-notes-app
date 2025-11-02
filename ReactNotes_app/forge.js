import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// 1. Asegúrate de que la ruta a tu archivo de rutas es correcta
import AppNavigator from './routes/route'; 

export default function App() {
  return (
    // GestureHandlerRootView envuelve la app para que los gestos (drawer, swipes) funcionen correctamente
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}