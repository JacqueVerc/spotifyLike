import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
    const [music, setMusic] = useState('');
    const [data, setData] = useState([]);

    // Appel a l'api avec la valeur donné danc l'input -> stock dans data -> affichage via flatlist
    // Utilisation de axios : le fetch du cours ne me renvoe rien ou alors une erreur dans le typage
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://itunes.apple.com/search?term=${music}`);
            setData(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Style affichage d'un élément de la flatlist
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
            <Button title="Vos favoris" onPress={() => navigation.navigate('Favorites')} />
            <TextInput
                style={styles.input}
                placeholder="Rechercher une musique"
                value={music}
                onChangeText={setMusic}
            />
            <Button title="Rechercher" onPress={fetchData} />
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
        backgroundColor: '#121212',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: '#555',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: '#000000',
        backgroundColor: '#ffffff',
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
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
        color: '#fff',
    },
    artist: {
        fontSize: 16,
        color: '#bbb',
    },
    search: {
        color: '#000000'
    }
});

export default Home;
