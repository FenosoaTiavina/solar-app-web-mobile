import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Dimensions, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';
import { Link } from 'expo-router';

// Définir un type pour vos données de produits
interface Product {
    id: string;
    name: string;
    type: 'Kit solaire' | 'Compteur intelligent' | 'Batterie';
    status?: 'Actif' | 'Inactif';
    details: {
        [key: string]: string;
    };
}

// Données fictives pour les produits de l'utilisateur
const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Kit solaire Pro',
        type: 'Kit solaire',
        status: 'Actif',
        details: {
            'Puissance nominale': '5.5 kW',
            'Nombre de panneaux': '15',
            'Type de cellule': 'Monocristallin',
        },
    },
    {
        id: '2',
        name: 'Compteur intelligent v2',
        type: 'Compteur intelligent',
        status: 'Actif',
        details: {
            'Modèle': 'SmartMeter-v2',
            'Communication': 'Wi-Fi / Zigbee',
            'Fonctionnalités': 'Mesure de l\'énergie, alerte de panne',
        },
    },
    {
        id: '3',
        name: 'Stockage de batterie 10kWh',
        type: 'Batterie',
        status: 'Inactif',
        details: {
            'Capacité': '10 kWh',
            'Tension nominale': '48 V',
            'Chimie': 'LiFePO4',
        },
    },
];

// Données fictives pour le catalogue de la Marketplace
const marketplaceProducts: Product[] = [
    {
        id: '101',
        name: 'Kit solaire Starter',
        type: 'Kit solaire',
        details: {
            'Puissance nominale': '3.0 kW',
            'Nombre de panneaux': '8',
            'Type de cellule': 'Polycristallin',
            'Prix estimé': '22 500 000 Ar',
        },
    },
    {
        id: '102',
        name: 'Kit solaire Advanced',
        type: 'Kit solaire',
        details: {
            'Puissance nominale': '7.2 kW',
            'Nombre de panneaux': '20',
            'Type de cellule': 'Monocristallin',
            'Prix estimé': '35 000 000 Ar',
        },
    },
    {
        id: '103',
        name: 'Batterie 5kWh Compact',
        type: 'Batterie',
        details: {
            'Capacité': '5 kWh',
            'Tension nominale': '48 V',
            'Chimie': 'Li-ion',
            'Prix estimé': '14 000 000 Ar',
        },
    },
    {
        id: '104',
        name: 'Batterie PowerWall 15kWh',
        type: 'Batterie',
        details: {
            'Capacité': '15 kWh',
            'Tension nominale': '48 V',
            'Chimie': 'LiFePO4',
            'Prix estimé': '40 000 000 Ar',
        },
    },
    {
        id: '105',
        name: 'Compteur intelligent IoT',
        type: 'Compteur intelligent',
        details: {
            'Modèle': 'IoT-Meter',
            'Communication': 'LTE / Wi-Fi',
            'Fonctionnalités': 'Consommation, production, contrôle à distance',
            'Prix estimé': '750 000 Ar',
        },
    },
    {
        id: '106',
        name: 'Compteur intelligent Connect',
        type: 'Compteur intelligent',
        details: {
            'Modèle': 'Connect-Meter',
            'Communication': 'Zigbee / Bluetooth',
            'Fonctionnalités': 'Mesure de l\'énergie, alertes, historique',
            'Prix estimé': '600 000 Ar',
        },
    },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - SIZES.padding * 3) / 2; // Pour deux cartes par ligne

