import React, {useEffect, useState} from 'react'

import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Icon from "react-native-feather"

import { StatusBar } from "expo-status-bar";

import ApiManager from "../apiManager/apiManager.js";

import ThermalPrinterModule from 'react-native-thermal-printer';
import {useRouter} from "expo-router";

ThermalPrinterModule.defaultConfig = {
    ...ThermalPrinterModule.defaultConfig,
    timeout: 30000,
};

export default function OrdersScreen() {
    const navigation = useRouter();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pressedOrderId, setPressedOrderId] = useState(null);

    const generateTicket = (order)=> {
        const date = new Date(order.created_at)

        let text =
            '[C]<img>../assets/images/restaurant-print-logo.png</img>\n' +
            '[L]\n' +
            `[C]<u><font size='big'>ORDER N°${order.id}</font></u>\n` +
            '[L]\n' +
            '[C]================================\n' +
            '[L]\n'

        order.items.forEach((item, index) => {
            text +=
                `[L]<b>${item.quantity}x ${item.name}</b>[R]${item.price}\n` +
                // '[L]  + Size : S\n' +
                '[L]\n'
        })

        text +=
            '[C]--------------------------------\n' +
            `[R]TOTAL PRICE :[R]${order.total_price}\n` +
            '[L]\n' +
            '[C]================================\n' +
            '[L]\n' +
            "[L]<font size='tall'>Customer Details:</font>\n" +
            `[L]${order.customer_name}\n` +
            `[L]Order for: ${order.is_delivery?'Delivery':'Collection'}\n` +
            '[L]...\n' +
            `[L] Placed at : ${date.getHours()}:${date.getMinutes()} on ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` +
            '[L]\n' +
            // "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
            "[C]<qrcode size='20'>https://muminali.co.uk/endless-runner</qrcode>\n" +
            '[L]\n' +
            '[L]\n' +
            '[L]\n';
        return text;
    }

    const printPressed = async (text) => {
        try {
            // await ThermalPrinterModule.printTcp({ payload: state.text }); // network print
            await ThermalPrinterModule.printBluetooth({ payload: text }); // bluetooth

            console.log('done printing');
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrders = async () => {
        try {
            console.log('fetching orders');
            setLoading(true)
            const orders = await ApiManager.getAllOrders();

            // setOrders( [{"created_at": "2025-01-14T22:45:44.333024+00:00", "customer_name": "Mumin Ali", "id": 2, "is_delivery": true, "items": [
            //                     {
            //                         "name": "Popadom",
            //                         "quantity": 3
            //                     },
            //                     {
            //                         "name": "Mint Sauce",
            //                         "quantity": 1
            //                     },
            //                     {
            //                         "name": "Sheek Kebab Main",
            //                         "quantity": 1
            //                     },
            //                     {
            //                         "name": "Garlic Naan",
            //                         "quantity": 2
            //                     }
            //                 ], "payment_method": "cash", "status": "Pending", "target_time": "13:28:06", "total_price": 30.98},
            //                 {"created_at": "2025-01-14T22:32:02.551548+00:00", "customer_name": "John Doe", "id": 1, "is_delivery": false, "items": [
            //                         {
            //                             "name": "Butter Chicken",
            //                             "quantity": 1
            //                         },
            //                         {
            //                             "name": "Garlic Naan",
            //                             "quantity": 2
            //                         }
            //                 ], "payment_method": "cash", "status": "Pending", "target_time": "13:28:06", "total_price": 20.98}])

            setOrders(orders);

        } catch (error) {
            console.error('Error fetching orders:', error);

        } finally {
            setLoading(false)
        }
    };

    const cancelOrder = async (id) => {

        console.log(`deleting order: ${id}`);
        await ApiManager.deleteOrder(id);
        fetchOrders()
    }

    useEffect(() => {
        const eventSource = ApiManager.events();

        eventSource.addEventListener('message', (event) => {
            console.log(`new message: ${JSON.stringify(event)}`);

            const { type, data, url } = JSON.parse(event.data);

            if (type === "NEW_ORDER") {
                fetchOrders();
                navigation.navigate('/new-order');
            }
        })
        eventSource.addEventListener('open', (event) => {
            console.log(`open SSE connection: ${event}`);
        })
        eventSource.addEventListener('error', (event) => {
            console.error("Connection error:", event.message);
        })

        fetchOrders();

        return () => {
            eventSource.removeAllEventListeners()
            eventSource.close()
        };
    }, []);

    return (
        <SafeAreaView className="bg-white">
            <StatusBar style="dark"/>
            <View className="flex-row items-center justify-between w-full p-2 border-b">
                <Text className="text-center text-2xl font-extrabold text-red-500">ALL ORDERS</Text>
                <TouchableOpacity onPress={() => {
                    setOrders([])
                    fetchOrders()
                }}>
                    <Text>Refresh</Text>
                </TouchableOpacity>
            </View>
            {
                loading? (
                    <View className="w-full h-screen">
                        <Image source={require("../assets/images/cook.gif")} className=" mt-auto mb-2 mx-auto w-20 h-20"/>
                        <Text className="text-gray-700 text-center text-xl mt-2 mb-auto">Loading...</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}
                                contentContainerStyle={{paddingBottom: 20}}
                                className="h-screen">

                        <View className="mt-3">
                            {
                                orders.map((order, index) => {
                                    let isActive = (order.id === pressedOrderId)
                                    let btnClass = isActive? ' bg-gray-500' : ' bg-gray-300'
                                    let textClass = isActive? ' font-semibold text-white' : ' text-gray-500'

                                    const date = new Date(order.created_at)
                                    return (
                                        <TouchableOpacity onPress={() => setPressedOrderId(order.id)}
                                                          key={index}
                                                          className={"mt-2 rounded-3xl py-2 px-4"+btnClass}>
                                            <View className="flex-row justify-between items-center">
                                                <Text className={`p-1 rounded-full${textClass}`}>#{order.id}</Text>
                                                <View ><Text className={`${textClass}`}>{order.is_delivery?"Delivery":"Collection"}</Text></View>
                                                <View ><Text className={`${textClass}`}>NAME: {order.customer_name}</Text></View>
                                                <View ><Text className={`${textClass}`}>PLACED AT: {date.getHours()}:{date.getMinutes()} on {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</Text></View>
                                                <View ><Text className={`${textClass}`}>{`£${order.total_price.toFixed(2)}`}</Text></View>
                                                <TouchableOpacity className="p-2 rounded-full border border-gray-800"><Text>{order.status}</Text></TouchableOpacity>

                                            </View>
                                            {(isActive)?
                                                <View className="flex-row justify-between items-center my-3">
                                                    <View className='flex-1 mx-1 my-2 p-2 rounded-2xl bg-white border border-gray-200 h-full'>
                                                        <Text className="p-1 text-gray-700 font-bold">ITEMS:</Text>
                                                        {order.items.map((item, index) => {
                                                            return (
                                                                <View key={index}
                                                                      className="flex-row">
                                                                    <View><Text className={``}>{item.quantity}x: </Text></View>
                                                                    <View><Text>{item.name}</Text></View>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                    <View className='flex-2 mx-1 my-2 p-2 rounded-2xl bg-white border border-gray-200 h-full'>
                                                        <TouchableOpacity className="rounded-xl bg-gray-800 "
                                                                          onPress={() => printPressed(generateTicket(order))}>
                                                            <Text className="text-white py-2 px-3 text-center">PRINT</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity className="rounded-xl bg-gray-800 mt-2"
                                                                          onPress={() => cancelOrder(order.id)}>
                                                            <Text className="text-white py-2 px-3 text-center">CANCEL</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                : null
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </View>
                    </ScrollView>
                )
            }

        </SafeAreaView>
    )
}