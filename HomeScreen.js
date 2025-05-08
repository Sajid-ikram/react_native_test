import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CryptocurrencyModel } from './CryptocurrencyModel';

const HomeScreen = ({ navigation }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await fetch(
        'https://rest.coincap.io/v3/assets?apiKey=b6ee03780f6acadd929335235924e61c844785ad513ac283a109894fc814469d'
      );
      if (!response.ok) throw new Error('Failed to fetch cryptocurrencies');

      const json = await response.json();
      const model = CryptocurrencyModel.fromJson(json);
      setCryptos(model.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Helpers ----------------------

  const parseNum = (str, fallback = 0) => parseFloat(str || '') || fallback;

  const calculateSupplyPercent = (item) => {
    const supply = parseNum(item.supply);
    const maxSupply = parseNum(item.maxSupply, 1);
    return ((supply / maxSupply) * 100).toFixed(2);
  };

  const calculatePreviousPrice = (item) => {
    const current = parseNum(item.priceUsd);
    const change = parseNum(item.changePercent24Hr);
    return current / (1 + change / 100);
  };

  const calculate24hROI = (item) => {
    const current = parseNum(item.priceUsd);
    const prev = calculatePreviousPrice(item);
    return (((current - prev) / prev) * 100).toFixed(2);
  };

  const calculateVolatility = (item) => {
    const dailyChange = Math.abs(parseNum(item.changePercent24Hr)) / 100;
    return (dailyChange * Math.sqrt(365) * 100).toFixed(2);
  };

  const calculateAnnualROI = (item) => {
    let rawChange = parseNum(item.changePercent24Hr);
    rawChange = Math.max(-99, Math.min(99, rawChange)); // clamp
    const dailyRate = rawChange / 100;
    const roi = (Math.pow(1 + dailyRate, 365) - 1) * 100;
    return Math.min(Math.max(roi, -100), 10000).toFixed(2); // return capped %
  };

  // ---------------------- UI ----------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList

        data={cryptos}
        keyExtractor={(item) => item.id}


        initialNumToRender={10} // Only render 10 items initially
        maxToRenderPerBatch={10} // Render 10 items at a time
        windowSize={5} // Render 5 screens worth of items
        removeClippedSubviews={true} // Unmount items when offscreen
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate('CryptoChart', { cryptocurrency: item })
            }
          >
            <View>
              <Text style={styles.title}>{`${item.name} (${item.symbol})`}</Text>
              <Text style={styles.subtitle}>
                {`Price: $${parseNum(item.priceUsd).toFixed(2)}`}
              </Text>
              <Text style={styles.subtitle}>
                Market Cap: ${parseNum(item.marketCapUsd).toExponential(2)}
              </Text>
              <Text style={styles.subtitle}>
                Volume (24h): ${parseNum(item.volumeUsd24Hr).toExponential(2)}
              </Text>
              <Text style={styles.subtitle}>
                VWAP (24h): ${parseNum(item.vwap24Hr).toFixed(2)}
              </Text>
              <Text style={styles.subtitle}>
                Supply Circulation: {calculateSupplyPercent(item)}%
              </Text>
              <Text style={styles.subtitle}>
                24h ROI: {calculate24hROI(item)}%
              </Text>
              <Text style={styles.subtitle}>
                Volatility (annualized): {calculateVolatility(item)}%
              </Text>

            </View>
            <Text
              style={[
                styles.change,
                {
                  color: parseNum(item.changePercent24Hr) > 0 ? 'green' : 'red',
                },
              ]}
            >
              {`${parseNum(item.changePercent24Hr).toFixed(2)}%`}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  change: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HomeScreen;
