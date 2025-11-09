import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import { authService } from '../Service/authService';
import { Alert } from 'react-native';
import { Image } from "react-native";
export default function LoginScreen({ navigation }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    Alert.alert("Error", "Por favor completa todos los campos");
    return;
  }

  try {
    const result = await authService.signIn(formData.email, formData.password);

    if (result.success) {
      Alert.alert("Éxito", "Sesión iniciada correctamente");
      navigation.navigate('Notes');
    } else {
      Alert.alert("Error", result.error);
    }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error inesperado");
  }
};

    return (
        <KeyboardAvoidingView 
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    <Text style={styles.logo}>📝</Text>
                    <Text style={styles.title}>Bienvenido papu nuevo</Text>
                    <Text style={styles.subtitle}>Ingresa a tu cuenta de Friga</Text>
                </View>

                
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            placeholderTextColor="#999"
                            value={formData.email}
                            onChangeText={(text) => setFormData({...formData, email: text})}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#999"
                            value={formData.password}
                            onChangeText={(text) => setFormData({...formData, password: text})}
                            secureTextEntry
                        />
                    </View>

                    
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    
                    <TouchableOpacity 
                        style={styles.signupButton}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.signupButtonText}>Crear una cuenta nueva</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.backHomeButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.backHomeButtonText}>← Regresar al Inicio</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 30,
    },
    logo: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2D3748",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#718096",
        textAlign: "center",
        lineHeight: 22,
    },
    formContainer: {
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A5568",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#F7FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: "#2D3748",
    },
    forgotPassword: {
        alignItems: "flex-end",
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: "#4299E1",
        fontSize: 14,
        fontWeight: "500",
    },
    loginButton: {
        backgroundColor: "#4299E1",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 25,
        shadowColor: "#4299E1",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
    },
    dividerText: {
        color: "#718096",
        paddingHorizontal: 15,
        fontSize: 14,
        fontWeight: "500",
    },
    signupButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#4299E1",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    signupButtonText: {
        color: "#4299E1",
        fontSize: 16,
        fontWeight: "600",
    },
    
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        backgroundColor: "#F7FAFC",
    },
    backHomeButton: {
        alignItems: "center",
        paddingVertical: 12,
    },
    backHomeButtonText: {
        color: "#718096",
        fontSize: 16,
        fontWeight: "500",
    },
    logoImage:{
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 10,
    },
});