import React from 'react';
import { Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Usamos una versión simple y estable de la pantalla de notas para garantizar compatibilidad
import NotesScreen from '../screens/Notes_dev/NotesMain';
import Timers from '../screens/Notes_dev/Timers';
import Calendar from '../screens/Notes_dev/Calendar';
import Lists from '../screens/Notes_dev/Lists';
import Settings from '../screens/Notes_dev/Settings';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

// Puedes añadir aquí otras pantallas que pertenezcan a la sección Notes

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        // Compatibilidad básica para web y Android
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.3)',
        drawerStyle: { width: 260 },
      }}
    >

      <Drawer.Screen
        name="notes_main"
        component={NotesScreen}
        options={({ navigation }) => ({
          title: 'Notas',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="timers"
        component={Timers}
        options={({ navigation }) => ({
          title: 'Timers',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="calendar"
        component={Calendar}
        options={({ navigation }) => ({
          title: 'Calendar',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="lists"
        component={Lists}
        options={({ navigation }) => ({
          title: 'Lists',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="settings"
        component={Settings}
        options={({ navigation }) => ({
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
          ),
        })}
      />

    </Drawer.Navigator>
  );
}