import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ChartPreview from "../components/ChartPreview";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChartPreviewScreen({navigation}) {
    const [data, _] = useState([
        30, 40, 50, 20, 10, 30, 40, 50, 40, 10, 30, 20
    ]);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.chartContainer}>
                <ChartPreview
                    navigation={navigation}
                    data={data}
                    title="Askeleet"
                />
            </View>
            <Footer navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 30,
        backgroundColor: "#f9f9f9",
    },
    chartContainer: {
        flex: 1,
        justifyContent: "flex-start",
    },
});
