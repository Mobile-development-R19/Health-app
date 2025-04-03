import { Dimensions, StyleSheet, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const WIDTH = Dimensions.get('window').width - 90;

export default function ChartPreview({navigation, data, title}) {
    function transformData(data) {
        let tmp = [];
        for (const d of data)
            tmp.push({value: d});
        return tmp;
    }

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.navigate("Chart");
            }}
        >
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    {title}
                </Text>
                <Text style={styles.textSmall}>
                    Katso lisää...
                </Text>
            </View>
            <BarChart
                data={transformData(data)}
                endSpacing={0}
                disableScroll={true}
                width={WIDTH}
                hideDataPoints={true}
                spacing={WIDTH / (2 * data.length)}
                barWidth={WIDTH / (2 * data.length)}
                disablePress={true}
                barBorderRadius={6}
                maxValue={60}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesType={"solid"}
                height={100}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 20,
        margin: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 20,
        height: 35,
    },
    text: {
        fontSize: 32,
    },
    textSmall: {
        fontSize: 16,
        color: "#aaa",
        marginLeft: 6,
    },
});