export default function ProductsScreen() {
    const [products] = useState<Product[]>(initialProducts);
    const [compareList, setCompareList] = useState<Product[]>([]);
    const [compareModalVisible, setCompareModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';

    const getIconForProductType = (type: string) => {
        switch (type) {
            case 'Kit solaire':
                return <Feather name="sunrise" size={24} color={COLORS[theme].secondary} />;
            case 'Compteur intelligent':
                return <Feather name="zap-off" size={24} color={COLORS[theme].secondary} />;
            case 'Batterie':
                return <Feather name="battery-charging" size={24} color={COLORS[theme].secondary} />;
            default:
                return <Feather name="box" size={24} color={COLORS[theme].secondary} />;
        }
    };

    const toggleCompare = (product: Product) => {
        setCompareList(prevList => {
            const isSelected = prevList.some(item => item.id === product.id);
            if (isSelected) {
                return prevList.filter(item => item.id !== product.id);
            } else if (prevList.length < 2) {
                if (prevList.length === 0 || prevList[0].type === product.type) {
                    return [...prevList, product];
                } else {
                    // Empêche la sélection si les types ne correspondent pas
                    alert('Vous ne pouvez comparer que des produits du même type.');
                    return prevList;
                }
            }
            return prevList;
        });
    };

    const handleCompare = () => {
        if (compareList.length > 0) {
            setCompareModalVisible(true);
        }
    };

    const renderProductCard = (item: Product, isMarketplace = false) => {
        const isSelectedForComparison = compareList.some(p => p.id === item.id);
        return (
            <View
                key={item.id}
                style={[
                    styles.productCard,
                    { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] },
                    isSelectedForComparison && styles.selectedForComparison,
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardIcon}>{getIconForProductType(item.type)}</View>
                    <View style={styles.cardTitleContainer}>
                        <Text style={[styles.productName, { color: COLORS[theme].text }]}>{item.name}</Text>
                        <Text style={[styles.productType, { color: COLORS[theme].subText }]}>{item.type}</Text>
                    </View>
                    {isMarketplace && (
                        <TouchableOpacity onPress={() => toggleCompare(item)}>
                            <Feather
                                name={isSelectedForComparison ? 'check-square' : 'square'}
                                size={20}
                                color={COLORS[theme].primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.detailsContainer}>
                    {Object.entries(item.details).map(([key, value]) => (
                        <View key={key} style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>{key}:</Text>
                            <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>{value}</Text>
                        </View>
                    ))}
                </View>
                {!isMarketplace && item.status && (
                    <View
                        style={[
                            styles.statusContainer,
                            {
                                backgroundColor: item.status === 'Actif' ? 'rgba(0,128,0,0.1)' : 'rgba(255,0,0,0.1)',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                { color: item.status === 'Actif' ? COLORS[theme].primary : COLORS[theme].danger },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: COLORS[theme].text }]}>Mes produits</Text>
                    <View style={styles.headerButtons}>
                        <Link href="/products/comteur_setup" asChild>
                            <TouchableOpacity style={styles.headerButton}>
                                <Feather name="settings" size={24} color={COLORS[theme].secondary} />
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity
                            onPress={() => console.log('La modale d\'ajout de produit irait ici')}
                            style={styles.headerButton}
                        >
                            <Feather name="plus-circle" size={24} color={COLORS[theme].secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.sectionTitle, { color: COLORS[theme].text }]}>Vos produits installés</Text>
                    <View style={styles.gridContainer}>{products.map(item => renderProductCard(item))}</View>

                    <Text style={[styles.sectionTitle, { color: COLORS[theme].text, marginTop: 20 }]}>
                        Catalogue Marketplace
                    </Text>
                    <View style={styles.gridContainer}>
                        {marketplaceProducts.map(item => renderProductCard(item, true))}
                    </View>

                    {compareList.length > 0 && (
                        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
                            <Text style={styles.compareButtonText}>
                                Comparer ({compareList.length}/2)
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* Modale de comparaison */}
            <Modal animationType="slide" transparent={true} visible={compareModalVisible} onRequestClose={() => setCompareModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                        <Text style={[styles.modalTitle, { color: COLORS[theme].text }]}>Comparaison de produits</Text>
                        <ScrollView contentContainerStyle={styles.compareScrollContent}>
                            {compareList.length === 0 ? (
                                <Text style={[styles.noProductText, { color: COLORS[theme].subText }]}>
                                    Veuillez sélectionner des produits à comparer.
                                </Text>
                            ) : (
                                <View style={styles.comparisonGrid}>
                                    {compareList.map((product) => (
                                        <View key={product.id} style={styles.comparisonColumn}>
                                            <Text style={[styles.comparisonName, { color: COLORS[theme].primary }]}>{product.name}</Text>
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <View key={key} style={styles.comparisonRow}>
                                                    <Text style={[styles.comparisonLabel, { color: COLORS[theme].subText }]}>{key}:</Text>
                                                    <Text style={[styles.comparisonValue, { color: COLORS[theme].text }]}>{value}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setCompareModalVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>Fermer</Text>
                        </TouchableOpacity>
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
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        marginLeft: 15,
    },
    scrollContent: {
        paddingBottom: SIZES.padding * 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: SIZES.margin,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: cardWidth,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        position: 'relative',
    },
    selectedForComparison: {
        borderColor: COLORS.light.primary, // Utilise la couleur primaire du thème clair pour une meilleure visibilité
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.margin,
    },
    cardIcon: {
        marginRight: SIZES.margin,
    },
    cardTitleContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
    },
    productType: {
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
    statusContainer: {
        marginTop: SIZES.margin,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: SIZES.borderRadius,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    compareButton: {
        backgroundColor: COLORS.light.secondary,
        padding: 15,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.padding,
        ...SHADOWS.light,
    },
    compareButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Styles pour la modale de comparaison
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: SIZES.borderRadius,
        padding: SIZES.padding,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: SIZES.padding,
        textAlign: 'center',
    },
    compareScrollContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    comparisonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    comparisonColumn: {
        width: '45%',
        padding: SIZES.margin,
        borderRadius: SIZES.borderRadius,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    comparisonName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: SIZES.margin,
        textAlign: 'center',
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    comparisonLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    comparisonValue: {
        fontSize: 12,
        textAlign: 'right',
        flexShrink: 1,
    },
    noProductText: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
    modalCloseButton: {
        marginTop: SIZES.padding,
        backgroundColor: COLORS.light.danger,
        padding: 15,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
