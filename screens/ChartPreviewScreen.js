import { useState } from "react";
import { View } from "react-native";
import ChartPreview from "../components/ChartPreview.js";

export default function ChartPreviewScreen({navigation}) {
    const [data, _] = useState([
        30, 40, 50, 20, 10, 30, 40, 50, 40, 10, 30, 20
    ]);

    return (
        <View>
            <ChartPreview
                navigation={navigation}
                data={data}
                title="Askeleet"
            />
        </View>
    );
}
