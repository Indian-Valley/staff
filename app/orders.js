import React, {useEffect, useState} from 'react'

import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Icon from "react-native-feather"

import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function OrdersScreen() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [orders, setOrders] = useState([]);
    const [pressedOrderId, setPressedOrderId] = useState(null);

    const router = useRouter();

    const fetchOrders = async () => {
        // try {
        //     const response = await fetch('http://localhost:3000/orders');
        //     const orders = await response.json();
        //     setOrders(orders);
        //
        //     // console.log("from server:", orders); // Process orders in the app
        // } catch (error) {
        //     console.error('Error fetching orders:', error);
        // }
        setOrders( [{"created_at": "2025-01-14T22:45:44.333024+00:00", "customer_name": "Mumin Ali", "id": 2, "is_delivery": true, "items": [
                {
                    "name": "Popadom",
                    "quantity": 3
                },
                {
                    "name": "Mint Sauce",
                    "quantity": 1
                },
                {
                    "name": "Sheek Kebab Main",
                    "quantity": 1
                },
                {
                    "name": "Garlic Naan",
                    "quantity": 2
                }
            ], "payment_method": "cash", "status": "Pending", "target_time": "13:28:06", "total_price": 30.98},
            {"created_at": "2025-01-14T22:32:02.551548+00:00", "customer_name": "John Doe", "id": 1, "is_delivery": false, "items": [
                    {
                        "name": "Butter Chicken",
                        "quantity": 1
                    },
                    {
                        "name": "Garlic Naan",
                        "quantity": 2
                    }
            ], "payment_method": "cash", "status": "Pending", "target_time": "13:28:06", "total_price": 20.98}])

    };

    useEffect(() => {
        fetchOrders();
        //
        // const subscription = supabase
        //     .from('orders')
        //     .on('INSERT', (payload) => {
        //         setOrders((prev) => [payload.new, ...prev]);
        //     })
        //     .on('UPDATE', (payload) => {
        //         setOrders((prev) =>
        //             prev.map((order) =>
        //                 order.id === payload.new.id ? payload.new : order
        //             )
        //         );
        //     })
        //     .subscribe();
        //
        // return () => {
        //     supabase.removeSubscription(subscription);
        // };
    }, []);

    return (
        <SafeAreaView className="bg-white">
            <StatusBar style="dark"/>
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 20}}
                        className="h-screen bg-white">

                <View className="mt-3">
                    <Text className="text-center text-xl font-extrabold text-red-500">ALL ORDERS</Text>
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
                                        <Text className={"p-1 rounded-full"+textClass}>#{order.id}</Text>
                                        <View ><Text className={``}>{order.is_delivery?"Delivery":"Collection"}</Text></View>
                                        <View ><Text className={``}>NAME: {order.customer_name}</Text></View>
                                        <View ><Text>PLACED AT: {date.getHours()}:{date.getMinutes()} on {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</Text></View>
                                        <View ><Text>£{order.total_price}</Text></View>
                                        <TouchableOpacity className="p-2 rounded-full border border-gray-800"><Text>{order.status}</Text></TouchableOpacity>

                                    </View>
                                    {(isActive)?
                                        <View className='mx-1 my-2 p-2 rounded-2xl bg-white border border-gray-200'>
                                            <Text className="p-1 text-gray-700 font-bold">ITEMS:</Text>
                                            {order.items.map((item, index) => {
                                                return (
                                                    <View className="flex-row">
                                                        <View><Text className={``}>{item.quantity}x: </Text></View>
                                                        <View><Text>{item.name}</Text></View>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        : null
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}