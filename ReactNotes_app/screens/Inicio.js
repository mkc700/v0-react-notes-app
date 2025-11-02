// screens/HomeScreen.js

import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';



export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.flexContainer}>
        <View testID="header" style={styles.header}>
          <Text>este es el header</Text>
        </View>

        <View testID="body" style={styles.body}>
          <Text>este es el cuerpo
          aqui tenemos la pantalla de inicio donde ira el logo de la aplicacion, algo asi como la ventana de bienvenida
          </Text>
          <Text style={styles.TextO}>Welcome to Friga early version 0.13 </Text>
         
          <View style={styles.buttonWrapper}>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
          </View>
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


const styles = StyleSheet.create({
  background: {
flex: 1,
backgroundColor: '#fff'
},
flexContainer: {
flex: 1,
flexDirection: 'column'
},

header: {
padding: 10,
backgroundColor: '#f0f0f0',
height: '20%',
alignItems: 'center',
justifyContent: 'center'
},

body: {
flex: 1,
padding: 16,
alignItems: 'center',
justifyContent: 'center'
},

footer: {
padding: 10,
backgroundColor: '#f0f0f0',
height: '20%',
alignItems: 'center',
justifyContent: 'center'
},

buttonWrapper: {
width: '70%',
marginVertical: 10
},

TextO: {
fontSize: 20,
fontWeight: 'bold',
marginTop: 12,
marginBottom: 12,
textAlign: 'center'
}
});