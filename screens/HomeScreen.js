import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://itunes.apple.com/search?term=${searchTerm}`);
            setData(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Details', { item })}
        >
            <Image source={{ uri: item.artworkUrl100 }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.trackName}</Text>
                <Text style={styles.artist}>{item.artistName}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Button title="Favoris" onPress={() => navigation.navigate('Favorites')} />
            <TextInput
                style={styles.input}
                placeholder="Search for music"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <Button title="Search" onPress={fetchData} />
            <FlatList
                data={data}
                keyExtractor={(item) => '' + item.trackId}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 16,
        color: 'gray',
    },
});

export default HomeScreen;
