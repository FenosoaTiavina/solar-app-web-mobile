import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';

export default function CompteurSetupScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

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

    // Ceci simule le processus de liaison basé sur le cloud
    setTimeout(() => {
      setIsConnecting(false);
      Alert.alert(
        "Succès",
        `Votre compteur (ID : ${deviceId}) a été lié et connecté avec succès. Vous pouvez maintenant consulter ses données en temps réel.`
      );

      // Naviguer l'utilisateur vers l'écran des produits ou une vue de données
      router.back();
      console.log(`Liaison de l'ID de l'appareil : ${deviceId} au compte de l'utilisateur.`);
    }, 3000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          title: 'Configuration du compteur',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS[theme].background },
          headerTitleStyle: { color: COLORS[theme].text },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
          <Text style={[styles.title, { color: COLORS[theme].text }]}>Connectez et liez votre compteur</Text>
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
