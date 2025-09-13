import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, useWindowDimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Theme';
import { Link } from 'expo-router';
import { useProductContext } from '@/context/ProductContext'; // Importez le hook de contexte

// Définir un type pour vos données de prévision solaire
interface SolarPrediction {
    time: string;
    weather: string;
    production: number;
    icon: string;
}

// Définir un type pour vos données en direct
interface LiveData {
    timestamp: string;
    currentUsage: string;
    currentProduction: string;
}

// Simuler les données en direct
const generateLiveData = (): LiveData => {
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
const solarPredictions: SolarPrediction[] = [
    { time: '6h - 8h', weather: 'Nuageux', production: 2.5, icon: 'weather-cloudy' },
    { time: '8h - 12h', weather: 'Ensoleillé', production: 23.0, icon: 'weather-sunny' },
    { time: '12h - 14h', weather: 'Partiellement nuageux', production: 15.5, icon: 'weather-partly-cloudy' },
    { time: '14h - 18h', weather: 'Ensoleillé', production: 19.8, icon: 'weather-sunny' },
    { time: '18h - 22h', weather: 'Clair de lune', production: 0, icon: 'weather-night' },
];

export default function DashboardScreen() {
    const { installedProducts } = useProductContext(); // Récupérez les produits depuis le contexte
    const [liveData, setLiveData] = useState<LiveData>(generateLiveData());
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const { width } = useWindowDimensions();
    const chartWidth = width - SIZES.padding * 2;
    const username = "Fenosoa";

    const lineChartData = {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
            {
                data: [15, 20, 18, 25, 22, 28, 21], // Production solaire en kWh
                color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
                strokeWidth: 2
            },
            {
                data: [20, 22, 21, 26, 24, 25, 23], // Consommation en kWh
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Production solaire", "Consommation"]
    };

    const lineChartConfig = {
        backgroundColor: COLORS[theme].card,
        backgroundGradientFrom: COLORS[theme].card,
        backgroundGradientTo: COLORS[theme].card,
        decimalPlaces: 0,
        color: (opacity = 1) => COLORS[theme].text,
        labelColor: (opacity = 1) => COLORS[theme].subText,
        style: {
            borderRadius: SIZES.borderRadius,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: COLORS[theme].subText,
        },
        propsForLabels: {
            fontSize: 10,
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveData(generateLiveData());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (installedProducts.length === 0) {
        return (
            <View style={[styles.noProductsContainer, { backgroundColor: COLORS[theme].background }]}>
                <Feather name="alert-circle" size={50} color={COLORS[theme].primary} />
                <Text style={[styles.noProductsTitle, { color: COLORS[theme].text }]}>
                    Aucun appareil connecté.
                </Text>
                <Text style={[styles.noProductsText, { color: COLORS[theme].subText }]}>
                    Veuillez lier votre appareil intelligent pour accéder à votre tableau de bord.
                </Text>
                <Link href="/products/compteur_setup" asChild>
                    <TouchableOpacity
                    // style={[styles.setupButton, { backgroundColor: COLORS[theme].primary, ...SHADOWS[theme] }]}
                    >
                        <Text style={styles.setupButtonText}>
                            Configurer un appareil
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: COLORS[theme].background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.greeting, { color: COLORS[theme].text }]}>Bonjour, {username}</Text>

                <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.cardTitle, { color: COLORS[theme].text }]}>Données en temps réel</Text>
                    <Text style={[styles.timestamp, { color: COLORS[theme].subText }]}>
                        Dernière mise à jour: {liveData.timestamp}
                    </Text>
                    <View style={styles.liveDataContainer}>
                        <View style={styles.liveDataItem}>
                            <Feather name="zap" size={24} color={COLORS[theme].primary} />
                            <Text style={[styles.liveDataValue, { color: COLORS[theme].text }]}>
                                {liveData.currentUsage} kW
                            </Text>
                            <Text style={[styles.liveDataLabel, { color: COLORS[theme].subText }]}>
                                Consommation
                            </Text>
                        </View>
                        <View style={styles.liveDataItem}>
                            <Feather name="sunrise" size={24} color={COLORS[theme].secondary} />
                            <Text style={[styles.liveDataValue, { color: COLORS[theme].text }]}>
                                {liveData.currentProduction} kW
                            </Text>
                            <Text style={[styles.liveDataLabel, { color: COLORS[theme].subText }]}>
                                Production
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: COLORS[theme].text }]}>Résumé du jour</Text>
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryBox, { backgroundColor: COLORS[theme].accent, ...SHADOWS[theme] }]}>
                        <Text style={[styles.summaryValue, { color: COLORS.dark.text }]}>25.4 kWh</Text>
                        <Text style={[styles.summaryLabel, { color: COLORS.dark.subText }]}>Production Totale</Text>
                    </View>
                    <View style={[styles.summaryBox, { backgroundColor: COLORS[theme].accent, ...SHADOWS[theme] }]}>
                        <Text style={[styles.summaryValue, { color: COLORS.dark.text }]}>18.1 kWh</Text>
                        <Text style={[styles.summaryLabel, { color: COLORS.dark.subText }]}>Consommation Totale</Text>
                    </View>
                </View>

                <View style={[styles.chartCard, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.chartTitle, { color: COLORS[theme].text }]}>Historique Production vs Consommation</Text>
                    <LineChart
                        data={lineChartData}
                        width={chartWidth - 20}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" kWh"
                        chartConfig={lineChartConfig}
                        bezier
                        style={styles.chart}
                    />
                </View>

                <View style={[styles.card, { backgroundColor: COLORS[theme].card, ...SHADOWS[theme] }]}>
                    <Text style={[styles.cardTitle, { color: COLORS[theme].text }]}>Prévisions solaires</Text>
                    {solarPredictions.map((prediction, index) => (
                        <View key={index} style={styles.predictionItem}>
                            <View style={styles.predictionRow}>
                                <MaterialCommunityIcons
                                    name={prediction.icon as any}
                                    size={24}
                                    color={COLORS[theme].secondary}
                                />
                                <View style={styles.predictionTextContainer}>
                                    <Text style={[styles.predictionTime, { color: COLORS[theme].text }]}>{prediction.time}</Text>
                                    <Text style={[styles.predictionWeather, { color: COLORS[theme].subText }]}>{prediction.weather}</Text>
                                </View>
                            </View>
                            <Text style={[styles.predictionProduction, { color: COLORS[theme].primary }]}>
                                {prediction.production} kWh
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
    },
    noProductsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: SIZES.padding,
        textAlign: 'center',
    },
    noProductsText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: SIZES.margin,
        lineHeight: 24,
    },
    setupButton: {
        marginTop: SIZES.padding * 2,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: SIZES.borderRadius,
    },
    setupButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: SIZES.padding,
    },
    card: {
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        marginBottom: SIZES.padding,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SIZES.margin,
    },
    timestamp: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: SIZES.margin,
    },
    liveDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SIZES.padding,
    },
    liveDataItem: {
        alignItems: 'center',
    },
    liveDataValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: SIZES.margin / 2,
    },
    liveDataLabel: {
        fontSize: 14,
    },
    sectionTitle: {
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
        fontWeight: '600',
    },
    predictionWeather: {
        fontSize: 12,
    },
    predictionProduction: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
