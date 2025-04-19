import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FoodSelected({id, name, info, amount, setAmountCallback, deleteCallback}) {
    return (
        <View
            style={styles.container}
            key={id}
        >
            <View style={styles.topContainer}>
                <View>
                    <Text style={styles.title} >
                        {name}
                    </Text>
                    <Text style={styles.text}>
                        {info}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => deleteCallback(id)}
                >
                    <Ionicons
                        name="close"
                        size={32}
                        color="#f77"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setAmountCallback(id, Number(amount) - 50);
                    }}
                >
                    <Ionicons
                        name="remove-circle"
                        size={32}
                        color="#f77"
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={amount.toString()}
                    inputMode="numeric"
                    onChangeText={(e) => {
                        setAmountCallback(id, Number(e));
                    }}
                />
                <Text style={styles.g}>
                    g
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setAmountCallback(id, Number(amount) + 50);
                    }}
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
        backgroundColor: "#fff",
        padding: 12,
        margin: 10,
        marginBottom: 0,
        borderRadius: 20,
        borderColor: "#66d",
        borderWidth: 3,
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 20,
    },
    text: {
        color: "#aaa",
        width: 300, // TODO: Use device width - N
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "#eee",
        fontSize: 20,
        textAlign: "center",
    },
    g: {
        fontSize: 20,
        marginLeft: 4,
    },
    button: {
        justifyContent: "center",
        marginHorizontal: 10,
    },
});
