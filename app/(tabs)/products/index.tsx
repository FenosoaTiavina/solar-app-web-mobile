import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Dimensions, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';
import { Link } from 'expo-router';
import { useProductContext } from '@/context/ProductContext'; // Importez le hook de contexte

// Définir un type pour les données de la marketplace et les produits de l'utilisateur
interface Product {
    nom: string;
    ref_produit: string;
    prix: number;
    date_creation: string;
    stock: number;
    status?: 'Actif' | 'Inactif';
    specs: Spec[];
}

interface Spec {
    key: string;
    value: number | string;
    unit: string;
}

interface Spec {
    cle: string;
    valeur: number;
    unit: string;
}

// Définir un type pour les données de la marketplace et les produits de l'utilisateur
interface Product {
    nom: string;
    ref_produit: string;
    prix: number;
    date_creation: string;
    stock: number;
    status?: 'Actif' | 'Inactif';
    specs: Spec[];
}


// Données fictives pour le catalogue de la Marketplace
export const marketplaceProducts = {
    "Panneau solaire": [
        { "nom": "PM 50W", "ref_produit": "PS001", "prix": 1000000, "date_creation": "2025-09-01", "stock": 10, specs: [{ cle: 'Puissance', valeur: 50, unit: 'W' }, { cle: 'Efficacité', valeur: 18, unit: '%' }] },
        { "nom": "PM 100W", "ref_produit": "PS002", "prix": 2000000, "date_creation": "2025-09-02", "stock": 20, specs: [{ cle: 'Puissance', valeur: 100, unit: 'W' }, { cle: 'Efficacité', valeur: 19, unit: '%' }] },
        { "nom": "PM 150W", "ref_produit": "PS003", "prix": 2500000, "date_creation": "2025-09-03", "stock": 30, specs: [{ cle: 'Puissance', valeur: 150, unit: 'W' }, { cle: 'Efficacité', valeur: 19, unit: '%' }] },
        { "nom": "GM 200W", "ref_produit": "PS004", "prix": 3400000, "date_creation": "2025-09-04", "stock": 5, specs: [{ cle: 'Puissance', valeur: 200, unit: 'W' }, { cle: 'Efficacité', valeur: 20, unit: '%' }] },
        { "nom": "GM 250W", "ref_produit": "PS005", "prix": 4250000, "date_creation": "2025-09-05", "stock": 10, specs: [{ cle: 'Puissance', valeur: 250, unit: 'W' }, { cle: 'Efficacité', valeur: 20, unit: '%' }] },
        { "nom": "GM 300W", "ref_produit": "PS006", "prix": 4500000, "date_creation": "2025-09-06", "stock": 13, specs: [{ cle: 'Puissance', valeur: 300, unit: 'W' }, { cle: 'Efficacité', valeur: 21, unit: '%' }] },
        { "nom": "Premium 350W", "ref_produit": "PS007", "prix": 5550000, "date_creation": "2025-09-07", "stock": 21, specs: [{ cle: 'Puissance', valeur: 350, unit: 'W' }, { cle: 'Efficacité', valeur: 21, unit: '%' }] },
        { "nom": "Premium 400W", "ref_produit": "PS008", "prix": 6650000, "date_creation": "2025-09-08", "stock": 8, specs: [{ cle: 'Puissance', valeur: 400, unit: 'W' }, { cle: 'Efficacité', valeur: 22, unit: '%' }] }
    ],
    "Batterie": [
        { "nom": "Batterie 50Ah", "ref_produit": "BAT001", "prix": 350000, "date_creation": "2025-09-01", "stock": 12, specs: [{ cle: 'Capacité', valeur: 50, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie 70Ah", "ref_produit": "BAT002", "prix": 480000, "date_creation": "2025-09-02", "stock": 8, specs: [{ cle: 'Capacité', valeur: 70, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie 100Ah", "ref_produit": "BAT003", "prix": 500000, "date_creation": "2025-09-03", "stock": 14, specs: [{ cle: 'Capacité', valeur: 100, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie 120Ah", "ref_produit": "BAT004", "prix": 620000, "date_creation": "2025-09-04", "stock": 9, specs: [{ cle: 'Capacité', valeur: 120, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie 150Ah", "ref_produit": "BAT005", "prix": 800000, "date_creation": "2025-09-05", "stock": 20, specs: [{ cle: 'Capacité', valeur: 150, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie Gel 200Ah", "ref_produit": "BAT006", "prix": 1050000, "date_creation": "2025-09-06", "stock": 17, specs: [{ cle: 'Capacité', valeur: 200, unit: 'Ah' }, { cle: 'Tension', valeur: 12, unit: 'V' }] },
        { "nom": "Batterie Lithium 100Ah", "ref_produit": "BAT007", "prix": 2000000, "date_creation": "2025-09-07", "stock": 20, specs: [{ cle: 'Capacité', valeur: 100, unit: 'Ah' }, { cle: 'Tension', valeur: 24, unit: 'V' }] },
        { "nom": "Batterie Lithium 200Ah", "ref_produit": "BAT008", "prix": 3800000, "date_creation": "2025-09-08", "stock": 12, specs: [{ cle: 'Capacité', valeur: 200, unit: 'Ah' }, { cle: 'Tension', valeur: 24, unit: 'V' }] }
    ]
};

export default function ProductsScreen() {

    // const [userProducts] = useState<Product[]>(initialProducts);
    // const [compareList, setCompareList] = useState<any[]>([]);
    // const [compareModalVisible, setCompareModalVisible] = useState(false);
    // const [expandedSections, setExpandedSections] = useState<string[]>(Object.keys(marketplaceProducts));
    // const colorScheme = useColorScheme();
    // const theme = colorScheme === 'dark' ? 'dark' : 'light';

    const { installedProducts } = useProductContext(); // Récupérez les produits depuis le contexte
    const [compareList, setCompareList] = useState<any[]>([]);
    const [compareModalVisible, setCompareModalVisible] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(Object.keys(marketplaceProducts));
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';


    const getProductType = (product: Product): string => {
        for (const category in marketplaceProducts) {
            if (marketplaceProducts[category as keyof typeof marketplaceProducts].some((p: { ref_produit: string; }) => p.ref_produit === product.ref_produit)) {
                return category;
            }
        }
        // if (product.nom.includes('Panneau solaire')) return 'Panneau solaire';
        // if (product.nom.includes('Batterie')) return 'Batterie';
        // if (product.nom.includes('Compteur intelligent')) return 'Compteur intelligent';
        return 'Autre';
    };

    const getIconForProductType = (type: string) => {
        switch (type) {
            case 'Panneau solaire':
                return <Feather name="sunrise" size={24} color={COLORS[theme].secondary} />;
            case 'Compteur intelligent':
                return <Feather name="zap-off" size={24} color={COLORS[theme].secondary} />;
            case 'Batterie':
                return <Feather name="battery-charging" size={24} color={COLORS[theme].secondary} />;
            default:
                return <Feather name="box" size={24} color={COLORS[theme].secondary} />;
        }
    };

    const toggleSection = (sectionTitle: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionTitle)
                ? prev.filter(title => title !== sectionTitle)
                : [...prev, sectionTitle]
        );
    };

    const toggleCompare = (product: any) => {
        setCompareList(prevList => {
            const isSelected = prevList.some(item => item.ref_produit === product.ref_produit);
            if (isSelected) {
                return prevList.filter(item => item.ref_produit !== product.ref_produit);
            } else if (prevList.length < 2) {
                const newProductType = getProductType(product);
                if (prevList.length === 0 || getProductType(prevList[0]) === newProductType) {
                    return [...prevList, product];
                } else {
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

    const renderProductCard = (item: any, source: 'installed' | 'marketplace') => {
        const isSelectedForComparison = compareList.some(p => p.ref_produit === item.ref_produit);

        const productName = item.nom;
        const productType = getProductType(item);

        return (
            <View
                key={`${source}-${item.ref_produit}`}
                style={[
                    styles.productCard,
                    { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] },
                    isSelectedForComparison && styles.selectedForComparison,
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardIcon}>{getIconForProductType(productType || '')}</View>
                    <View style={styles.cardTitleContainer}>
                        <Text style={[styles.productName, { color: COLORS[theme].text }]}>{productName}</Text>
                        <Text style={[styles.productType, { color: COLORS[theme].subText }]}>{productType}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleCompare(item)}>
                        <Feather
                            name={isSelectedForComparison ? 'check-square' : 'square'}
                            size={20}
                            color={COLORS[theme].primary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.detailsContainer}>
                    {/* Affichage des spécifications dynamiques */}
                    {item.specs.map((spec: Spec) => (
                        <View key={spec.cle} style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>{spec.cle}:</Text>
                            <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>{spec.valeur} {spec.unit}</Text>
                        </View>
                    ))}
                    {/* Affichage des autres détails fixes */}
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>Prix:</Text>
                        <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>{item.prix.toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' })}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: COLORS[theme].subText }]}>Stock:</Text>
                        <Text style={[styles.detailValue, { color: COLORS[theme].text }]}>{item.stock}</Text>
                    </View>
                </View>
                {item.status && (
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
                        <Link href="/products/compteur_setup" asChild>
                            <TouchableOpacity style={styles.headerButton}>
                                <Feather name="settings" size={24} color={COLORS[theme].secondary} />
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.sectionTitle, { color: COLORS[theme].text }]}>Vos produits installés</Text>

                    <View style={styles.gridContainer}>{
                        installedProducts.length > 0 ?
                            installedProducts.map(item => renderProductCard(item, 'installed'))
                            :
                            <Text style={[{ fontSize: 24, color: COLORS[theme].danger }]}>
                                <Feather name="alert-triangle" size={24} color={COLORS[theme].danger} /> {' '}
                                Pas de produits installé! Lier votre appareil pour commencer
                            </Text>
                    }</View>

                    {Object.entries(marketplaceProducts).map(([category, products]) => (
                        <View key={category}>
                            <TouchableOpacity onPress={() => toggleSection(category)} style={[styles.sectionHeaderCard, { backgroundColor: COLORS[theme].card }]}>
                                <Text style={[styles.sectionTitle, { color: COLORS[theme].text }]}>
                                    {category}
                                </Text>
                                <Feather
                                    name={expandedSections.includes(category) ? 'chevron-up' : 'chevron-down'}
                                    size={24}
                                    color={COLORS[theme].secondary}
                                />
                            </TouchableOpacity>
                            {expandedSections.includes(category) && (
                                <View style={styles.marketplaceGridContainer}>
                                    {products.map(item => (
                                        <View key={`${item.ref_produit}-marketplace`} style={styles.productCardContainer}>
                                            {renderProductCard(item, 'marketplace')}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}

                    {compareList.length > 0 && (
                        <TouchableOpacity style={[styles.stickyCompareButton, { backgroundColor: COLORS[theme].primary }]} onPress={handleCompare}>
                            <Text style={styles.compareButtonText}>
                                Comparer ({compareList.length}/2)
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

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
                                    {compareList.map((product, index) => (
                                        <View key={index} style={styles.comparisonColumn}>
                                            <Text style={[styles.comparisonName, { color: COLORS[theme].primary }]}>{product.nom}</Text>
                                            <View style={styles.comparisonSection}>
                                                <Text style={[styles.comparisonSectionTitle, { color: COLORS[theme].text }]}>Spécifications</Text>
                                                {product.specs.map((spec: Spec) => (
                                                    <View key={spec.cle} style={styles.comparisonRow}>
                                                        <Text style={[styles.comparisonLabel, { color: COLORS[theme].subText }]}>{spec.cle}:</Text>
                                                        <Text style={[styles.comparisonValue, { color: COLORS[theme].text }]}>
                                                            {spec.valeur} {spec.unit}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                            <View style={styles.comparisonSection}>
                                                <Text style={[styles.comparisonSectionTitle, { color: COLORS[theme].text }]}>Informations générales</Text>
                                                <View style={styles.comparisonRow}>
                                                    <Text style={[styles.comparisonLabel, { color: COLORS[theme].subText }]}>Prix:</Text>
                                                    <Text style={[styles.comparisonValue, { color: COLORS[theme].text }]}>
                                                        {product.prix.toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' })}
                                                    </Text>
                                                </View>
                                                <View style={styles.comparisonRow}>
                                                    <Text style={[styles.comparisonLabel, { color: COLORS[theme].subText }]}>Stock:</Text>
                                                    <Text style={[styles.comparisonValue, { color: COLORS[theme].text }]}>
                                                        {product.stock}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: COLORS[theme].danger }]} onPress={() => setCompareModalVisible(false)}>
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
        paddingBottom: 80,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionHeaderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        marginTop: SIZES.padding,
        marginBottom: SIZES.margin,
        ...SHADOWS.light,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    marketplaceGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    productCardContainer: {
        width: '50%',
        paddingRight: SIZES.padding / 4,
        paddingLeft: SIZES.padding / 4,
        marginBottom: SIZES.padding,
    },
    productCard: {
        flex: 1,
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        position: 'relative',
    },
    selectedForComparison: {
        borderColor: '#4CAF50',
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
    stickyCompareButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.light,
    },
    compareButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
    comparisonSection: {
        marginBottom: SIZES.margin,
    },
    comparisonSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: SIZES.margin / 2,
        textDecorationLine: 'underline',
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
        padding: 15,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
