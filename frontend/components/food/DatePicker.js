import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const daysPerMonth = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

export default function DatePicker({day, month, year, setDay, setMonth, setYear, onChange}) {
    function isLeapYear(y) {
        if (y % 4 !== 0)
            return false;
        if (y % 400 === 0)
            return true;
        if (y % 100 === 0)
            return false;
        return true;
    }

    function updateDay(d, m, y) {
        if (!m || !y)
            return;

        let max = daysPerMonth[m - 1];
        if (m === 2 && isLeapYear(y))
            max++;

        setDay(Math.max(Math.min(d, max), 0));
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={day > 0 ? day.toString() : ""}
                onChangeText={(e) => {
                    if (!month) {
                        setDay(Number(e));
                        return;
                    }

                    updateDay(Number(e), month, year);
                    onChange(e.length);
                }}
                placeholder="pv"
            />
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={month > 0 ? month.toString() : ""}
                onChangeText={(e) => {
                    const m = Math.max(Math.min(Number(e), 12), 0);
                    setMonth(m);
                    updateDay(day, m, year);
                    onChange(e.length);
                }}
                placeholder="kk"
            />
            <TextInput
                style={styles.input}
                inputMode="numeric"
                value={year > 0 ? year.toString() : ""}
                onChangeText={(e) => {
                    const y = Number(e);
                    setYear(y);
                    updateDay(day, month, y);
                    onChange(e.length);
                }}
                placeholder="v"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    const dt = new Date();
                    setYear(dt.getFullYear());
                    setMonth(dt.getMonth() + 1);
                    setDay(dt.getDate());
                    onChange(1);
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
