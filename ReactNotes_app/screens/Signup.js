// ventana de logeo

import React from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";


export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.header} TextID="header">
        <Text>este es el header Signup</Text>
      </View>
      <View style={styles.body} TextID="body">
        <Text>esta es la ventana de Signup</Text>
         <Button
                          title="Regresar a home"
                          onPress={() => navigation.navigate('Home')} 
                        />
      </View>
      <View style={styles.footer}  TextID="footer">
    <Text>Footer Signup</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { display: 'flex', flexDirection: 'Column' , backgroundColor: "#fff" },
  header:{ padding: 10, backgroundColor: "#f0f0f0", height: "20%" },
  body: { flex: 1, padding: 10, height: "60%" },
  footer: { padding: 10, backgroundColor: "#f0f0f0", maxHeight: 150, height: "20%" },
  
});
