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
        
        <View style={styles.buttonWrapper}> 
        <Button title="Regresar a home" onPress={() => navigation.navigate('Home')} />
        </View>

        <View style={styles.buttonWrapper}>
        <Button title="Entrar a la aplicacion" onPress={() => navigation.navigate('Notes')} />
        </View>
      </View>
      <View style={styles.footer} TextID="footer">

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { display: 'flex', flexDirection: 'Column' , backgroundColor: "#fff" },
  header:{ padding: 10, backgroundColor: "#f0f0f0", height: "20%" },
  body: { flex: 1, padding: 10, height: "60%" },
  footer: { padding: 10, backgroundColor: "#f0f0f0", maxHeight: 150, height: "20%" },
  flexContainer: { flex: 1 },
  buttonWrapper: { width: '60%', marginVertical: 8 },
});

// en este punto: para android cambie los styles de flexcontainer a body, header y footer respectivamente 