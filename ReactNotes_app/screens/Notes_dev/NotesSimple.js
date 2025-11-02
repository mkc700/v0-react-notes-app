import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function NotesSimple({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Mis Notas (temporal)</Text>
      <View style={styles.row}>
        <Button title="Abrir/Cerrar drawer" onPress={() => navigation.toggleDrawer()} />
      </View>
      <View style={styles.row}>
        <Button title="Volver a Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    marginBottom: 20
  },
  row: {
    marginVertical: 8
  }
});