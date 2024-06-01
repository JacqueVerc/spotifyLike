import React, {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [favorites, setFavorites] = useState([]);
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

    const saveFavorites = async (favorites) => {
        try {
            const jsonValue = JSON.stringify(favorites);
            await AsyncStorage.setItem('@favorites', jsonValue);
        } catch (error) {
            console.error(error);
        }
    };

    const addFavorite = (music) => {
        const newFavorites = [...favorites, music];
        setFavorites(newFavorites);
        saveFavorites(newFavorites);
        setIsFavorite(true);
    }

    const removeFromFavorites = (item) => {
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
                title="Go back to Home"
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
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
