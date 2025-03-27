import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const WIDTH = Dimensions.get('window').width - 70;

export default function Chart({data}) {
    function transformData(data) {
        let tmp = [];
        for (const d of data)
            tmp.push({value: d});
        return tmp;
    }

    return (
        <View style={styles.container}>
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
                maxValue={1000}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesType={"solid"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
});
