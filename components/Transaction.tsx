import React from "react";
import {
  Text,
  View,
  HStack,
  Avatar,
  VStack,
  Pressable,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

interface TransactionProps {
  // Define your props here
  amount: number;
  date: string;
  description: string;
  category: string;
  baseCurrency: string;
}

const currencySymbols = {
  USD: "$",
  GBP: "£",
  CNY: "¥",
  EUR: "€",
  SGD: "S$",
  MYR: "RM",
  THB: "฿",
  KRW: "₩",
  JPY: "¥",
  TWD: "NT$",
  MXN: "Mex$",
  IDR: "Rp",
  VND: "₫",
  AUD: "A$",
  NZD: "NZ$",
  EGP: "E£",
  ZAR: "R",
  CHF: "CHF",
  DKK: "kr",
  CAD: "C$",
  ISK: "kr",
  SEK: "kr",
  NOK: "kr",
  HRK: "kn",
  CZK: "Kč",
  HUF: "Ft",
  PLN: "zł",
  TRY: "₺",
  PEN: "S/.",
  LKR: "Rs",
  KHR: "៛",
};

// Convert ISO 8601 formatted date string to DD/MM/YYYY format
function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const Transaction: React.FC<TransactionProps> = ({
  amount,
  date,
  description,
  category,
  baseCurrency,
  navigation,
  transactionId,
}) => {
  // Implement your component logic here

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("Transaction", {
          amount: amount,
          date: date,
          description: description,
          category: category,
          baseCurrency: baseCurrency,
          transactionId: transactionId,
        });
      }}
    >
      <HStack space="md" justifyContent="space-between">
        <HStack space="md">
          {category == "Stay" && (
            <Avatar bgColor="#ff5400" size="md" borderRadius="$md">
              {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
              <Ionicons name="bed-sharp" size={24} color="white" />
            </Avatar>
          )}
          {category == "Food" && (
            <Avatar bgColor="#ff0054" size="md" borderRadius="$md">
              {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
              <MaterialIcons name="fastfood" size={24} color="white" />
            </Avatar>
          )}
          {category == "Transport" && (
            <Avatar bgColor="#9e0059" size="md" borderRadius="$md">
              {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
              <Ionicons name="car-sport-sharp" size={24} color="white" />
            </Avatar>
          )}
          {category == "Activities" && (
            <Avatar bgColor="#390099" size="md" borderRadius="$md">
              {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
              <Ionicons name="game-controller-sharp" size={24} color="white" />
            </Avatar>
          )}

          <VStack alignItems="start" justifyContent="center">
            <Text bold>{description}</Text>
            <Text color="#BFBFBF" size="sm">
              {formatDate(date)}
            </Text>
          </VStack>
        </HStack>
        <HStack justifyContent="center" alignItems="flex-start" space="xs">
          <Text size="lg" bold>
            {currencySymbols[baseCurrency]} {amount}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#BFBFBF"
            style={{
              marginTop: 6,
            }}
          />
        </HStack>
      </HStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
  },
});
