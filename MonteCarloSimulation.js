import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Main Component
const MonteCarloSimulation = () => {
  // Dummy cryptocurrency data
  const cryptocurrency = {
    name: 'DummyCoin',
    symbol: 'DMC',
    priceUsd: '1000',
  };

  const [steps, setSteps] = useState(100);
  const [simulations, setSimulations] = useState(50);
  const [simulationResults, setSimulationResults] = useState([]);

  // Function to simulate random price changes
  const runSimulation = () => {
    const random = Math.random;
    const initialPrice = parseFloat(cryptocurrency.priceUsd || '0');
    const volatility = 0.05;

    const results = [];

    for (let i = 0; i < simulations; i++) {
      const path = [];
      let price = initialPrice;

      for (let j = 0; j < steps; j++) {
        const randomChange =
          random() * volatility * initialPrice * (random() > 0.5 ? 1 : -1);
        price = Math.max(0, price + randomChange); // Prevent negative prices
        path.push({ x: j, y: price });
      }

      results.push(path);
    }

    setSimulationResults(results);
  };

  // Function to render the chart
  const renderChart = () => {
    if (simulationResults.length === 0) {
      return <Text style={styles.placeholderText}>Run a simulation to see results.</Text>;
    }

    // Convert simulation results to datasets
    const datasets = simulationResults.map((path) => ({
      data: path.map((point) => point.y),
    }));

    return (
      <ScrollView horizontal>
        {datasets.map((line, index) => (
          <LineChart
            key={index}
            data={{
              datasets: [line],
            }}
            width={screenWidth * 1.5} // Adjust width for scrollable chart
            height={300}
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#e3e3e3',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '0', // Hide dots for smooth lines
              },
            }}
            bezier
            style={styles.chart}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Monte Carlo Simulation: {cryptocurrency.name} ({cryptocurrency.symbol})
      </Text>
      <Text style={styles.description}>
        Simulating price changes for {cryptocurrency.name}
      </Text>

      {/* Input Fields */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Steps (e.g., 100)"
          keyboardType="numeric"
          onChangeText={(text) => setSteps(parseInt(text) || 100)}
        />
        <TextInput
          style={styles.input}
          placeholder="Simulations (e.g., 50)"
          keyboardType="numeric"
          onChangeText={(text) => setSimulations(parseInt(text) || 50)}
        />
      </View>

      <Button title="Run Simulation" onPress={runSimulation} />

      {/* Chart Section */}
      <View style={styles.chartContainer}>{renderChart()}</View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 8,
  },
  chartContainer: {
    flex: 1,
    marginTop: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default MonteCarloSimulation;
