import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodSearchBar({query, setQueryCallback, onSearchStart, onSearchEnd, onSearchClear}) {
    async function doSearch(query_) {
        // Kutsutaan onSearchStart-funktio ja tallenetaan hakusana
        onSearchStart(query_);
        setQueryCallback(query_);

        // Palautetaan null, jos hakusana on tyhjä
        if (query_.length === 0) {
            onSearchEnd(null);
            return;
        }

        try {
            // Haetaan ruokia Finelin API:sta.
            // Asetetaan "User-Agent"-header, jotta haku toimii
            const response = await fetch(`https://fineli.fi/fineli/api/v1/foods?q=${query_}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });
            const data = await response.json();

            // Palautetaan tyhjä taulukko, jos hakutuloksia ei löytynyt
            if (data.length === 0) {
                onSearchEnd([]);
                return;
            }

            // Muutetaan saatu data haluttuun muotoon
            const results = data.map((e) => {
                // Nimen ja lisätietojen erottaminen
                function parseNameAndInfo(name_) {
                    const [name, ...other] = name_.split(", ");
                    const info = other.length > 0 ? other.join(", ") : null;
                    return {name, info};
                }

                const {name, info} = parseNameAndInfo(e.name.fi);
                return {
                    id: e.id,
                    name,
                    info,
                };
            });

            // Palautetaan hakutulokset
            onSearchEnd(results);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.inputContainer}>
            {/* Hakukenttä */}
            <TextInput
                style={styles.input}
                value={query}
                placeholder="Lisää ruokia..."
                placeholderTextColor="#bbb"
                onChangeText={(e) => {
                    doSearch(e);
                }}
            />

            {/* Nappi hakukentän tyhjentämiseen */}
            <TouchableOpacity
                onPress={() => {
                    Keyboard.dismiss();
                    setQueryCallback("");
                    onSearchClear();
                }}
            >
                <Ionicons
                    name="close-circle"
                    size={32}
                    color="#f77"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        marginLeft: 6,
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 20,
    },
});
