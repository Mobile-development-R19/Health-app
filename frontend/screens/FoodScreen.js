import { useState } from "react";
import { Keyboard, StyleSheet, FlatList, ScrollView, Text, TextInput,
    TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import FoodResult from "../components/FoodResult";
import FoodSelected from "../components/FoodSelected";

export default function FoodScreen() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState([]);

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
                const [name, ...extraSplit] = e.name.fi.split(", ");
                const extra = extraSplit.length > 0 ? extraSplit.join(", ") : null;

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

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={query}
                    placeholder="Hae ruokia..."
                    placeholderTextColor="#bbb"
                    onChangeText={(e) => {
                        setQuery(e);
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
                        ? <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, {
                                    backgroundColor: "#f77",
                                    borderColor: "#d55",
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
                                style={[styles.button, {
                                    backgroundColor: "#6d6",
                                    borderColor: "#0a0",
                                }]}
                            >
                                <Text style={styles.text}>
                                    Lisää valinta
                                </Text>
                            </TouchableOpacity>
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 5,
    },
    button: {
        flex: 1,
        alignItems: "center",
        margin: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 3,
    },
    text: {
        fontSize: 16,
        color: "#fff",
    },
    resultsContainer: {
        justifyContent: "flex-start",
    },
});
