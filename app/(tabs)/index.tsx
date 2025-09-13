import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, useWindowDimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
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

// Simuler les données en direct
const generateLiveData = () => {
    const minUsage = 0.5;
    const maxUsage = 2.0;
    const minProduction = 0.1;
    const maxProduction = 4.0;

    return {
        timestamp: new Date().toLocaleTimeString(),
        currentUsage: (Math.random() * (maxUsage - minUsage) + minUsage).toFixed(2),
        currentProduction: (Math.random() * (maxProduction - minProduction) + minProduction).toFixed(2),
    };
};

// Données de prévision par tranche horaire
const solarPredictions = [
    { time: '6h - 8h', weather: 'Nuageux', production: 2.5, icon: 'weather-cloudy' },
    { time: '8h - 12h', weather: 'Ensoleillé', production: 23.0, icon: 'weather-sunny' },
    { time: '12h - 14h', weather: 'Partiellement nuageux', production: 15.2, icon: 'weather-partly-cloudy' },
    { time: '14h - 17h', weather: 'Ensoleillé', production: 18.7, icon: 'weather-sunny' },
    { time: '17h - 18h', weather: 'Nuageux', production: 5.1, icon: 'weather-cloudy' },
];

// Données fictives pour les appareils (idem que sur l'écran de gestion)
const appliances: Appliance[] = [
    { id: '1', name: 'Réfrigérateur', count: 1, consumption: 1.5, usage: 24 },
    { id: '2', name: 'Télévision', count: 2, consumption: 0.2, usage: 6 },
    { id: '3', name: 'Climatiseur', count: 1, consumption: 3.0, usage: 8 },
];

// Fonction pour calculer la consommation quotidienne totale prédite
const calculateTotalPredictedConsumption = (applianceList: Appliance[]) => {
    return applianceList.reduce((total, appliance) => {
        return total + appliance.count * appliance.consumption * appliance.usage;
    }, 0);
};

const totalPredictedConsumption = calculateTotalPredictedConsumption(appliances);

// Fonction pour calculer la consommation prédite par appareil pour le graphique à barres
const calculatePredictedConsumptionData = (applianceList: Appliance[]) => {
    const data = applianceList.map(appliance => appliance.count * appliance.consumption * appliance.usage);
    const labels = applianceList.map(appliance => appliance.name);
    return {
        labels: labels,
        datasets: [{ data: data }],
    };
};

