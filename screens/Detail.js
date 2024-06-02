import React, {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [favorites, setFavorites] = useState([]);
    // variabilise l'affichage du coeur et l'ajout au favoris mais je n'arrive pas a le set en arrivant sur la page, le titre n'est donc pas en favoris par defaut meme si il a été ajouté précédement
    const [isFavorite, setIsFavorite] = useState(false);

    const loadFavorites = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@favorites');
            if (jsonValue != null) {
                setFavorites(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // sauvegarde les favoris dans le localStorage
    const saveFavorites = async (favorites) => {
        try {
            const jsonValue = JSON.stringify(favorites);
            await AsyncStorage.setItem('@favorites', jsonValue);
        } catch (error) {
            console.error(error);
        }
    };

    const addFavorite = (item) => {
        // si le favoris existe deja, on ne l'ajoute pas
        if (!favorites.some(favorite => favorite.trackId === item.trackId)) {
            const newFavorites = [...favorites, item];
            setFavorites(newFavorites);
            saveFavorites(newFavorites);
            setIsFavorite(true);
        }
        setIsFavorite(true);
    }

    const removeFromFavorites = (item) => {
        // on filtre les favoris sans prendre le favoris cible
        const newFavorites = favorites.filter(favorite => favorite.trackId !== item.trackId);
        setFavorites(newFavorites);
        saveFavorites(newFavorites);
        setIsFavorite(false)
    };

    useEffect(() => {
        loadFavorites()
    }, []);

    return (
        <View style={styles.container}>
            <Icon
                name={!isFavorite ? 'heart-o' : 'heart'}
                type={"font-awesome"}
                color={'#f50'}
                size={30}
                onPress={!isFavorite ? () => addFavorite(item) : () => removeFromFavorites(item)}
             />
            <Image source={{ uri: item.artworkUrl100 }} style={styles.image} />
            <Text style={styles.title}>{item.trackName}</Text>
            <Text style={styles.artist}>{item.artistName}</Text>
            <Text style={styles.album}>{item.collectionName}</Text>
            <Button
                title="Retourner à l'acceuil"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#121212'
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    artist: {
        fontSize: 20,
        color: 'gray',
    },
    album: {
        fontSize: 18,
        color: 'darkgray',
    },
});

export default DetailsScreen;
