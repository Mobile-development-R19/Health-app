import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "./DatePicker";

export default function FoodForm({onSubmit, onCancel}) {
    // Päivämäärä
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);

    // Napin tila
    const [disabled, setDisabled] = useState(true);

    return (
        <View>
            {/* Päivämäärän syöttäminen */}
            <View>
                <DatePicker
                    day={day}
                    month={month}
                    year={year}
                    setDay={setDay}
                    setMonth={setMonth}
                    setYear={setYear}
                    onChange={(e) => {
                        setDisabled(!e);
                    }}
                />
            </View>

            {/* Napit valittujen ruokien lisäämiseen tai poistoon */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, {
                        backgroundColor: "#f77",
                        borderColor: "#d55",
                        marginRight: 5,
                    }]}
                    onPress={() => {
                        onCancel();
                    }}
                >
                    <Text style={styles.text}>
                        Poista valinta
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[disabled ? {...styles.button, ...styles.disabled} : styles.button, {
                        backgroundColor: "#6d6",
                        borderColor: "#0a0",
                        marginLeft: 5,
                    }]}
                    onPress={() => {
                        onSubmit(
                            year.toString().padStart(4, "0") +
                            "-" +
                            month.toString().padStart(2, "0") +
                            "-" +
                            day.toString().padStart(2, "0")
                        );
                    }}
                    disabled={disabled}
                >
                    <Text style={styles.text}>
                        Lisää valinta
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 3,
    },
    disabled: {
        opacity: 0.25,
    },
    text: {
        fontSize: 16,
        color: "#fff",
    },
});
