import React, { useCallback, useMemo, useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  Card,
  Avatar,
  HStack,
  VStack,
  Heading,
  Text,
  Divider,
} from "@gluestack-ui/themed";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import CustomFooter from "./CustomFooter";
import Transaction from "./Transaction";
interface ComponentProps {
  title: string;
  destination: string;
  baseCurrency: string;
  tripId: string;
  total: number;
  navigation?: any;
  // Define your component props here
}

export const TripCard: React.FC<ComponentProps> = ({
  title,
  destination,
  navigation,
  baseCurrency,
  total,
  tripId,
}) => {
  // Implement your component logic here
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalDateRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalTypeRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["90%"], []);
  const snapPointsDate = useMemo(() => ["30%"], []);
  const snapPointsType = useMemo(() => ["30%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalDatePress = useCallback(() => {
    bottomSheetModalDateRef.current?.present();
  }, []);
  const handlePresentModalTypePress = useCallback(() => {
    bottomSheetModalTypeRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {}, []);

  // renders
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter
        {...props}
        bottomInset={24}
        style={{
          padding: 2,
          borderRadius: 100,
        }}
      >
        <TouchableOpacity
          style={styles.footerContainer}
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
          }}
        >
          <AntDesign name="close" size={16} color="white" />
        </TouchableOpacity>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Details", {
          tripId: tripId,
          total: total,
          baseCurrency: baseCurrency,
          title: title,
          destination: destination,
        });
      }}
    >
      <Card size="lg" variant="filled" py="$3" px="$1" borderRadius="$2xl">
        <HStack space="lg">
          <Avatar bgColor="gray" size="md" borderRadius="$xl">
            {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
            <AntDesign name="hearto" size={16} color="white" />
          </Avatar>
          <HStack
            style={{
              // width: "100%",
              flex: 1,
              justifyContent: "space-between",
              // backgroundColor: "black",
            }}
          >
            <VStack minWidth="20%" justifyContent="center">
              <Text size="md" bold>
                {title}
              </Text>

              <Text size="sm">{destination}</Text>
            </VStack>
            <VStack justifyContent="center" mr="$2">
              <Text size="xl" bold>
                {baseCurrency} {total}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          footerComponent={CustomFooter}
        ></BottomSheetModal>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    gap: 20,
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    borderWidth: 1,
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "black",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
  contentContainer: {
    marginTop: -10,
    flex: 1,
    gap: 10,
    alignItems: "start",
    justifyContent: "space-between",
  },
  transactionContainer: {
    // backgroundColor: "green",
    paddingBottom: 100,
  },
  filterContainer: {
    gap: 20,
    marginVertical: 10,

    alignItems: "center",
  },
  filterContent: {
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
});
