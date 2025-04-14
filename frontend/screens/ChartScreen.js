import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import TabBar from "../components/TabBar";
import Chart from "../components/Chart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getDoc, db, doc, auth } from "../firebase/Config";

const MIN = 10;
const MAX = 1000;


export default function ChartScreen({navigation}) {
    const [data, setData] = useState([
        30, 40, 50, 20, 10, 30, 40, 50, 40, 10, 30, 20
    ]);

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateData(count) {
        let tmp = [];
        for (let i = 0; i < count; i++)
            tmp.push(random(MIN, MAX));
        setData(tmp);
    }

    const showStepData = async() =>  {
        try {
            const user = auth.currentUser
            if (!user) {
                console.log("User not signed in")
                return
            }

            const uid = user.uid
            const todayId = new Date().toISOString().split("T")[0]

            const stepDocRef = doc(db, "users", uid, "steps", todayId)
            const stepDocSnap = await getDoc(stepDocRef)

            if (stepDocSnap.exists()) {
                const data = stepDocSnap.data()
                console.log("Steps today: ", data.steps)
                
                setData([data.steps])
            }

        } catch (error) {
            console.error("Fetching steps failed: ", error)
            setData([0])
        }
    }

    useEffect(() => {
      showStepData()
    }, [])
    

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.chartContainer}>
                <TabBar
                    tabs={[
                        {
                            title: "Päivä",
                            onPress: () => { showStepData(); }
                        },
                        {
                            title: "Viikko",
                            onPress: () => { generateData(7); }
                        },
                        {
                            title: "Kuukausi",
                            onPress: () => { generateData(30); }
                        },
                        {
                            title: "Vuosi",
                            onPress: () => { generateData(12); }
                        },
                    ]}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {data.reduce((a, b) => a + b, 0)}
                    </Text>
                    <Text style={styles.textSmall}>
                        askelta
                    </Text>
                </View>
                <View style={styles.chart}>
                    <Chart data={data} />
                </View>
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
        color: "#bbb",
        marginLeft: 4,
    },
    chart: {
        marginTop: 20,
    }
});
