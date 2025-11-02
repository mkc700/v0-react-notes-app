// ventana de logeo

import React from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";


export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.header} TextID="header">

      </View>
      <View style={styles.body} TextID="body">
        <Text>esta es la ventana de login</Text>
        
        
        <Button title="Regresar a home" onPress={() => navigation.navigate('Home')} style={styles.button} />
      
        <Button title="Entrar a la aplicacion" onPress={() => navigation.navigate('Notes')} style={styles.button}  />
        
      </View>
      <View style={styles.footer} TextID="footer">

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { 
    display: 'flex', 
    flexDirection: 'Column' ,
    backgroundColor: "#fff",  
  },

  header:{ backgroundColor: "#f0f0f0", height: "20%" },
  body: { Height: "60%" },
  footer: {backgroundColor: "#f0f0f0", Height: 150, height: "20%" },

  button: { width: '60%', marginVertical: 8, justifyContent: 'center', },

});

// en este punto: para android cambie los styles de flexcontainer a body, header y footer respectivamente 