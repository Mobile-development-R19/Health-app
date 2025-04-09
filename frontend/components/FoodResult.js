import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodResult({id, name, extra, addCallback}) {
    return (
        <View
            style={styles.container}
            key={id}
        >
            <View>
                <Text style={styles.title} >
                    {name}
                </Text>
                <Text style={styles.text}>
                    {extra}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.add}
                onPress={addCallback}
            >
                <Ionicons
                    name="add-circle"
                    size={32}
                    color="#6d6"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        margin: 10,
        marginBottom: 0,
        borderRadius: 20,
        borderColor: "#eee",
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
    },
    text: {
        color: "#aaa",
        width: 300, // TODO: Use device width - N
    },
    add: {
        justifyContent: "center",
    },
});
