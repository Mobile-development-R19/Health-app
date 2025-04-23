import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodResult({id, name, info, onPress, addCallback}) {
    return (
        <View
            style={styles.container}
            key={id}
        >
            <View style={styles.textContainer}>
                <TouchableOpacity
                    onPress={() => {
                        onPress(id);
                    }}
                >
                    <Text style={styles.title} >
                        {name}
                    </Text>
                    <Text style={styles.text}>
                        {info}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
    },
    text: {
        color: "#aaa",
    },
    add: {
        justifyContent: "center",
    },
    buttonContainer: {
        justifyContent: "center",
    },
});
