import React, { useCallback, useMemo, useRef } from "react";
import { VStack, Text, View } from "@gluestack-ui/themed";

interface DayPickerProps {
  // Add any props you need here
}

export const DayPicker: React.FC<DayPickerProps> = (
  {
    /* destructure props here */
  }
) => {
  // Add your component logic here

  return (
    <VStack
      alignItems="center"
      space="sm"
      style={{
        padding: 20,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 70,
          height: 70,
          backgroundColor: "black",
          borderRadius: 100,
        }}
      >
        <Text color="white">Day 1</Text>
      </View>
      <Text>11/12/2024</Text>
    </VStack>
  );
};

export default DayPicker;
