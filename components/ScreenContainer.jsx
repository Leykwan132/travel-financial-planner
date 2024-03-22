import React from "react";
import { VStack } from "native-base";
import { SafeAreaView } from "@gluestack-ui/themed";
import {} from "react-native";
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export const ScreenContainer = ({ children }) => {
  return (
    <VStack
      flex={1}
      safeAreaTop
      style={{
        backgroundColor: "#F0F5F9",
        paddingHorizontal: 20,
      }}
    >
      {children}
    </VStack>
  );
};
