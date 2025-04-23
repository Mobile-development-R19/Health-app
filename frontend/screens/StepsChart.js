import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import TabBar from "../components/TabBar";
import Chart from "../components/Chart";
import SleepChart from "../components/SleepChart";
import { getDoc, db, doc, auth } from "../firebase/Config";
import { ActivityIndicator } from "react-native";

const MIN = 10;
const MAX = 1000;

export default function StepsChart({ navigation }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    /*
    Generoitu data testivaiheeseen

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateData(count) {
        let tmp = [];
        for (let i = 0; i < count; i++)
            tmp.push(random(MIN, MAX));
        setData(tmp);
    }
        */

    const showStepData = async (count = 1) => {
        try {
            setLoading(true)
            const user = auth.currentUser;
            if (!user) {
                console.log("User not signed in");
                setLoading(false)
                return;
            }
    
            const uid = user.uid;
            const today = new Date();
    
            const promises = [];
    
            for (let i = 0; i < count; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateId = date.toISOString().split("T")[0];
                const ref = doc(db, "users", uid, "steps", dateId);
                promises.push(getDoc(ref));
            }
    
            const snapshots = await Promise.all(promises);
            const stepsArray = snapshots.map((snap) => {
                if (snap.exists()) {
                    const d = snap.data();
                    return d.steps ?? 0;
                } else {
                    return 0;
                }
            });
    
            // Päiväkohtainen data käännetään oikein päin (vanhin ensin)
            setData(stepsArray.reverse());
            setLoading(false)
    
        } catch (error) {
            console.error("Fetching steps failed: ", error);
            setData([0]);
        }
    };

    // Suoritetaan kun komponentti renderöityy
    useEffect(() => {
      showStepData()
    }, [])

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.chartContainer}>
                    <TabBar
                        tabs={[
                            { title: "Päivä", onPress: () => showStepData(1) },
                            { title: "Viikko", onPress: () => showStepData(7) },
                            { title: "Kuukausi", onPress: () => showStepData(30) },
                        ]}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            {data.reduce((a, b) => a + b, 0)}
                        </Text>
                        <Text style={styles.textSmall}>askelta</Text>
                    </View>
                    {loading ? (
                    <ActivityIndicator size="large" color="lightgray" style={styles.loader} />
                ) : (
                    <View style={styles.chart}>
                        <Chart data={data} />
                    </View>
                )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
    },
    chartContainer: {
        flex: 1,
        justifyContent: "flex-start",
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 20,
        marginLeft: 10,
        height: 44,
    },
    text: {
        fontSize: 40,
    },
    textSmall: {
        fontSize: 22,
        color: "#000",
        marginLeft: 4,
    },
    chart: {
        marginTop: 30,
    }
});
