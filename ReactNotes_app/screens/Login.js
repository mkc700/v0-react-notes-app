// ventana de logeo

import React from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";


export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.flexContainer} TextID="header">

      </View>
      <View style={styles.flexContainer} TextID="body">
        <Text>esta es la ventana de login</Text>
        <Button title="Regresar a home" onPress={() => navigation.navigate('Home')} />
        <br></br>
        <Button title="Entrar a la aplicacion" onPress={() => navigation.navigate('Notes')} />
      </View>
      <View style={styles.flexContainer} TextID="footer">

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
});
