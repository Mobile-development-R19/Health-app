import { StyleSheet, FlatList, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodEntry({date, foods, onPress, deleteEntryCallback}) {
    return (
        <View style={styles.container}>
            <Text style={styles.date}>
                {new Date(date).toLocaleDateString("fi-FI", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </Text>
            <FlatList
                scrollEnabled={false}
                data={Object.keys(foods)}
                keyExtractor={(e) => e}
                renderItem={({item}) => (
                    <View style={styles.entryContainer}>
                        <View style={styles.textContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    onPress(item);
                                }}
                            >
                                <Text style={styles.name} >
                                    {foods[item].name} {foods[item].amount}g
                                </Text>
                                <Text style={styles.info}>
                                    {foods[item].info}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteEntryCallback(date, item);
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
        marginBottom: 0,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    date: {
        margin: 5,
        fontSize: 20,
    },
    entryContainer: {
        flexDirection: "row",
        margin: 5,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
    },
    info: {
        flex: 1,
        color: "#aaa",
    },
    buttonContainer: {
        justifyContent: "center",
    },
});
