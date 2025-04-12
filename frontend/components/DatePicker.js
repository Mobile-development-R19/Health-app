import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DatePicker({day, month, year, setDay, setMonth, setYear}) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={day > 0 ? day.toString() : ""}
                onChangeText={(e) => {
                    setDay(Number(e));
                }}
                placeholder="pv"
            />
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={month > 0 ? month.toString() : ""}
                onChangeText={(e) => {
                    setMonth(Number(e));
                }}
                placeholder="kk"
            />
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={year > 0 ? year.toString() : ""}
                onChangeText={(e) => {
                    setYear(Number(e));
                }}
                placeholder="v"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    const dt = new Date();
                    setYear(dt.getFullYear());
                    setMonth(dt.getMonth() + 1);
                    setDay(dt.getDay());
                }}
            >
                <Text style={styles.text}>
                    Tänään
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    input: {
        flex: 1,
        alignItems: "center",
        marginRight: 10,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: "#ddd",
        fontSize: 16,
        textAlign: "center",
        backgroundColor: "#fff",
    },
    button: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: "#55d",
        backgroundColor: "#77f",
    },
    text: {
        fontSize: 16,
        color: "#fff",
    },
});
