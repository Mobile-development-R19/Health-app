import { useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";

export default function TabBar({tabs, activeColor = "#000", initialIndex = 0}) {
    const [active, setActive] = useState(initialIndex);

    return (
        <View style={styles.container}>
            {tabs.map((e, i) => (
                <Pressable
                    key={i}
                    style={[
                        styles.button,
                        active == i ? {
                            backgroundColor: activeColor
                        } : null
                    ]}
                    onPress={() => {
                        setActive(i);
                        console.log(i, e.title);
                        e.onPress?.();
                    }}
                >
                    <Text
                        style={[
                            styles.text,
                            active == i ? styles.textActive : null
                        ]}
                    >
                        {e.title}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 44,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#ddd",
        borderRadius: 16,
        padding: 2,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 2,
        borderRadius: 12
    },
    text: {
        fontSize: 16
    },
    textActive: {
        color: "#fff"
    }
});
