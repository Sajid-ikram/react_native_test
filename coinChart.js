import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { NavigationContainer } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const CryptoChartScreen = ({ navigation }) => {
  const cryptocurrency = { name: "Bitcoin", priceUsd: "30000" };

  // initialize with dummy data
  const [spots, setSpots] = useState(() => {
    const initialSpots = Array.from({ length: 1000 }, (_, i) => {
      const price = 2000 + Math.sin(i / 100) * 500 + Math.random() * 100;
      return { x: i, y: price };
    });
    return initialSpots;
  });

  const [x, setX] = useState(0);
  const [basePrice] = useState(parseFloat(cryptocurrency.priceUsd || 30000));
  const [volatility, setVolatility] = useState(5000);
  const [isBullMarket, setIsBullMarket] = useState(true);

  const timerRef = useRef(null);
  const marketConditionTimerRef = useRef(null);

  useEffect(() => {
    // Generate initial data
    const initialSpots = Array.from({ length: 1000 }, (_, i) => {
      const price = basePrice + Math.sin(i / 100) * volatility + Math.random() * 1000;
      return { x: i, y: validatePrice(price, `Initial Spot Index: ${i}`) };
    });
    setSpots(initialSpots);
    setX(1000);
  }, [basePrice, volatility]);

  useEffect(() => {
    // Periodic updates to chart data
    timerRef.current = setInterval(() => {
      setSpots((prevSpots) => {
        const newSpots = [...prevSpots];
        newSpots.shift();
        const newX = x + 1;

        const priceChange = Math.sin(newX / 50) * volatility + Math.random() * 1000;
        const adjustedPriceChange = isBullMarket
          ? priceChange + volatility * 0.5
          : priceChange - volatility * 0.5;

        const newPrice = validatePrice(basePrice + adjustedPriceChange, `Spot X: ${newX}`);
        newSpots.push({ x: newX, y: newPrice });
        setX(newX);
        return newSpots;
      });
    }, 500);

    return () => clearInterval(timerRef.current);
  }, [x, volatility, isBullMarket]);

  useEffect(() => {
    // Change market conditions every 10 seconds
    marketConditionTimerRef.current = setInterval(() => {
      setIsBullMarket(Math.random() < 0.5);
      setVolatility(3000 + Math.random() * 5000);
    }, 10000);

    return () => clearInterval(marketConditionTimerRef.current);
  }, []);

  const validatePrice = (price, context) => {
    if (isNaN(price) || !isFinite(price)) {
      console.warn(`Invalid price detected: ${price} at ${context}`);
      return basePrice;
    }
    return Math.max(basePrice * 0.5, Math.min(basePrice * 2, price));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{cryptocurrency.name || "Unknown"}</Text>
      </View>
      {spots.length > 0 ? (
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: spots.map((spot) => spot.y) }],
        }}
        width={width - 24}
        height={400}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "0" },
          lineWidth : .2,
        }}
        bezier = {false}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />) : (
          <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading chart data...</Text>
        )}
      <Button
        title="Predict Future Price"
        onPress={() =>  navigation.navigate('Simulation', { cryptocurrency })}
        color="green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CryptoChartScreen;
