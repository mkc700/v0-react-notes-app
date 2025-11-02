import React, { useState } from "react";
import { StyleSheet,Text,View, TextInput, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import { authService } from '../Service/authService';
import { Alert } from 'react-native';
import { Image } from "react-native";

export default function SignupScreen({ navigation }) {
    const [formData, setFormData] = useState({nombre: '',email: '',password: '',confirmPassword: ''});

    const handleSignup = async () => {
  // Validaciones básicas
  if (!formData.nombre || !formData.email || !formData.password) {
    Alert.alert("Error", "Por favor completa todos los campos");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    Alert.alert("Error", "Las contraseñas no coinciden");
    return;
  }

  if (formData.password.length < 6) {
    Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    const result = await authService.signUp(
      formData.email, 
      formData.password, 
      formData.nombre
    );

    if (result.success) {
      Alert.alert("Éxito", "Cuenta creada correctamente");
      navigation.navigate('Notes');
    } else {
      Alert.alert("Error", result.error);
    }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error inesperado");
  }
};
    
    

    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    return (
        <KeyboardAvoidingView 
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    <Text style={styles.logo}>📝</Text>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Únete a Friga y organiza tus ideas</Text>
                </View>

                
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu nombre"
                            placeholderTextColor="#999"
                            value={formData.nombre}
                            onChangeText={(text) => updateFormData('nombre', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            placeholderTextColor="#999"
                            value={formData.email}
                            onChangeText={(text) => updateFormData('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
                            placeholderTextColor="#999"
                            value={formData.password}
                            onChangeText={(text) => updateFormData('password', text)}
                            secureTextEntry
                            autoComplete="password-new"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Repite tu contraseña"
                            placeholderTextColor="#999"
                            value={formData.confirmPassword}
                            onChangeText={(text) => updateFormData('confirmPassword', text)}
                            secureTextEntry
                            autoComplete="password-new"
                        />
                    </View>

                    
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                            Al registrarte, aceptas nuestros{' '}
                            <Text style={styles.link}>Términos de servicio</Text> y{' '}
                            <Text style={styles.link}>Política de privacidad</Text>
                        </Text>
                    </View>

                    
                    <TouchableOpacity 
                        style={styles.signupButton}
                        onPress={handleSignup}
                    >
                        <Text style={styles.signupButtonText}>Crear Cuenta</Text>
                    </TouchableOpacity>

                   
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

           
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.backButtonText}>← Regresar al Inicio</Text>
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
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 30,
    },
    logo: {
        fontSize: 50,
        marginBottom: 16,
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
        paddingBottom: 30,
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
    termsContainer: {
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    termsText: {
        fontSize: 14,
        color: "#718096",
        textAlign: "center",
        lineHeight: 20,
    },
    link: {
        color: "#4299E1",
        fontWeight: "600",
    },
    signupButton: {
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
    signupButtonText: {
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
    loginLinkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    loginText: {
        fontSize: 14,
        color: "#718096",
    },
    loginLink: {
        fontSize: 14,
        color: "#4299E1",
        fontWeight: "600",
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
    },
    backButton: {
        alignItems: "center",
        paddingVertical: 12,
    },
    backButtonText: {
        color: "#718096",
        fontSize: 14,
        fontWeight: "500",
    },
});