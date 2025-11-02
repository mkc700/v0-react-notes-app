import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Calendar({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Button title="Abrir Drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 12 }
});