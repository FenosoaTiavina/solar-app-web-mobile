import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, useColorScheme, Dimensions, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';

// Définir un type pour vos données d'appareils
interface Appliance {
    id: string;
    name: string;
    count: number;
    consumption: number;
    usage: number;
}

// Données fictives pour les appareils
const initialAppliances: Appliance[] = [
    { id: '1', name: 'Réfrigérateur', count: 1, consumption: 1.5, usage: 24 },
    { id: '2', name: 'Télévision', count: 2, consumption: 0.2, usage: 6 },
    { id: '3', name: 'Climatiseur', count: 1, consumption: 3.0, usage: 8 },
    { id: '4', name: 'Micro-ondes', count: 1, consumption: 1.0, usage: 0.5 },
    { id: '5', name: 'Lave-linge', count: 1, consumption: 2.5, usage: 2 },
    { id: '6', name: 'Chargeur de téléphone', count: 3, consumption: 0.05, usage: 8 },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - SIZES.padding * 3) / 2; // Pour deux cartes par ligne

export default function ApplianceManagementScreen() {
    const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
    const [applianceToDeleteId, setApplianceToDeleteId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [count, setCount] = useState<string>('');
    const [consumption, setConsumption] = useState('');
    const [usage, setUsage] = useState('');
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';

    const handleSave = () => {
        if (!name || !count || !consumption || !usage) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        const newAppliance = {
            id: editingAppliance ? editingAppliance.id : Math.random().toString(),
            name,
            count: parseInt(count, 10),
            consumption: parseFloat(consumption),
            usage: parseFloat(usage),
        };

        if (editingAppliance) {
            setAppliances(
                appliances.map(app => (app.id === newAppliance.id ? newAppliance : app)),
            );
        } else {
            setAppliances([...appliances, newAppliance]);
        }
        setModalVisible(false);
    };

    const handleDelete = () => {
        if (applianceToDeleteId) {
            setAppliances(appliances.filter(app => app.id !== applianceToDeleteId));
        }
        setDeleteModalVisible(false);
        setApplianceToDeleteId(null);
    };

    const handleOpenAddModal = () => {
        setEditingAppliance(null);
        setName('');
        setCount('');
        setConsumption('');
        setUsage('');
        setModalVisible(true);
    };

    const handleOpenEditModal = (appliance: Appliance) => {
        setEditingAppliance(appliance);
        setName(appliance.name);
        setCount(appliance.count.toString());
        setConsumption(appliance.consumption.toString());
        setUsage(appliance.usage.toString());
        setModalVisible(true);
    };

    const handleOpenDeleteModal = (id: string) => {
        setApplianceToDeleteId(id);
        setDeleteModalVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: COLORS[theme].text }]}>Gestion des consommations</Text>
                    <TouchableOpacity onPress={handleOpenAddModal} style={styles.headerButton}>
                        <Feather name="plus-circle" size={24} color={COLORS[theme].secondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.gridContainer}>
                        {appliances.map(item => (
                            <View
                                key={item.id}
                                style={[styles.applianceCard, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}
                            >
                                <View style={styles.cardHeader}>
                                    <MaterialCommunityIcons name="home-lightning-bolt" size={24} color={COLORS[theme].primary} />
                                    <View style={styles.cardTitleContainer}>
                                        <Text style={[styles.applianceName, { color: COLORS[theme].text }]}>{item.name}</Text>
                                        <Text style={[styles.applianceDetails, { color: COLORS[theme].subText }]}>
                                            {item.count} appareil(s)
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>Consommation:</Text>
                                        <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>
                                            {item.consumption} kWh/h
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>Utilisation moyenne:</Text>
                                        <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>{item.usage} h/j</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>Total/jour:</Text>
                                        <Text style={[styles.detailValue, styles.consumptionText, { color: COLORS[theme].primary }]}>
                                            {(item.count * item.consumption * item.usage).toFixed(2)} kWh
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.actionIcon}>
                                        <Feather name="edit" size={20} color={COLORS[theme].secondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleOpenDeleteModal(item.id)}>
                                        <Feather name="trash-2" size={20} color={COLORS[theme].danger} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Modale d'ajout/édition */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                        <Text style={[styles.modalTitle, { color: COLORS[theme].text }]}>
                            {editingAppliance ? 'Modifier l\'appareil' : 'Ajouter un appareil'}
                        </Text>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Nom de l'appareil</Text>
                            <TextInput
                                style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].text }]}
                                onChangeText={setName}
                                value={name}
                                placeholder="Ex: Réfrigérateur"
                                placeholderTextColor={COLORS[theme].subText}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Nombre d'appareils</Text>
                            <TextInput
                                style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].text }]}
                                onChangeText={setCount}
                                value={count}
                                keyboardType="numeric"
                                placeholder="Ex: 1"
                                placeholderTextColor={COLORS[theme].subText}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Consommation (kWh/h)</Text>
                            <TextInput
                                style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].text }]}
                                onChangeText={setConsumption}
                                value={consumption}
                                keyboardType="numeric"
                                placeholder="Ex: 1.5"
                                placeholderTextColor={COLORS[theme].subText}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: COLORS[theme].text }]}>Utilisation quotidienne (h/j)</Text>
                            <TextInput
                                style={[styles.input, { borderColor: COLORS[theme].inputBorder, color: COLORS[theme].text }]}
                                onChangeText={setUsage}
                                value={usage}
                                keyboardType="numeric"
                                placeholder="Ex: 24"
                                placeholderTextColor={COLORS[theme].subText}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.modernButton, { backgroundColor: 'transparent', borderColor: COLORS[theme].danger }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{ color: COLORS[theme].danger }}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modernButton, { backgroundColor: COLORS[theme].primary, borderColor: COLORS[theme].primary }]}
                                onPress={handleSave}
                            >
                                <Text style={{ color: COLORS[theme].primary }}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modale de confirmation de suppression */}
            <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                        <Text style={[styles.modalTitle, { color: COLORS[theme].text }]}>Confirmer la suppression</Text>
                        <Text style={[styles.modalText, { color: COLORS[theme].subText }]}>
                            Voulez-vous vraiment supprimer cet appareil ? Cette action est irréversible.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.modernButton, { backgroundColor: 'transparent', borderColor: COLORS[theme].subText }]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={{ color: COLORS[theme].text }}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modernButton, { backgroundColor: COLORS[theme].danger, borderColor: COLORS[theme].danger }]}
                                onPress={handleDelete}
                            >
                                <Text style={{ color: '#FFF' }}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerButton: {
        marginLeft: 15,
    },
    scrollContent: {
        paddingBottom: SIZES.padding * 2,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    applianceCard: {
        width: cardWidth,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.borderRadius,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.margin,
    },
    cardTitleContainer: {
        marginLeft: SIZES.margin,
        flex: 1,
    },
    applianceName: {
        fontSize: 16,
        fontWeight: '600',
    },
    applianceDetails: {
        fontSize: 12,
    },
    detailsContainer: {
        marginTop: SIZES.margin,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.margin / 2,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 12,
    },
    consumptionText: {
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: SIZES.margin,
    },
    actionIcon: {
        marginLeft: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        width: '90%',
        maxWidth: 400,
        padding: SIZES.padding * 2,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 20,
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: SIZES.padding,
    },
    modernButton: {
        padding: 15,
        borderRadius: SIZES.borderRadius,
        borderWidth: 1,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
});
