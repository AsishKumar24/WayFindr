import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { GestureHandlerRootView, TapGestureHandler } from "react-native-gesture-handler";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/Styling";
//import { GOOGLE_API_KEY } from "@env";

let noBusStopCount = 0; // Counter to track "No bus stops found"

const BusStopFinder = () => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [busStops, setBusStops] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUserLocation = async () => {
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            setLoading(false);
            return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
        findNearbyBusStops(userLocation.coords.latitude, userLocation.coords.longitude);
    };

    const findNearbyBusStops = async (latitude: any, longitude: any) => {
        const GOOGLE_PLACES_API_KEY = "AIzaSyASez5uxVjxX29f_TgmKXTFK18GeaFSXgI";
        const radius = 1000;
        const type = "bus_station";

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

        try {
            const response = await fetch(url);
            const result = await response.json();

            if (result.results && result.results.length > 0) {
                noBusStopCount = 0; // Reset counter when bus stops are found

                const busStopsWithDistance = result.results.map((stop: any) => ({
                    ...stop,
                    distance: calculateDistance(latitude, longitude, stop.geometry.location.lat, stop.geometry.location.lng),
                })).sort((a: any, b: any) => a.distance - b.distance);

                setBusStops(busStopsWithDistance);
                setTimeout(() => {
                    speakBusStops(busStopsWithDistance);
                }, 2000); // 2-second delay before speaking
            } else {
                if (noBusStopCount < 2) {
                    Speech.speak("No nearby bus stops found.");
                    noBusStopCount++; // Increment counter
                }
            }
        } catch (error) {
            console.error("Error fetching bus stops:", error);
        }
        setLoading(false);
    };

    const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    const speakBusStops = (busStops: any) => {
        if (busStops.length === 0) {
            if (noBusStopCount < 2) {
                Speech.speak("No nearby bus stops found.");
                noBusStopCount++;
            }
            return;
        }

        Speech.speak("Here are the nearby bus stops:");
        busStops.slice(0, 2).forEach((stop: any, index: any) => {
            const message = `Bus stop ${index + 1}: ${stop.name}, located at ${stop.vicinity}, distance ${stop.distance} kilometers away.`;
            Speech.speak(message, { rate: 0.9 });
        });
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <TapGestureHandler onHandlerStateChange={getUserLocation}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Find Nearby Bus Stops</Text>
                </View>
            </TapGestureHandler>

            {loading && <Text style={styles.text}>Loading...</Text>}

            {location && (
                <View style={styles.infoContainer}>
                    <Text style={styles.text}>Your Location: {location.latitude}, {location.longitude}</Text>
                </View>
            )}

            {busStops.length > 0 && (
                <View style={styles.infoContainer}>
                    <Text style={styles.header}>Nearby Bus Stops:</Text>
                    {busStops.map((stop: any, index) => (
                        <Text key={index} style={styles.text}>
                            {stop.name} - {stop.vicinity}  🚏 Distance: {stop.distance} km
                        </Text>
                    ))}
                </View>
            )}
        </GestureHandlerRootView>
    );
};

export default BusStopFinder;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
    buttonContainer: { alignSelf: "center", backgroundColor: colors.neutral300, height: verticalScale(140), width: verticalScale(340), borderRadius: 70, justifyContent: "center", alignItems: "center", marginBottom: 20, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    buttonText: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center" },
    infoContainer: { backgroundColor: "white", padding: 15, borderRadius: 10, marginTop: 10, width: "90%", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    text: { fontSize: 16, color: "#333", textAlign: "center" },
    header: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }
});
