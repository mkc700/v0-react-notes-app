import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function NotesScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.flexContainer}>
      <View textID="header" style={styles.header}>
        <Text>este es el header</Text>
        <StatusBar style="auto" />
      </View>
      <View textID="body" style={styles.body}>
      <Button
                  title="Regresar"
                  onPress={() => navigation.navigate('Home')} 
                />
        <Text>este es el cuerpo</Text>
      </View>
      <View style={styles.footer} textID="footer">
      <ScrollView>
        <Text>este es el footer</Text>
        <Text>
          Lorem Ipsum is a type of placeholder text commonly used in the
          printing and typesetting industry. It has been the standard dummy text
          since the 1500s, originating from a scrambled version of a work by a
          Roman philosopher. It helps designers visualize how text will look in
          a layout without needing the final content. Today, it is widely used
          in graphic design and web development to fill spaces in drafts and
          presentations. Lorem Ipsum +3 Lorem Ipsum Lorem Ipsum - All the facts
          - Lipsum generator Solopress UK ¿Qué es Lorem Ipsum y por qué se
          utiliza? - Solopress Ver todo
        </Text>
        </ScrollView>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#7f87a1ff',
    height: '100%',
    width: '100%',
  },

  button: {
    width: 100,
    height: 50,
    backgroundColor: '#841584',
  },

  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7d9ecfff',
    padding: 10,
    height: '20%',
  },
  
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4d5b70ff',
    padding: 10,
    height: '60%',
  },

  footer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59b944ff',
    padding: 10,
    height: '20%',
  },

});