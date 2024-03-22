import { ScreenContainer, TripCard } from "../components";
import {
  Text,
  HStack,
  VStack,
  Icon,
  Avatar,
  View,
  Heading,
  Image,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import React, { useCallback, useMemo, useRef } from "react";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Travel from "../assets/travel.png";
import Expenses from "../assets/expenses.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/user/userSlice";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export const ProfileScreen = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { name, photo } = useSelector((state) => state.user.user);
  const { trips } = useSelector((state) => state.trips);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const calculateTotalExpenses = useMemo(() => {
    let total = 0;
    if (trips === undefined) return;

    trips.forEach((trip) => {
      total += trip.total;
    });
    total = total.toFixed(2);
    setTotalExpenses(total);
  }, [trips]);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["21%"], []);

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
      <View
        style={{
          width: 500,
          height: 500,
          borderRadius: 250,
          // left: 105,
          alignSelf: "center",
          top: -300,
          // borderRadius: 100,
          backgroundColor: "#FFC200",
          position: "absolute",
        }}
      />
      <TouchableOpacity
        onPress={handlePresentModalPress}
        style={{
          position: "absolute",
          right: 20,
          top: 50,
          padding: 10,
        }}
      >
        <AntDesign name="setting" size={28} color="black" />
      </TouchableOpacity>
      <VStack mt={90} alignItems="center" space="lg">
        <Avatar
          size="xl"
          bgColor="white"
          // borderColor="$indigo600"
          borderWidth={2}
          mt={-5}
        >
          <Image
            alt="profile"
            size="md"
            borderRadius="$full"
            source={{ uri: photo }}
          />
        </Avatar>
        <Text size="2xl" bold>
          {name}
        </Text>
      </VStack>
      <VStack
        space="xl"
        style={{
          borderWidth: 1,
          // padding: 20,
          borderRadius: 10,
          backgroundColor: "white",
          marginVertical: 20,
        }}
      >
        <HStack
          style={{
            overflow: "hidden",
          }}
        >
          <VStack space="xl" my="$4" mx="$4">
            <Text size="sm">Lifetime Trip</Text>
            <Heading size="lg">{trips.length}</Heading>
          </VStack>
          <Image
            source={Travel}
            alt="travel"
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              right: 20,
              top: 10,
              transform: [{ rotate: "30deg" }],
            }}
          />
        </HStack>
      </VStack>
      <VStack
        space="xl"
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <HStack
          style={{
            overflow: "hidden",
          }}
        >
          <VStack space="xl" my="$4" mx="$4">
            <Text size="sm">Lifetime Expenses</Text>
            <Heading size="lg">RM {totalExpenses}</Heading>
          </VStack>
          <Image
            source={Expenses}
            alt="expenses"
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              right: 20,
              top: 10,
              transform: [{ rotate: "30deg" }],
            }}
          />
        </HStack>
      </VStack>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
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
              <Text size="lg">Edit Profile</Text>
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
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
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
              <Text size="lg">Logout</Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    // gap: 10,
    alignItems: "center",
  },
});
