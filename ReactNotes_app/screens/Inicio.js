import React from 'react';
import { Image } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.background}>
            <StatusBar style="auto" />
            
            
            <View style={styles.cornerButtons}>
                <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.signupButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <Text style={styles.logo}>📝</Text>
                    <Text style={styles.appName}>Friga</Text>
                    <Text style={styles.version}>v0.13</Text>
                </View>

                <View style={styles.body}>
                    <Text style={styles.welcomeTitle}>Bienvenido</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Tu espacio para capturar ideas y organizar pensamientos
                    </Text>
                    
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>✨</Text>
                            <Text style={styles.featureText}>Notas rápidas</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔒</Text>
                            <Text style={styles.featureText}>Seguro y privado</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📱</Text>
                            <Text style={styles.featureText}>Sincronización</Text>
                        </View>
                    </View>
                </View>
            </View>

            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Friga - Donde tus ideas toman forma
                </Text>
                <Text style={styles.copyright}>
                    © 2024 Todos los derechos reservados
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { 
        flex: 1, 
        backgroundColor: '#ffffff' 
    },
    cornerButtons: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        gap: 10,
        zIndex: 10,
    },
    loginButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#667eea',
    },
    loginButtonText: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '600',
    },
    signupButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    signupButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
        marginTop: 100, // Espacio para los botones
    },
    header: {
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 20,
    },
    logo: {
        fontSize: 50,
        marginBottom: 10,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    version: {
        fontSize: 14,
        color: '#e2e8f0',
        fontWeight: '500',
    },
    body: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3748',
        textAlign: 'center',
        marginBottom: 10,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    featuresContainer: {
        marginVertical: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f7fafc',
        borderRadius: 12,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    featureText: {
        fontSize: 16,
        color: '#4a5568',
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
        marginBottom: 5,
    },
    copyright: {
        fontSize: 12,
        color: '#a0aec0',
    },
});