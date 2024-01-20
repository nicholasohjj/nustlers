import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  FAB,
  Card,
  Divider,
  TouchableRipple,
  Button,
} from "react-native-paper";
const Payment = ({route}) => {
    const { transaction, cartItems } = route.params;
    return (
        <View>
            <Text>Payment</Text>
            <Text>
                {JSON.stringify(transaction)}
            </Text>
            <Text>
                {JSON.stringify(cartItems)}
            </Text>
        </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Payment;