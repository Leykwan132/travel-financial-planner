import React from "react";
import { Text, View, HStack, Avatar, VStack } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface TransactionProps {
  // Define your props here
  amount: number;
  date: string;
  description: string;
  category: string;
  baseCurrency: string;
}

export const Transaction: React.FC<TransactionProps> = ({
  amount,
  date,
  description,
  category,
  baseCurrency,
}) => {
  // Implement your component logic here

  return (
    <View style={styles.container}>
      <HStack space="md">
        <Avatar bgColor="gray" size="md" borderRadius="$md">
          {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
          <AntDesign name="hearto" size={16} color="white" />
        </Avatar>
        <VStack alignItems="start" justifyContent="center">
          <Text bold>
            {description} {category}
          </Text>
          <Text color="#BFBFBF" size="sm">
            12/2/2024
          </Text>
        </VStack>
        <VStack flex={1} alignItems="flex-end" justifyContent="center">
          <Text size="xl" bold mr={20}>
            {baseCurrency} {amount}
          </Text>
        </VStack>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
  },
});
