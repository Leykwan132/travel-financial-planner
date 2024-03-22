import { ScreenContainer, ImageView } from "../components";
import {
  Text,
  Button,
  VStack,
  Card,
  ButtonIcon,
  AddIcon,
  Avatar,
  Divider,
  Toast,
  ToastTitle,
  ToastDescription,
  HStack,
} from "@gluestack-ui/themed";
import { ScrollView, useToast } from "native-base";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFooter,
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TripCard, TripSkeleton } from "../components";
import { TextInput } from "react-native-gesture-handler";
import CountryFlag from "react-native-country-flag";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInLeft,
  FadeOutRight,
} from "react-native-reanimated";
import firestore from "@react-native-firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { addTrip, fetchTrips } from "../redux/features/trip/tripsSlice";
import { fetchTransactions } from "../redux/features/transaction/transactionsSlice";
import LottieView from "lottie-react-native";

const data = [
  { country: "United States", currency: "USD", isoCode: "US" },
  { country: "United Kingdom", currency: "GBP", isoCode: "UK" },
  { country: "China", currency: "CNY", isoCode: "CN" },
  { country: "France", currency: "EUR", isoCode: "FR" },
  { country: "Spain", currency: "EUR", isoCode: "ES" },
  { country: "Italy", currency: "EUR", isoCode: "IT" },
  { country: "Singapore", currency: "SGD", isoCode: "SG" },
  { country: "Malaysia", currency: "MYR", isoCode: "MY" },
  { country: "Thailand", currency: "THB", isoCode: "TH" },
  { country: "South Korea", currency: "KRW", isoCode: "KR" },
  { country: "Japan", currency: "JPY", isoCode: "JP" },
  { country: "Taiwan", currency: "TWD", isoCode: "TW" },
  { country: "Germany", currency: "EUR", isoCode: "DE" },
  { country: "Mexico", currency: "MXN", isoCode: "MX" },
  { country: "Greece", currency: "EUR", isoCode: "GR" },
  { country: "Indonesia", currency: "IDR", isoCode: "ID" },
  { country: "Vietnam", currency: "VND", isoCode: "VN" },
  { country: "Australia", currency: "AUD", isoCode: "AU" },
  { country: "New Zealand", currency: "NZD", isoCode: "NZ" },
  { country: "Egypt", currency: "EGP", isoCode: "EG" },
  { country: "South Africa", currency: "ZAR", isoCode: "ZA" },
  { country: "Austria", currency: "EUR", isoCode: "AT" },
  { country: "Portugal", currency: "EUR", isoCode: "PT" },
  { country: "Switzerland", currency: "CHF", isoCode: "CH" },
  { country: "Netherlands", currency: "EUR", isoCode: "NL" },
  { country: "Denmark", currency: "DKK", isoCode: "DK" },
  { country: "Canada", currency: "CAD", isoCode: "CA" },
  { country: "Iceland", currency: "ISK", isoCode: "IS" },
  { country: "Ireland", currency: "EUR", isoCode: "IE" },
  { country: "Cambodia", currency: "KHR", isoCode: "KH" },
  { country: "Peru", currency: "PEN", isoCode: "PE" },
  { country: "Sri Lanka", currency: "LKR", isoCode: "LK" },
  { country: "Turkey", currency: "TRY", isoCode: "TR" },
  { country: "Croatia", currency: "HRK", isoCode: "HR" },
  { country: "Czech Republic", currency: "CZK", isoCode: "CZ" },
  { country: "Hungary", currency: "HUF", isoCode: "HU" },
  { country: "Poland", currency: "PLN", isoCode: "PL" },
  { country: "Norway", currency: "NOK", isoCode: "NO" },
  { country: "Sweden", currency: "SEK", isoCode: "SE" },
  { country: "Finland", currency: "EUR", isoCode: "FI" },
  { country: "Belgium", currency: "EUR", isoCode: "BE" },
  { country: "Slovenia", currency: "EUR", isoCode: "SI" },
];

