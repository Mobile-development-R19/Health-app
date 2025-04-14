import { useState, useEffect } from "react";
import { Keyboard, StyleSheet, FlatList, ScrollView, Text, TextInput,
    TouchableOpacity, View } from "react-native";
import { auth, getFirestore, doc, getDoc, updateDoc  } from "../firebase/Config";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import FoodResult from "../components/FoodResult";
import FoodSelected from "../components/FoodSelected";
import FoodEntry from "../components/FoodEntry";
import DatePicker from "../components/DatePicker";

export default function FoodScreen() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);
    const [foods, setFoods] = useState({});
    const [showFoods, setShowFoods] = useState(true);
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        const db = getFirestore();
        const user = auth.currentUser;

        (async () => {
            try {
                const d = await getDoc(doc(db, "users", user.uid));
                if (d.exists() && d.data().foods)
                    setFoods(d.data().foods);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    async function syncFoods(f) {
        const db = getFirestore();
        const user = auth.currentUser;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                foods: f
            });
        } catch (error) {
            console.log(error);
        }
    }

    function parseName(n) {
        const [name, ...extraSplit] = n.split(", ");
        const extra = extraSplit.length > 0 ? extraSplit.join(", ") : null;
        return {name, extra};
    }

    async function doSearch(q) {
        setResults([]);

        if (q.length === 0)
            return;

        try {
            const response = await fetch(`https://fineli.fi/fineli/api/v1/foods?q=${q}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const data = await response.json();
            setResults(data.map((e) => {
                const {name, extra} = parseName(e.name.fi);

                return {
                    id: e.id,
                    name,
                    extra,
                };
            }));
        } catch (error) {
            console.error(error);
        }
    }

    function setAmount(id, amount) {
        amount = !amount ? 0 : Math.max(amount, 0);
        setSelected(selected.map((e) => e.id === id ? { ...e, amount } : e));
    }

    function deleteSelected(id) {
        setSelected(selected.filter((e) => e.id !== id));
    }

    function addSelected() {
        const key = year.toString() + month.toString().padStart(2, "0") + day.toString().padStart(2, "0");
        const tmp = foods;

        if (tmp[key])
            tmp[key].push(...selected);
        else
            tmp[key] = selected;

        setFoods(tmp);
        setShowFoods(true);
        setSelected([]);
        setQuery("");
        syncFoods(tmp);
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={query}
                    placeholder="Lisää ruokia..."
                    placeholderTextColor="#bbb"
                    onChangeText={(e) => {
                        setQuery(e);
                        setShowFoods(false);
                        doSearch(e);
                    }}
                />
                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        setQuery("");
                        setResults([]);
                    }}
                >
                    <Ionicons
                        name="close-circle"
                        size={32}
                        color="#f77"
                    />
                </TouchableOpacity>
            </View>
            <ScrollView stickyHeaderIndices={[1]}>
                {showFoods
                    ? <View>
                        <FlatList
                            contentContainerStyle={styles.foodsContainer}
                            scrollEnabled={false}
                            data={Object.keys(foods).sort((a, b) => (+b) - (+a))}
                            keyExtractor={(e) => e}
                            renderItem={({item}) => (
                                <FoodEntry
                                    id={item}
                                    data={foods[item]}
                                    deleteEntryCallback={(id, itemId) => {
                                        const tmp = { ...foods };
                                        tmp[id] = tmp[id].filter((e) => e.id !== itemId);
                                        if (tmp[id].length === 0)
                                            delete tmp[id];
                                        setFoods(tmp);
                                        syncFoods(tmp);
                                    }}
                                />
                            )}
                        />
                    </View>
                    : <View>
                        <FlatList
                            contentContainerStyle={styles.selectedContainer}
                            scrollEnabled={false}
                            data={selected}
                            keyExtractor={(e) => e.id}
                            renderItem={({item}) => (
                                <FoodSelected
                                    id={item.id}
                                    name={item.name}
                                    extra={item.extra}
                                    amount={item.amount}
                                    setAmountCallback={(amount) => {
                                        setAmount(item.id, amount);
                                    }}
                                    deleteCallback={(id) => {
                                        deleteSelected(id);
                                    }}
                                />
                            )}
                        />
                        <View>
                            {selected.length > 0
                                ? <View style={styles.buttonsContainer}>
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
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={[styles.button, {
                                                backgroundColor: "#f77",
                                                borderColor: "#d55",
                                                marginRight: 5,
                                            }]}
                                            onPress={() => {
                                                setSelected([]);
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
                                                addSelected();
                                            }}
                                            disabled={disabled}
                                        >
                                            <Text style={styles.text}>
                                                Lisää valinta
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null
                            }
                        </View>
                        <FlatList
                            contentContainerStyle={styles.resultsContainer}
                            scrollEnabled={false}
                            data={results}
                            keyExtractor={(e) => e.id}
                            renderItem={({item}) => (
                                <FoodResult
                                    id={item.id}
                                    name={item.name}
                                    extra={item.extra}
                                    addCallback={() => {
                                        setSelected([...selected, {
                                                id: item.id,
                                                name: item.name,
                                                extra: item.extra,
                                                amount: 100,
                                            },
                                        ]);
                                    }}
                                />
                            )}
                        />
                    </View>
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Constants.statusBarHeight,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        margin: 10,
        padding: 10,
        borderRadius: 20,
        borderColor: "#ddd",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    input: {
        flex: 1,
        marginLeft: 6,
        fontSize: 18,
    },
    selectedContainer: {
        justifyContent: "flex-start",
    },
    buttonsContainer: {
        margin: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#fff",
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
    resultsContainer: {
        justifyContent: "flex-start",
    },
});
