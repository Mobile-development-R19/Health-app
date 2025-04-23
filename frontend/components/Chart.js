import { Dimensions, StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import React, { useState } from "react";

const WIDTH = Dimensions.get('window').width - 70 ;

export default function Chart({data}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    function transformData(data) {
        let tmp = [];
        for (let i = 0; i < data.length; i++) {
            const steps = data[i];
            const date = new Date()
            date.setDate(date.getDate() - (data.length - 1 - i));
            const label = date.toLocaleDateString('fi-FI')
            

            tmp.push({
                value: steps,
                onPress: () => {
                    setSelectedData({ steps, date: label });
                    setModalVisible(true);
                }
            });
        }
        return tmp;
    }

    return (
        <View style={styles.container}>
            
            <BarChart
                data={transformData(data)}
                endSpacing={0}
                disableScroll={false}
                width={WIDTH}
                hideDataPoints={true}
                spacing={5}
                barWidth={10}
                disablePress={false}
                barBorderRadius={6}
                maxValue={10000}
                noOfSections={4}
                yAxisLabelWidth={40}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesType={"solid"}
            />
        
            <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{selectedData.date}</Text>
                        <Text style={styles.modalSteps}>{selectedData.steps}</Text>
                        <Text style={styles.modalText}> askelta</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        width: 200,
        marginTop: 150
    },
    modalText: {
        fontSize: 12,
        marginVertical: 6,
    },
    modalSteps: {
        fontSize: 36
    }
})