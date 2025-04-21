import { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, FlatList, Modal,
    ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { auth, getFirestore, doc, setDoc, getDocs, deleteDoc, updateDoc, collection  } from "../firebase/Config";
import FoodResult from "../components/food/FoodResult";
import FoodSelected from "../components/food/FoodSelected";
import FoodEntry from "../components/food/FoodEntry";
import FoodSearchBar from "../components/food/FoodSearchBar";
import FoodForm from "../components/food/FoodForm";
import FoodInfo from "../components/food/FoodInfo";

export default function FoodScreen() {
    // Ruoat ja tilamuuttujat
    const [foods, setFoods] = useState({});
    const [showFoods, setShowFoods] = useState(true);
    const [reversed, setReversed] = useState(false);

    // Hakutulokset ja valitut ruoat
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState({});

    // Indikaattoreita
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    // Ravintotiedot
    const [visible, setVisible] = useState(false);
    const [nutrients, setNutrients] = useState({});

    useEffect(() => {
        setLoading(true);
        setStatus("");

        if (!getAllFoods())
            setStatus("Ruokien lataaminen epäonnistui");

        setLoading(false);
    }, []);

    // Tallennettujen ruokien hakeminen Firestoresta
    async function getAllFoods() {
        const user = auth.currentUser;
        const db = getFirestore();

        try {
            // Haetaan kaikki ruoat Firestoresta
            const docs = await getDocs(collection(db, "users", user.uid, "foods"));

            // Lisätään ruoat foods-muuttujaan
            let tmp = {};
            docs.forEach((doc) => {
                tmp[doc.id] = doc.data()[doc.id];
            });
            setFoods(tmp);
        } catch (error) {
            console.error(error);
            return false;
        }

        return true;
    }

    // Ruokien lisäys halutulle päivälle
    async function addFoodsToDay(date, newFoods) {
        const user = auth.currentUser;
        const db = getFirestore();

        // Lisätään ruoat foods-muuttujaan
        const tmp = {...foods};
        tmp[date] = {...tmp[date], ...newFoods};
        setFoods(tmp);

        try {
            // Lisätään ruoat Firestoreen
            await setDoc(doc(db, "users", user.uid, "foods", date),
                tmp,
                { merge: true }
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function removeFoodFromDay(date, id) {
        const user = auth.currentUser;
        const db = getFirestore();

        // Poistetaan ruoka foods-muuttujasta
        let tmp = {...foods};
        delete tmp[date][id];
        if (Object.keys(tmp[date]).length === 0)
            delete tmp[date];
        setFoods(tmp);

        try {
            // Poistetaan dokumentti Firestoresta, jos se on tyhjä
            if (tmp[date] === undefined) {
                await deleteDoc(doc(db, "users", user.uid, "foods", date));
                return;
            }

            // Poistetaan ruoka Firestoresta
            await updateDoc(doc(db, "users", user.uid, "foods", date), {
                [date]: tmp[date]
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showInfoForFood(name, info, id, amount) {
        try {
            // Haetaan ruoan ravintotiedot Finelin API:sta
            const response = await fetch(`https://fineli.fi/fineli/api/v1/foods/${id}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                }
            });
            const data = await response.json();

            // Asetetaan ravintoarvot muuttujaan
            const f = (n, d=1) => ((n || 0) / data.mass * amount / d).toFixed(1);
            setNutrients({
                fat: f(data.fat),
                saturatedFats: f(data.saturatedFats),
                carbohydrates: f(data.carbohydrates),
                protein: f(data.protein),
                sugar: f(data.sugar),
                fiber: f(data.fiber),
                salt: f(data.salt, 1000), // Jostain syystä suola annetaan milligrammoina
                alcohol: f(data.alcohol),
                energy: f(data.energyKcal),

                name: name,
                info: info,
                amount: amount,
            });
        } catch (error) {
            console.error(error);
        }

        setVisible(true);
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={[styles.centered, {position: "absolute"}]}>
                <Modal
                    animationType="fade"
                    visible={visible}
                    transparent={true}
                    onRequestClose={() => {
                        setVisible(!visible);
                    }}
                >
                    <View style={styles.centered}>
                        <FoodInfo
                            name={nutrients.name}
                            info={nutrients.info}
                            amount={nutrients.amount}
                            nutrients={nutrients}
                            onClose={() => {
                                setVisible(!visible);
                            }}
                        />
                    </View>
                </Modal>
            </SafeAreaView>

            {/* Hakukenttä ruokien lisäystä varten */}
            <View style={styles.searchContainer}>
                <FoodSearchBar
                    query={query}
                    setQueryCallback={setQuery}

                    // Nollataan vanhat hakutulokset ja näytetään lataus-indikaattori
                    onSearchStart={(e) => {
                        setResults([]);
                        setStatus("");
                        setLoading(true);
                        setShowFoods(false);

                        if (e.length === 0 && Object.keys(selected).length === 0) {
                            setShowFoods(true);
                            setLoading(false);
                        }
                    }}

                    // Näytetään hakutulokset tai ilmoitetaan käyttäjälle,
                    // jos hakutuloksia ei löytynyt
                    onSearchEnd={(e) => {
                        setLoading(false);

                        if (e.length === 0) {
                            setStatus("Ei tuloksia");
                            return;
                        }

                        setShowFoods(false);
                        setResults(e);
                    }}

                    // Tyhjennetään hakutulokset
                    onSearchClear={() => {
                        setResults([]);
                        setStatus("");
                        setLoading(false);

                        if (Object.keys(selected).length === 0)
                            setShowFoods(true);
                    }}
                />
            </View>

            <ScrollView>
                {showFoods
                    ? <>
                        {/* Tallennettujen ruokien järjestyksen vaihtaminen */}
                        <TouchableOpacity
                            onPress={() => {
                                setReversed(!reversed);
                            }}
                        >
                            <Text style={{fontSize: 16, textAlign: "right", marginTop: 10, marginRight: 20}}>
                                {reversed ? "Uusimmat ensin" : "Vanhimmat ensin"}
                            </Text>
                        </TouchableOpacity>

                        {/* Listataan tallennetut ruoat */}
                        <FlatList
                            contentContainerStyle={styles.foodsContainer}
                            scrollEnabled={false}
                            data={reversed
                                ? Object.keys(foods).sort((a, b) => a.localeCompare(b))
                                : Object.keys(foods).sort((a, b) => b.localeCompare(a))
                            }
                            keyExtractor={(e) => e}
                            renderItem={({item}) => (
                                <FoodEntry
                                    date={item}
                                    foods={foods[item]}

                                    // Ravintotietojen näyttäminen
                                    onPress={(id) => {
                                        showInfoForFood(
                                            foods[item][id].name,
                                            foods[item][id].info,
                                            id,
                                            foods[item][id].amount
                                        );
                                    }}

                                    // Tallennetun ruoan poistaminen
                                    deleteEntryCallback={(date, id) => {
                                        removeFoodFromDay(date, id);
                                    }}
                                />
                            )}
                        />
                    </>
                    : <>
                        {/* Listataan hakutuloksista valitut ruoat */}
                        <FlatList
                            contentContainerStyle={styles.selectedContainer}
                            scrollEnabled={false}
                            data={Object.keys(selected)}
                            keyExtractor={(e) => e}
                            renderItem={({item}) => (
                                <FoodSelected
                                    id={item}
                                    name={selected[item].name}
                                    info={selected[item].info}
                                    amount={selected[item].amount}

                                    // Ravintotietojen näyttäminen
                                    onPress={(id) => {
                                        showInfoForFood(
                                            selected[item].name,
                                            selected[item].info,
                                            id,
                                            selected[item].amount
                                        );
                                    }}

                                    // Valitun ruoan määrän asettaminen
                                    setAmountCallback={(id, amount) => {
                                        amount = !amount ? 0 : Math.max(amount, 0);
                                        let tmp = {...selected};
                                        tmp[id].amount = amount;
                                        setSelected(tmp);
                                    }}

                                    // Valitun ruoan poistaminen
                                    deleteCallback={(id) => {
                                        let tmp = {...selected};
                                        delete tmp[id];
                                        setSelected(tmp);

                                        if (Object.keys(tmp).length === 0 && results.length === 0)
                                            setShowFoods(true);
                                    }}
                                />
                            )}
                        />

                        {/* Valikko ruokien lisäykseen */}
                        <View>
                            {Object.keys(selected).length > 0
                                ? <View style={styles.formContainer}>
                                    <FoodForm
                                        // Valittujen ruokien lisääminen
                                        onSubmit={(e) => {
                                            addFoodsToDay(e, selected);

                                            setSelected([]);
                                            setResults([]);
                                            setShowFoods(true);
                                            setQuery("");
                                        }}

                                        // Valittujen ruokien poistaminen
                                        onCancel={() => {
                                            setSelected([]);
                                            if (query.length === 0)
                                                setShowFoods(true);
                                        }}
                                    />
                                </View>
                                : null
                            }
                        </View>

                        {/* Hakutulokset */}
                        <FlatList
                            contentContainerStyle={styles.resultsContainer}
                            scrollEnabled={false}
                            data={results}
                            keyExtractor={(e) => e.id}
                            renderItem={({item}) => (
                                <FoodResult
                                    id={item.id}
                                    name={item.name}
                                    info={item.info}

                                    // Ravintotietojen näyttäminen
                                    onPress={(id) => {
                                        showInfoForFood(
                                            item.name,
                                            item.info,
                                            id,
                                            100
                                        );
                                    }}

                                    // Haetuloksen lisääminen valittuihin ruokiin
                                    addCallback={() => {
                                        let tmp = {...selected};
                                        tmp[item.id] = {
                                            name: item.name,
                                            info: item.info,
                                            amount: 100,
                                        };
                                        setSelected(tmp);
                                    }}
                                />
                            )}
                        />
                    </>
                }

                {/* Lataus-indikaattori */}
                {loading &&
                    <ActivityIndicator
                        style={{marginTop: 20}}
                        size="large"
                        color="#000"
                    />
                }

                {/* Status-indikaattori */}
                {status.length > 0 &&
                    <View style={{marginTop: 20, alignItems: "center"}}>
                        <Text style={{fontSize: 20}}>
                            {status}
                        </Text>
                    </View>
                }
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        margin: 10,
    },
    selectedContainer: {
        justifyContent: "flex-start",
    },
    formContainer: {
        margin: 10,
    },
    resultsContainer: {
        justifyContent: "flex-start",
    },
});
