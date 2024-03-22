import React, { useState, useRef, useMemo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import {
  HStack,
  Heading,
  VStack,
  Divider,
  Text,
  Pressable,
  useToast,
} from "@gluestack-ui/themed";
import { ScreenContainer } from "../components";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modal, Portal } from "react-native-paper";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransaction } from "../redux/features/transaction/transactionsSlice";
import { updateTripTotal } from "../redux/features/trip/tripsSlice";
import LottieView from "lottie-react-native";

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

export const TransactionScreen: React.FC = ({
  navigation,
  route,
}: TransactionProps) => {
  const {
    category,
    amount,
    baseCurrency,
    description,
    date,
    transactionId,
    tripId,
    total,
    destination,
  } = route.params;

  const formattedDateTime = () => {
    const newDate = new Date(date);

    // Get year, month (0-indexed), day
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");

    // Format newDate
    const formattedDate = `${day}/${month}/${year}`;

    // Get hours (12-hour format), minutes, and seconds
    const hours = newDate.getHours() % 12;
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Format time
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate}, ${formattedTime}`;
  };
  // handle deletion
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toast = useToast();

  const handleDeleteTransaction = async () => {
    try {
      await dispatch(deleteTransaction(transactionId));
      console.log("tripId", tripId);
      await dispatch(
        updateTripTotal({
          tripId,
          amount: -amount,
        })
      );
      const newTotal = total - amount;
      navigation.navigate({
        name: "Details",
        params: {
          tripId: tripId,
          total: newTotal,
          baseCurrency: baseCurrency,
          title: title,
          destination: destination,
        },
        merge: true,
      });

      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <View
              style={{
                backgroundColor: "white",
                paddingVertical: 10,
                flexDirection: "row",
                flex: 1, // Key change 1: Ensure full width
                alignItems: "center", // Adjust alignment as needed (optional)
                justifyContent: "flex-start", // Adjust positioning as needed (optional)
                marginBottom: 60,
                borderRadius: 10,
                paddingLeft: 20,
                minWidth: Dimensions.get("window").width - 40,
                marginHorizontal: 10,
              }}
            >
              <HStack
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                }}
                space="sm"
              >
                <LottieView
                  source={require("../assets/lottie/delete.json")}
                  autoPlay
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  loop={false}
                />
                <Text size="md">Transaction Deleted.</Text>
              </HStack>
            </View>
          );
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["29%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  return (
    <ScreenContainer>
      <HStack justifyContent="space-between" alignItems="center" mt="$4">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </HStack>
      <Heading size="4xl" my="$12" alignSelf="center">
        {currencySymbols[baseCurrency]} {amount}
      </Heading>
      <VStack
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 20,
        }}
      >
        <HStack py="$3" justifyContent="space-between">
          <Text size="md">Description</Text>
          <Text size="md" bold>
            {description}{" "}
          </Text>
        </HStack>
        <Divider />

        <HStack py="$3" justifyContent="space-between">
          <Text size="md">Category</Text>
          <Text size="md" bold>
            {category}{" "}
          </Text>
        </HStack>
        <Divider />
        <HStack py="$3" justifyContent="space-between">
          <Text size="md">Date added</Text>
          <Text size="md" bold>
            {formattedDateTime()}
          </Text>
        </HStack>
      </VStack>

      <VStack
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          paddingHorizontal: 15,
        }}
      >
        <HStack py="$3" justifyContent="space-between">
          <Pressable size="md" onPress={showModal} width="100%">
            <Text color="red">Delete transaction</Text>
          </Pressable>
        </HStack>
      </VStack>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <VStack
            justifyContent="center"
            alignItems="center"
            style={{
              maxWidth: 300,
              padding: 20,
            }}
            space="sm"
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Delete Transaction?
            </Text>
            <Text textAlign="center">
              You will delete the transaction permanently.
            </Text>
          </VStack>
          <Divider />
          <Pressable p="$3" onPress={handleDeleteTransaction}>
            <Text color="red" bold>
              Delete
            </Text>
          </Pressable>
          <Divider />
          <Pressable p="$3" onPress={hideModal}>
            <Text>Cancel</Text>
          </Pressable>
        </Modal>
      </Portal>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text size="xl" alignSelf="center">
            Edit data
          </Text>
          <Divider mt="$4" mb="$2" width="110%" />
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 20,
              // borderWidth: 1,

              minWidth: "93%",
              borderRadius: 10,
            }}
          >
            <HStack alignItems="center" space="md">
              <AntDesign name="edit" size={24} color="black" />
              <Text size="lg">Description</Text>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              // borderWidth: 1,
              borderColor: "black",
              padding: 20,
              minWidth: "93%",
              borderRadius: 10,
            }}
            onPress={() => {
              dispatch(logout());
              navigation.goBack();
              toast.show({
                placement: "top",
                duration: 2000,
                render: ({ id }) => {
                  const toastId = "toast-" + id;
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 10,
                        flexDirection: "row",
                        flex: 1, // Key change 1: Ensure full width
                        alignItems: "center", // Adjust alignment as needed (optional)
                        justifyContent: "flex-start", // Adjust positioning as needed (optional)
                        marginTop: 10,
                        borderRadius: 10,
                        paddingLeft: 20,
                        minWidth: Dimensions.get("window").width - 40,
                        marginHorizontal: 10,
                      }}
                    >
                      <HStack
                        style={{
                          backgroundColor: "white",
                          alignItems: "center",
                        }}
                        space="sm"
                      >
                        <LottieView
                          source={require("../assets/lottie/success.json")}
                          autoPlay
                          style={{
                            width: 50,
                            height: 50,
                          }}
                          loop={false}
                        />
                        <Text size="md">Logout Successfully!</Text>
                      </HStack>
                    </View>
                  );
                },
              });
            }}
          >
            <HStack alignItems="center" space="md">
              <AntDesign name="logout" size={24} color="black" />
              <Text size="lg">Category</Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default TransactionScreen;