const predictedConsumptionData = calculatePredictedConsumptionData(appliances);

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const { width: screenWidth } = useWindowDimensions();

    const [liveData, setLiveData] = useState(generateLiveData());

    // Simule l'appel API pour les données en temps réel
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveData(generateLiveData());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const chartConfig = {
        backgroundGradientFrom: COLORS[theme].card,
        backgroundGradientTo: COLORS[theme].card,
        color: (opacity = 1) => COLORS[theme].primary,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        fillShadowGradientFrom: COLORS[theme].primary,
        fillShadowGradientFromOpacity: 0.8,
        fillShadowGradientTo: COLORS[theme].primary,
        fillShadowGradientToOpacity: 0.1,
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.title, { color: COLORS[theme].text }]}>Tableau de bord Énergétique</Text>

                {/* Section en deux colonnes pour les cartes */}
                <View style={styles.twoColumnSection}>
                    {/* Carte de prédiction solaire */}
                    <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                        <Text style={[styles.cardTitle, { color: COLORS[theme].text }]}>Prévisions de production solaire</Text>
                        {solarPredictions.map((item, index) => (
                            <View key={index} style={styles.predictionItem}>
                                <View style={styles.predictionRow}>
                                    <MaterialCommunityIcons name={item.icon} size={24} color={COLORS[theme].secondary} />
                                    <View style={styles.predictionTextContainer}>
                                        <Text style={[styles.predictionTime, { color: COLORS[theme].text }]}>{item.time}</Text>
                                        <Text style={[styles.predictionWeather, { color: COLORS[theme].subText }]}>{item.weather}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.predictionValue, { color: COLORS[theme].primary }]}>
                                    {item.production} kWh
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Carte des données en temps réel */}
                    <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                        <Text style={[styles.cardTitle, { color: COLORS[theme].text }]}>Données en temps réel</Text>
                        <Text style={[styles.timestamp, { color: COLORS[theme].subText }]}>
                            Dernière mise à jour: {liveData.timestamp}
                        </Text>
                        <View style={styles.dataRow}>
                            <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS[theme].danger} />
                            <View style={styles.dataTextContainer}>
                                <Text style={[styles.dataLabel, { color: COLORS[theme].text }]}>Consommation actuelle</Text>
                                <Text style={[styles.dataValue, { color: COLORS[theme].danger }]}>{liveData.currentUsage} kWh</Text>
                            </View>
                        </View>
                        <View style={styles.dataRow}>
                            <Feather name="sunrise" size={24} color={COLORS[theme].secondary} />
                            <View style={styles.dataTextContainer}>
                                <Text style={[styles.dataLabel, { color: COLORS[theme].text }]}>Production solaire</Text>
                                <Text style={[styles.dataValue, { color: COLORS[theme].secondary }]}>{liveData.currentProduction} kWh</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Graphique de la production solaire */}
                <View style={[styles.chartCard, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.chartTitle, { color: COLORS[theme].text }]}>Production solaire journalière</Text>
                    <LineChart
                        data={{
                            labels: solarPredictions.map(p => p.time.split(' ')[0]),
                            datasets: [{ data: solarPredictions.map(p => p.production) }],
                        }}
                        width={screenWidth - SIZES.padding * 4}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        yAxisLabel={''}
                        yAxisSuffix={''}
                    />
                </View>

                {/* Résumé de la consommation prédite */}
                <View style={[styles.chartCard, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.chartTitle, { color: COLORS[theme].text }]}>
                        Consommation quotidienne prédite
                    </Text>
                    <View style={styles.summaryContainer}>
                        <View style={[styles.summaryBox, { backgroundColor: 'rgba(255,100,0,0.1)' }]}>
                            <Text style={[styles.summaryValue, { color: 'orange' }]}>
                                {totalPredictedConsumption.toFixed(2)}
                            </Text>
                            <Text style={[styles.summaryLabel, { color: 'orange' }]}>kWh total</Text>
                        </View>
                        <View style={[styles.summaryBox, { backgroundColor: 'rgba(0,128,0,0.1)' }]}>
                            <Text style={[styles.summaryValue, { color: 'green' }]}>
                                {(totalPredictedConsumption * 0.15).toFixed(2)}
                            </Text>
                            <Text style={[styles.summaryLabel, { color: 'green' }]}>Coût estimé (Ar)</Text>
                        </View>
                    </View>
                </View>

                {/* Graphique de la consommation par appareil */}
                <View style={[styles.chartCard, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.chartTitle, { color: COLORS[theme].text }]}>
                        Consommation prédite par appareil
                    </Text>
                    <BarChart
                        data={predictedConsumptionData}
                        width={screenWidth - SIZES.padding * 4}
                        height={220}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        yAxisLabel={''}
                        yAxisSuffix={''}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: SIZES.padding,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: SIZES.padding,
        textAlign: 'center',
    },
    // Nouveau style pour la disposition en deux colonnes
    twoColumnSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SIZES.padding,
    },
    card: {
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        marginBottom: SIZES.padding,
        // Styles pour la disposition en deux colonnes
        width: '48%',
        minWidth: 300,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SIZES.margin,
    },
    timestamp: {
        fontSize: 12,
        marginBottom: SIZES.padding,
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.margin,
    },
    dataTextContainer: {
        marginLeft: SIZES.margin,
    },
    dataLabel: {
        fontSize: 14,
    },
    dataValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SIZES.padding,
    },
    summaryBox: {
        padding: SIZES.margin,
        borderRadius: SIZES.borderRadius,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    summaryLabel: {
        fontSize: 14,
        textAlign: 'center',
    },
    chartCard: {
        padding: SIZES.margin,
        borderRadius: SIZES.borderRadius,
        marginBottom: SIZES.padding,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: SIZES.margin,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: SIZES.borderRadius,
    },
    predictionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.margin,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.2)',
    },
    predictionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    predictionTextContainer: {
        marginLeft: SIZES.margin,
    },
    predictionTime: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    predictionWeather: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    predictionValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
