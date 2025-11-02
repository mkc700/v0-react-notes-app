// screens/HomeScreen.js

import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 1. ¡Esta pantalla SÍ recibe { navigation }!
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.flexContainer}>
        <View testID="header" style={styles.header}>
          <Text>este es el header</Text>
          <StatusBar style="auto" />
          {/* <Button title="hola" style={styles.button} /> */}
        </View>

        <View TestID="body" style={styles.body}>
          <Text>este es el cuerpo
          aqui tenemos la pantalla de inicio donde ira el logo de la aplicacion, algo asi como la ventana de bienvenida
          </Text>
          <Text style={styles.TextO}>Welcome to Friga early version 0.13 </Text>
          <Button title="Login" onPress={() => navigation.navigate('Login')} style={styles.button}/>
        
          <Button title="Signup" onPress={() => navigation.navigate('Signup')} style={styles.button}/>
        </View>

        <View style={styles.footer} testID="footer">
          <ScrollView>
            <Text>
              Lorem Ipsum is a placeholder text commonly used...
            </Text>
          
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

// Tus estilos (los que tenías en App.js)
const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#fff' },
  flexContainer: { flex: 1 },
  header: { padding: 10, backgroundColor: '#f0f0f0',height:'20%' },
  body: { flex: 1, padding: 10 , height:'60%'},
  footer: { padding: 10, backgroundColor: '#f0f0f0', maxHeight: 150, height:'20%' },
  button: { padding: 10, backgroundColor: '#841584', width:'40%'  }, 
  TextO: { fontSize: 60, fontWeight: 'bold', marginTop: 20, marginBottom: 20, justifyContent: 'Center' },
});