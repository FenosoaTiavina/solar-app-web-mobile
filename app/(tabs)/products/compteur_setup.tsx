import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';
import { useProductContext, Product } from '@/context/ProductContext';

export default function CompteurSetupScreen() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const { addInstalledProduct } = useProductContext();

    const [deviceId, setDeviceId] = useState('');
    const [wifiName, setWifiName] = useState('');
    const [password, setPassword] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = () => {
        if (!deviceId || !wifiName || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs pour connecter et lier votre appareil.");
            return;
        }

        setIsConnecting(true);

        setTimeout(() => {
            setIsConnecting(false);
            const date = new Date().toISOString().split('T')[0];

            // Liste des produits à ajouter automatiquement
            const productsToAdd: Product[] = [
                {
                    nom: 'Panneau solaire Pro',
                    ref_produit: `SOLAR-${deviceId}`,
                    prix: 6000000,
                    date_creation: date,
                    stock: 1,
                    status: 'Actif',
                    specs: [
                        { cle: 'Puissance', valeur: 350, unit: 'W' },
                        { cle: 'Poids', valeur: 20, unit: 'kg' },
                    ],
                },
                {
                    nom: 'Stockage de batterie 10kWh',
                    ref_produit: `BATT-${deviceId}`,
                    prix: 9000000,
                    date_creation: date,
                    stock: 1,
                    status: 'Actif',
                    specs: [
                        { cle: 'Capacité', valeur: 10, unit: 'kWh' },
                        { cle: 'Tension', valeur: 48, unit: 'V' },
                    ],
                },
                {
                    nom: 'Compteur intelligent v2',
                    ref_produit: deviceId,
                    prix: 1500000,
                    date_creation: date,
                    stock: 1,
                    status: 'Actif',
                    specs: [{ cle: 'Tension', valeur: 220, unit: 'V' }],
                },
            ];

            // Ajoutez chaque produit à l'état global
            productsToAdd.forEach(product => addInstalledProduct(product));

            Alert.alert(
                "Succès",
                `Votre compteur (ID : ${deviceId}) a été lié et a ajouté tous les produits de l'installation.`
            );

            router.back();
        }, 3000);
    };

    // <Stack.Screen
    //     options={{
    //         title: 'Configuration de l\'appareil',
    //         headerShown: true,
    //         headerStyle: { backgroundColor: COLORS[theme].background },
    //         headerTitleStyle: { color: COLORS[theme].text },
    //         headerTintColor: COLORS[theme].text,
    //     }}
    // />


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: COLORS[theme].background }]}>
                <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.title, { color: COLORS[theme].text }]}>Connectez et liez votre appareil</Text>
                    <Text style={[styles.description, { color: COLORS[theme].subText }]}>
                        Entrez l'ID unique de votre appareil et les informations d'identification de votre Wi-Fi domestique pour le lier à votre compte.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>ID de l'appareil / Numéro de série</Text>
                        <TextInput
                            style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].inputText }]}
                            placeholder="par ex., ABC-123-XYZ"
                            placeholderTextColor={COLORS[theme].subText}
                            value={deviceId}
                            onChangeText={setDeviceId}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Nom du réseau Wi-Fi (SSID)</Text>
                        <TextInput
                            style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].inputText }]}
                            placeholder="Mon Wi-Fi domestique"
                            placeholderTextColor={COLORS[theme].subText}
                            value={wifiName}
                            onChangeText={setWifiName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Mot de passe</Text>
                        <TextInput
                            style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].inputText }]}
                            placeholder="Entrez le mot de passe"
                            placeholderTextColor={COLORS[theme].subText}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: COLORS[theme].primary, ...SHADOWS[theme] }]}
                        onPress={handleConnect}
                        disabled={isConnecting}
                    >
                        <Text style={styles.buttonText}>{isConnecting ? 'Liaison en cours...' : 'Lier l\'appareil'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: SIZES.padding * 2,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: SIZES.padding,
    },
    inputGroup: {
        width: '100%',
        marginBottom: SIZES.margin,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: SIZES.borderRadius,
        borderWidth: 1,
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
        marginTop: SIZES.margin,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
