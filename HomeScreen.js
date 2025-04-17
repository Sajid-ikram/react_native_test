import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CryptocurrencyModel, Data } from './CryptocurrencyModel';

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
        'https://rest.coincap.io/v3/assets?apiKey=f955f902fe4e99cc913e39a0cd56a74f71d5740bf9c957516af3a21269610464'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrencies');
      }
      const json = await response.json();
      const model = CryptocurrencyModel.fromJson(json);
      setCryptos(model.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('CryptoChart', { cryptocurrency: item })}
          >
            <View>
              <Text style={styles.title}>{`${item.name} (${item.symbol})`}</Text>
              <Text style={styles.subtitle}>
                {`Price: $${parseFloat(item.priceUsd || '0').toFixed(2)}`}
              </Text>
            </View>
            <Text
              style={[
                styles.change,
                {
                  color: parseFloat(item.changePercent24Hr || '0') > 0 ? 'green' : 'red',
                },
              ]}
            >
              {`${parseFloat(item.changePercent24Hr || '0').toFixed(2)}%`}
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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  change: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
