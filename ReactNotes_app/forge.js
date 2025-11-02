import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// 1. Asegúrate de que la ruta a tu archivo de rutas es correcta
import AppNavigator from './routes/route'; 

export default function App() {
  return (
    // 2. Aquí CARGAS el navegador
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}