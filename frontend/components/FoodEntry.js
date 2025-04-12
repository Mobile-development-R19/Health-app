import { StyleSheet, FlatList, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodEntry({id, data, deleteEntryCallback}) {
    function formatDate(dt) {
        const y = dt.substring(0, 4);
        const m = dt.substring(4, 6);
        const d = dt.substring(6, 8);
        return d + "." + m + "." + y;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.date}>
                {formatDate(id)}
            </Text>
            <FlatList
                scrollEnabled={false}
                data={data}
                keyExtractor={(e) => e.id}
                renderItem={({item}) => (
                    <View style={styles.entryContainer}>
                        <View>
                            <Text style={styles.title} >
                                ・ {item.name} {item.amount}g
                            </Text>
                            <Text style={styles.text}>
                                {item.extra}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteEntryCallback(id, item.id);
                                }}
                            >
                                <Ionicons
                                    name="close"
                                    size={32}
                                    color="#f77"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    date: {
        fontSize: 20,
        fontWeight: "bold",
    },
    entryContainer: {
        flexDirection: "row",
    },
    title: {
        marginTop: 10,
        fontSize: 16,
    },
    text: {
        marginLeft: 20,
        color: "#aaa",
        width: 300, // TODO: Use device width - N
    },
    buttonContainer: {
        justifyContent: "center",
    },
});
