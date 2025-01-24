import React, {useEffect, useState} from 'react'

import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {useRouter} from "expo-router";

export default function NewOrdersScreen() {
    const navigation = useRouter();

    return (
        <View className="h-screen w-full bg-green-800">
            <TouchableOpacity
                className="w-full h-full justify-center items-center"
                onPress={() => navigation.back()}>
                <Text className="text-white text-3xl font-extrabold">New Order!</Text>
                <Text className="text-gray-300 text-sm">Tap to dismiss</Text>
            </TouchableOpacity>
        </View>
    )
}