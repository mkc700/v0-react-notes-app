// App.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importa tus pantallas
import HomeScreen from '../screens/Inicio';
import NotesScreen from '../screens/Notes_dev/Notes';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 2. Define tus pantallas. La primera de la lista es la inicial. */}
        <Stack.Screen 
          name="Home" // Este es el nombre que usaremos para navegar
          component={HomeScreen} 
          options={{ title: 'pantalla de inicio' }} // Título en el header
        />
        <Stack.Screen 
          name="Notes" // Este es el nombre de tu segunda pantalla
          component={NotesScreen} 
          options={{ title: 'Principal' }}
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

