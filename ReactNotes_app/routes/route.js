// routes/route.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importa tus pantallas
import HomeScreen from '../screens/Inicio';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';
import DrawerNavigator from './drawer';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // mostramos header pero ocultamos el botón "back" y desactivamos gestos
        headerShown: false,
        headerBackVisible: false,
        // Asegura que no se renderice nada a la izquierda (sin back icon)
        headerLeft: () => null,
        gestureEnabled: false,
        headerStyle: { backgroundColor: '#d2d8adff' },
        headerTintColor: '#333',
        headerTitleAlign: 'center',
      }}
    >
      {/* 2. Define tus pantallas. La primera de la lista es la inicial. */}
      <Stack.Screen 
        name="Home" // Este es el nombre que usaremos para navegar
        component={HomeScreen} 
        options={{ title: 'pantalla de inicio' }} // Título en el header
      />
      <Stack.Screen 
        name="Notes"
        component={DrawerNavigator}
        options={{ headerShown: false }} // Usamos el header del Drawer/Stack interno
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ title: 'Signup' }}
      />
    </Stack.Navigator>
  );
}

// definimos las rutas