export const TripScreen = ({ navigation, route }) => {
  const ref = firestore().collection("trips");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const trips = useSelector((state) => state.trips.trips);
  const tripStatus = useSelector((state) => state.trips.tripStatus);
  const status = useSelector((state) => state.transactions.status);

  const [currentStage, setCurrentStage] = useState("country");
  const initialFadeIn = FadeIn.delay(500);
  const customFadeIn = FadeInLeft.delay(0);
  const customFadeOut = FadeOutRight.delay(0);

  // Handling trip creation
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [addTripStatus, setAddTripStatus] = useState("idle");
  const [missingFields, setMissingFields] = useState(false);
  const toast = useToast();

  // search for places
  const [searchItem, setSearchItem] = useState("");
  const [filteredCountry, setFilteredCountry] = useState(data);
  const [currentInput, setCurrentInput] = useState("");

  // handle new trip

  const handleInputChange = (e) => {
    const searchTerm = e;
    setSearchItem(searchTerm);
    const filteredCountry = data.filter((input) =>
      input["country"].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountry(filteredCountry);
  };
  // render scrollview
  const renderItem = useCallback(
    (currency) => (
      <VStack
        justifyContent="center"
        alignItems="center"
        style={{
          padding: 14,
        }}
        key={currency.isoCode}
      >
        <TouchableOpacity
          onPress={() => {
            setCurrentStage("currency");
            setDestination(currency.country);
            setSearchItem("");
            setFilteredCountry(data);
          }}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ImageView isoCode={currency.isoCode} style={styles.flagCircle} />
          <Text mt="$2" size="xs">
            {currency.country}
          </Text>
        </TouchableOpacity>
      </VStack>
    ),
    [currentInput]
  );

  // render currency
  const renderCurrency = useCallback(
    (currency) => (
      <VStack
        justifyContent="center"
        alignItems="center"
        style={{
          padding: 14,
        }}
        key={currency.isoCode}
      >
        <TouchableOpacity
          onPress={() => {
            setCurrentStage("name");
            setBaseCurrency(currency.currency);
            setSearchItem("");
            setFilteredCountry(data);
            bottomSheetModalRef.current?.snapToIndex(0);
          }}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ImageView isoCode={currency.isoCode} style={styles.flagCircle} />
          <Text mt="$2" size="xs">
            {currency.country}
          </Text>
        </TouchableOpacity>
      </VStack>
    ),
    [currentInput]
  );

  // trip fetching
  const tripSkeletons = Array.from({ length: 10 }, (v, i) => i);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTransactions());
    }
  }, []);

  const handleTripNameChange = (text) => {
    setTripName(text);
  };
  const handleDestinationChange = (text) => {
    setDestination(text);
  };
  const handleBaseCurrencyChange = (text) => {
    setBaseCurrency(text);
  };

  const handleCreateTrip = async () => {
    try {
      if (tripName === "" || destination === "" || baseCurrency === "") {
        setMissingFields(true);
        return;
      }

      setAddTripStatus("loading");

      await dispatch(
        addTrip({
          user: user.email,
          date: new Date().toISOString(),
          tripName: tripName,
          baseCurrency: baseCurrency,
          destination: destination,
          tripId: nanoid(),
        })
      ).unwrap();

      bottomSheetModalRef.current?.dismiss();

      toast.show({
        duration: 3000,
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
                marginBottom: 40,
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
                <Text size="md">Trip Created!</Text>
              </HStack>
            </View>
          );
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      setAddTripStatus("idle");
      setCurrentStage("country");
      setTripName("");
      setDestination("");
      setBaseCurrency("");
      setMissingFields(false);
    }
  };

  // renders
  const renderFooter = useCallback((props) => {
    return (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={styles.footerContainer}>
          <Text alignSelf="center" color="red">
            Please fill in the missing fields.
          </Text>
        </View>
      </BottomSheetFooter>
    );
  }, []);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["55%", "93%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleKeyboardBlur = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  // renders backdrop
  const renderBackdrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        onPress={
          // handleKeyboardBlur
          () => {
            setCurrentInput("");
            setSearchItem("");
            setFilteredCountry(data);
            setMissingFields(false);
            setCurrentStage("country");
          }
        }
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }, []);
  useEffect(() => {
    if (route.params?.detail) {
      console.log("changed param");
      bottomSheetModalRef.current?.present();
      route.params.detail = null;
    }
  }, [route.params]);
  useEffect(() => {
    if (tripStatus === "idle") {
      dispatch(fetchTrips());
    }
  }, [tripStatus, dispatch]);
  return (
    <ScreenContainer>
      <HStack justifyContent="space-between" alignItems="center" mt="$2">
        <Text size="2xl" bold>
          Trips
        </Text>
        <TouchableOpacity
          onPress={handlePresentModalPress}
          style={{
            padding: 5,
          }}
        >
          <AntDesign name="plus" size={16} color="black" />
        </TouchableOpacity>
      </HStack>
      {/* Trip part */}
      {status === "idle" ? (
        <></>
      ) : (
        <ScrollView
          mb={-24}
          px={5}
          mx={-6}
          style={{
            paddingBottom: 200,
            // marginBottom: 20,
          }}
        >
          <View
            style={{
              paddingBottom: 40,
              marginTop: 10,
            }}
          >
            {trips.map((trip, index) => (
              <React.Fragment key={index}>
                <TripCard
                  key={index}
                  title={trip.tripName}
                  destination={trip.destination}
                  baseCurrency={trip.baseCurrency}
                  total={trip.total}
                  navigation={navigation}
                  tripId={trip.tripId}
                />
                {/* render a divider for all but the last index */}

                {index !== trips.length - 1 && (
                  <Divider
                    my={1}
                    style={{
                      width: "80%",
                      alignSelf: "flex-end",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        keyboardBlurBehavior="restore"
        footerComponent={missingFields && renderFooter}
      >
        {
          // render component if stage is "name"
          currentStage === "name" && (
            <Animated.View
              entering={customFadeIn}
              exiting={FadeOutRight}
              style={styles.contentContainer}
            >
              <TouchableOpacity
                onPress={() => {
                  setCurrentStage("currency");
                }}
                style={{
                  position: "absolute",
                  padding: 20,
                  left: 0,
                  top: 0,
                }}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
              <Text
                size="xl"
                alignSelf="center"
                textAlign="center"
                style={styles.addHeader}
              >
                {`So, you're visiting ${destination}\n with ${baseCurrency} as base currency, `}
              </Text>

              <Text size="xl" alignSelf="center" style={styles.addHeader}>
                {`now give your trip a name!`}
              </Text>
              <BottomSheetTextInput
                value={tripName}
                style={styles.textInput}
                onChangeText={handleTripNameChange}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateTrip}
              >
                {addTripStatus === "loading" ? (
                  <LottieView
                    source={require("../assets/lottie/loading.json")}
                    autoPlay
                    loop
                    style={{
                      width: 50,
                      height: 50,
                      // move up
                      transform: [{ translateY: -14 }],
                    }}
                  />
                ) : (
                  <Text color="black">Create </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )
        }

        {currentStage === "country" && (
          <Animated.View
            entering={customFadeIn}
            exiting={FadeOutRight}
            style={styles.currencyContentContainer}
          >
            <Text size="xl" alignSelf="center" style={styles.addHeader}>
              Where are you visiting?{" "}
            </Text>
            <TextInput
              style={styles.countryInput}
              value={searchItem}
              placeholder="Search a country ..."
              onChangeText={handleInputChange}
            />
            <BottomSheetScrollView
              contentContainerStyle={styles.scrollContainer}
            >
              {filteredCountry.map(renderItem)}
            </BottomSheetScrollView>
            {/* TODO: Set the focus to be at input when clicked the button */}
          </Animated.View>
        )}

        {currentStage === "currency" && (
          <Animated.View
            entering={customFadeIn}
            exiting={FadeOutRight}
            style={styles.currencyContentContainer}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                padding: 20,
                left: 0,
                top: -15,
              }}
              onPress={() => {
                setCurrentStage("country");
              }}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text
              size="xl"
              alignSelf="center"
              textAlign="center"
              style={styles.addHeader}
            >
              {`${destination} it is! \nWhat's your base currency?`}
            </Text>
            <TextInput
              style={styles.countryInput}
              value={searchItem}
              placeholder="Search a country ..."
              onChangeText={handleInputChange}
            />
            <BottomSheetScrollView
              contentContainerStyle={styles.scrollContainer}
            >
              {filteredCountry.map(renderCurrency)}
            </BottomSheetScrollView>
          </Animated.View>
        )}
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
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },

  addButton: {
    padding: 20,
    backgroundColor: "black",
    borderRadius: 100,
    bottom: 30,
    right: 30,
    position: "absolute",
  },
  currencyContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    color: "black",
    textAlign: "center",
    fontSize: 40,
    height: 60,
    borderBottomWidth: 1,
  },
  countryInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    color: "black",
    textAlign: "left",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  button: {
    padding: 15,
    marginTop: 20,
    maxHeight: 50,
    backgroundColor: "#FFC200",
    borderRadius: 100,
    paddingHorizontal: 20,
  },
  addHeader: {
    marginTop: 10,
    marginBottom: 20,
  },
  flagCircle: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
});
