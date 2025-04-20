import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function FoodInfo({name, info, amount, nutrients, onClose}) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title} >
                    {name}
                </Text>
                <Text style={styles.info}>
                    {info}
                </Text>
                <Text style={styles.amount}>
                    Ravintosisältö / {amount} g
                </Text>
            </View>

            <View style={styles.nutrientsContainer}>
                <View>
                    <Text>Rasva</Text>
                    <Text>Tyydyttyneet rasvahapot</Text>
                    <Text>Proteiini</Text>
                    <Text>Hiilihydraatit</Text>
                    <Text>Sokeri</Text>
                    <Text>Kuitu</Text>
                    <Text>Suola</Text>
                    <Text>Alkoholi</Text>
                    <Text>Energia</Text>
                </View>
                <View>
                    <Text style={styles.nutrientAmount}>{nutrients.fat} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.saturatedFats} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.carbohydrates} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.protein} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.sugar} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.fiber} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.salt} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.alcohol} g</Text>
                    <Text style={styles.nutrientAmount}>{nutrients.energy} kcal</Text>
                </View>
            </View>

            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        onClose();
                    }}
                >
                    <Text style={styles.text}>
                        Sulje
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 32,
        borderColor: "#66d",
        borderWidth: 3,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
    },
    info: {
        color: "#aaa",
        width: 300,
    },
    amount: {
        marginTop: 30,
        marginBottom: 4,
        fontSize: 20,
    },
    nutrientsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    nutrientAmount: {
        textAlign: "right",
    },
    button: {
        marginTop: 30,
        padding: 10,
        backgroundColor: "#0a0",
        borderRadius: 12,
    },
    text: {
        textAlign: "center",
        color: "#fff",
    },
});
