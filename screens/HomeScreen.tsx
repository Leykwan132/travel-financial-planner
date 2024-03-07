import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";
import { ScreenContainer, ImageView, TripCard } from "../components";
import {
  Text,
  HStack,
  VStack,
  Icon,
  Avatar,
  Divider,
  Button,
  ButtonText,
  useToast,
} from "@gluestack-ui/themed";
import ClockLoader from "react-spinners/ClipLoader";

import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  EvilIcons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Skeleton, Heading } from "native-base";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFooter,
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Path } from "react-native-svg";
import CountryFlag from "react-native-country-flag";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Pressable,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInLeft,
  FadeOutRight,
} from "react-native-reanimated";

import { useSelector, useDispatch } from "react-redux";
import { addTransaction } from "../redux/features/transaction/transactionsSlice";
import { updateTripTotal } from "../redux/features/trip/tripsSlice";
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

const DismissKeyboard = ({ children }) => ({ children });

export const HomeScreen = ({ navigation }) => {
  // get the length of convertAmount
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [searchItem, setSearchItem] = useState("");
  const [filteredCountry, setFilteredCountry] = useState(data);
  const [currentInput, setCurrentInput] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [fetchedDate, setFetchedDate] = useState("");
  const [addStage, setAddStage] = useState("trip");

  const { trips } = useSelector((state) => state.trips);
  // state for adding spending
  const [tripId, setTripId] = useState("");
  const [tripName, setTripName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const [addStatus, setAddStatus] = useState("idle");
  const [chosenTrip, setChosenTrip] = useState({});
  const toast = useToast();

  const handleTrendingPress = async () => {
    try {
      console.log("fetching");
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddTransaction = async () => {
    try {
      setAddStatus("loading");

      // add the transaction
      await dispatch(
        addTransaction({
          tripId,
          category,
          description,
          amount: convertedAmount,
        })
      );
      console.log("transaction added...");
      await dispatch(
        updateTripTotal({
          tripId,
          amount: convertedAmount,
        })
      );
      // update the total

      bottomSheetAddModalRef.current?.dismiss();
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
                paddingHorizontal: 20,
                minWidth: Dimensions.get("window").width - 40,
                marginHorizontal: 10,
              }}
            >
              <HStack
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <HStack alignItems="center">
                  <LottieView
                    source={require("../assets/lottie/success.json")}
                    autoPlay
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    loop={false}
                  />
                  <Text size="md">Transaction Added!</Text>
                </HStack>
                <Text
                  onPress={() => {
                    navigation.navigate("Details", {
                      tripId: chosenTrip.tripId,
                      total: chosenTrip.total,
                      baseCurrency: chosenTrip.baseCurrency,
                      title: chosenTrip.tripName,
                      destination: chosenTrip.destination,
                    });
                  }}
                  size="md"
                  color="#00B2FF"
                  bold
                >
                  Show
                </Text>
              </HStack>
            </View>
          );
        },
      });
      setTripId("");
      setCategory("");
      setTripName("");
      setDescription("");
      setAddStage("trip");
    } catch (e) {
      console.error(e);
    } finally {
      setAddStatus("idle");
    }
  };

  // handle removal of modal
  const isFocused = useIsFocused();
  const removeModal = useEffect(() => {
    if (!isFocused) {
      bottomSheetResultModalRef.current?.dismiss();
    }
  }, [isFocused]);

  // ref for currency
  const bottomSheetModalRef = useRef<BottomSheetModal>("");
  const snapPoints = useMemo(() => ["50%", "93%"], []);
  const handlePresentModalPress = useCallback((inputType) => {
    setCurrentInput(inputType);
    bottomSheetModalRef.current?.present();
  }, []);

  // render scrollview
  const renderItem = useCallback(
    (currency) => (
      <VStack
        justifyContent="center"
        alignItems="center"
        style={{
          width: "33%",
          padding: 14,
        }}
        key={currency.isoCode}
      >
        <TouchableOpacity
          onPress={() => {
            if (currentInput === "from") {
              setFromCurrency(currency.currency);
            } else if (currentInput === "to") {
              setToCurrency(currency.currency);
            }

            setSearchItem("");
            setFilteredCountry(data);
            bottomSheetModalRef.current.dismiss();
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

  // render trip
  const renderTrip = useCallback(
    (trip) => (
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 6,
        }}
        onPress={() => {
          console.log("trip", trip);
          setTripId(trip.tripId);
          setTripName(trip.tripName);
          setAddStage("category");
          setChosenTrip(trip);
          bottomSheetAddModalRef.current?.snapToPosition("30%");
        }}
        key={trip.tripId}
      >
        <HStack
          style={styles.title}
          style={{
            gap: 10,
            alignItems: "center",
          }}
        >
          <Avatar bgColor="gray" size="md" borderRadius="$xl">
            {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
            <AntDesign name="hearto" size={16} color="white" />
          </Avatar>
          <View>
            <Text size="md" color="black" bold>
              {trip.tripName}{" "}
            </Text>
            <Text size="xs">{trip.destination}</Text>
          </View>
        </HStack>
      </TouchableOpacity>
    ),
    []
  );

  // render result
  const bottomSheetResultModalRef = useRef<BottomSheetModal>(null);
  const snapPointsResult = useMemo(() => ["40%"], []);
  const handlePresentResultModalPress = useCallback(() => {
    bottomSheetResultModalRef.current?.present();
  }, []);

  const bottomSheetAddModalRef = useRef<BottomSheetModal>(null);
  const snapPointsAdd = useMemo(() => ["40%", "80%"], []);
  const handlePresentAddModalPress = useCallback(() => {
    bottomSheetAddModalRef.current?.present();
  });

  // render backdrop
  const renderBackdrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        onPress={() => {
          setTripId("");
          setTripName("");
          setCategory("");
          setAddStage("trip");
        }}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }, []);

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <Animated.View>
          <TouchableOpacity
            size="md"
            variant="solid"
            action="primary"
            isDisabled={
              (category == "") | (description == "") | (tripId == "")
                ? true
                : false
            }
            isFocusVisible={false}
            style={
              (category == "") | (description == "") | (tripId == "")
                ? {
                    padding: 12,
                    margin: 12,
                    borderRadius: 12,
                    opacity: 0.5,
                    minHeight: 50,
                    backgroundColor: "#FFC200",
                  }
                : styles.footerContainer
            }
            onPress={handleAddTransaction}
          >
            {addStatus === "loading" ? (
              <LottieView
                source={require("../assets/lottie/loading.json")}
                autoPlay
                loop
                style={{
                  width: 50,
                  height: 50,
                  position: "absolute",
                  bottom: 0,
                  alignSelf: "center",
                }}
              />
            ) : (
              <Text color="white" bold alignSelf="center">
                Confirm
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetFooter>
    ),
    [category, description, tripId]
  );

  // filter the data displayed
  const handleInputChange = (e) => {
    const searchTerm = e;
    setSearchItem(searchTerm);
    const filteredCountry = data.filter((input) =>
      input["country"].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountry(filteredCountry);
  };

  const handleChangeText = (text: string) => {
    // only allow decimal and numeric values
    setAmount(text);
  };

  const checkCurrency = useEffect(() => {
    if (amount != 0) {
      setLoading(true);
      handleConversion();
    }
  }, [fromCurrency, toCurrency]);

  const handleConversion = async () => {
    // call the api to convert the currency
    // set the converted amount
    try {
      const fromCurrencyLower = fromCurrency.toLowerCase();
      const toCurrencyLower = toCurrency.toLowerCase();

      // handle same currency
      if (fromCurrency === toCurrency) {
        setConvertedAmount(amount);
        return;
      }

      // handle other currencies conversion
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrencyLower}.json`
      );
      const fetchData = await response.json();

      const rates = fetchData[fromCurrencyLower][toCurrencyLower];

      const convertedAmount = (parseFloat(amount) * parseFloat(rates)).toFixed(
        2
      );

      setConvertedAmount(convertedAmount);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <ScreenContainer>
      <VStack space="md">
        <Text size="2xl" bold>
          Home
        </Text>
        <HStack space="lg">
          <TouchableOpacity
            style={styles.trending}
            onPress={() => {
              handleTrendingPress();
            }}
          >
            <Text>Trending</Text>
            <Icon as={Ionicons} name="flame-outline" size="sm" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.recents}>
            <Text>Recents</Text>
            <Icon as={MaterialIcons} name="history" size="sm" />
          </TouchableOpacity>
        </HStack>

        {/* Conversion Calculator */}
        <HStack space="4xl">
          <VStack space="2" flex={0.5}>
            <Text size="xl">From</Text>
            <TouchableOpacity
              onPress={() => {
                handlePresentModalPress("from");
              }}
              style={styles.button}
            >
              <HStack justifyContent="space-between" alignItems="center">
                <Text>{fromCurrency}</Text>
                <Icon as={Ionicons} name="chevron-down" size="sm" />
              </HStack>
            </TouchableOpacity>
          </VStack>

          <VStack space="2" flex={0.5}>
            <Text size="xl">To</Text>
            <TouchableOpacity
              onPress={() => {
                handlePresentModalPress("to");
              }}
              style={styles.button}
            >
              <HStack justifyContent="space-between" alignItems="center">
                <Text>{toCurrency}</Text>
                <Icon as={Ionicons} name="chevron-down" size="sm" />
              </HStack>
            </TouchableOpacity>
          </VStack>
        </HStack>

        {/* Amount Component */}
        <VStack space="2" mb="$5">
          <View>
            <Text size="xl">Amount</Text>

            <HStack justifyContent="space-between" alignItems="center">
              <TextInput
                value={amount}
                onChangeText={handleChangeText}
                placeholder="Enter Amount"
                inputMode="numeric"
                style={styles.input}
                keyboardType="number-pad"
              />

              {loading ? (
                <Progress.Circle
                  size={26}
                  color="black"
                  indeterminate={true}
                  style={{
                    alignItems: "center",
                  }}
                />
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      setLoading(true); // Set loading to true before fetching
                      handleConversion();
                      handlePresentResultModalPress();
                    }}
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Icon as={EvilIcons} name="arrow-right" size={40} />
                  </TouchableOpacity>
                </View>
              )}
            </HStack>
          </View>

          {/* </DismissKeyboard> */}
        </VStack>
      </VStack>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <TextInput
          style={styles.textInput}
          value={searchItem}
          placeholder="Search a country or currency..."
          onChangeText={handleInputChange}
        />
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {filteredCountry.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetResultModalRef}
        index={0}
        snapPoints={snapPointsResult}
        detached={true}
        bottomInset={100}
        style={{
          marginHorizontal: 24,
          borderRadius: 16,
          borderWidth: 1,
        }}
      >
        <View style={styles.resultViewContainer}>
          <Text>You're paying</Text>

          {loading ? (
            <Skeleton h="40" rounded="3xl" startColor="amber.200" speed={3} />
          ) : (
            <>
              {convertedAmount.length > 7 ? (
                <VStack alignItems="flex-end" ml={30} mb={20}>
                  <Heading size="2xl">{convertedAmount}</Heading>
                  <Text>{toCurrency}</Text>
                </VStack>
              ) : (
                <VStack alignItems="flex-end" ml={30} mb={20}>
                  <Heading size="4xl">{convertedAmount}</Heading>
                  <Text>{toCurrency}</Text>
                </VStack>
              )}
            </>
          )}

          <HStack alignItems="center" space="md">
            <TouchableOpacity
              onPress={() => {
                bottomSheetResultModalRef.current?.dismiss();
                handlePresentAddModalPress();
              }}
              style={styles.addToDashboardButton}
            >
              <Text bold style={{ color: "white" }}>
                Add to my trip
              </Text>
            </TouchableOpacity>
          </HStack>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              bottomSheetResultModalRef.current?.dismiss();
            }}
          >
            <AntDesign name="close" size={24} color="#D3D3D3" />
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetAddModalRef}
        index={0}
        snapPoints={snapPointsAdd}
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior="restore"
        footerComponent={addStage == "describe" && renderFooter}
      >
        <View style={styles.addContentContainer}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            mb="$4"
            px="$4"
          >
            {
              <HStack space="xs">
                <TouchableOpacity
                  onPress={() => {
                    setAddStage("trip");
                    setCategory("");
                    setTripId("");
                    setTripName("");
                  }}
                >
                  <Text size="md" bold={addStage == "trip" ? true : false}>
                    {tripId == "" ? "Trips" : tripName}
                  </Text>
                </TouchableOpacity>
                {
                  // if addStage is category, show the category
                  addStage == "category" ? (
                    <>
                      <Text>/</Text>
                      <TouchableOpacity>
                        <Text
                          size="md"
                          bold={addStage == "category" ? true : false}
                        >
                          {category == "" ? "Category" : category}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    addStage == "describe" && (
                      <>
                        <Text>/</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setAddStage("category");
                            bottomSheetAddModalRef.current?.snapToPosition(
                              "30%"
                            );
                          }}
                        >
                          <Text
                            size="md"
                            bold={addStage == "category" ? true : false}
                          >
                            {category == "" ? "Category" : category}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )
                  )
                }
                {
                  // if addStage is category, show the category
                  addStage == "describe" && (
                    <>
                      <Text>/</Text>
                      <TouchableOpacity>
                        <Text size="md" bold>
                          Describe
                        </Text>
                      </TouchableOpacity>
                    </>
                  )
                }
              </HStack>
            }

            <Text>
              {toCurrency} {convertedAmount}
            </Text>
          </HStack>
          <Divider mt="$1" />

          {addStage == "trip" && (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutRight}
              flex={1}
              backgroundColor="#FAF9F6"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                // pt="$2"
                my="$4"
                px="$4"
              >
                <Text size="md" bold>
                  Select trip
                </Text>
                <Text size="md" bold color="#00B2FF">
                  New trip
                </Text>
              </HStack>

              <BottomSheetScrollView
                contentContainerStyle={styles.addScrollView}
              >
                {trips.map(renderTrip)}
              </BottomSheetScrollView>
            </Animated.View>
          )}

          {addStage == "category" && (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutRight}
              backgroundColor="#FAF9F6"
              flex={1}
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                // pt="$2"
                mt="$4"
                px="$4"
              >
                <Text size="md" bold>
                  Select Category
                </Text>
              </HStack>
              <HStack justifyContent="space-around" p="$4" mt="$1">
                <VStack justifyContent="center" alignItems="center" space="xs">
                  <TouchableOpacity
                    style={styles.badge}
                    onPress={() => {
                      setCategory("Transport");
                      setAddStage("describe");
                      bottomSheetAddModalRef.current?.snapToPosition("40%");
                    }}
                  >
                    {category == "transport" && (
                      <Ionicons
                        style={{
                          position: "absolute",
                          opacity: 0.4,
                          right: 6,
                          top: 4,
                          zIndex: 1,
                          transform: [{ rotate: "20deg" }],
                        }}
                        color="#FFC200"
                        name="car-sport"
                        size={24}
                      />
                    )}
                    <Ionicons
                      name="car-sport-outline"
                      size={24}
                      color="black"
                      style={{
                        zIndex: 2,
                      }}
                    />
                  </TouchableOpacity>
                  <Text size="xs">Transport</Text>
                </VStack>
                <VStack justifyContent="center" alignItems="center" space="xs">
                  <TouchableOpacity
                    style={styles.badge}
                    onPress={() => {
                      setCategory("Stay");
                      setAddStage("describe");
                      bottomSheetAddModalRef.current?.snapToPosition("40%");
                    }}
                  >
                    {category == "stay" && (
                      <Ionicons
                        style={{
                          position: "absolute",
                          opacity: 0.4,
                          right: 6,
                          top: 4,
                          zIndex: 1,
                          transform: [{ rotate: "20deg" }],
                        }}
                        color="#FFC200"
                        name="bed"
                        size={24}
                      />
                    )}
                    <Ionicons name="bed-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <Text size="xs">Stay</Text>
                </VStack>
                <VStack justifyContent="center" alignItems="center" space="xs">
                  <TouchableOpacity
                    style={styles.badge}
                    onPress={() => {
                      setCategory("Food");
                      setAddStage("describe");
                      bottomSheetAddModalRef.current?.snapToPosition("40%");
                    }}
                  >
                    {
                      // if category is food, show the icon
                      category == "food" && (
                        <MaterialCommunityIcons
                          style={{
                            position: "absolute",
                            opacity: 0.5,
                            // rotate
                            right: 6,
                            top: 4,
                            zIndex: 1,
                            transform: [{ rotate: "20deg" }],
                          }}
                          name="food"
                          size={24}
                          color="#FFC200"
                        />
                      )
                    }
                    <MaterialCommunityIcons
                      name="food-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Text size="xs">Food</Text>
                </VStack>
                <VStack justifyContent="center" alignItems="center" space="xs">
                  <TouchableOpacity
                    style={styles.badge}
                    onPress={() => {
                      setCategory("Activities");
                      setAddStage("describe");
                      bottomSheetAddModalRef.current?.snapToPosition("40%");
                    }}
                  >
                    {
                      // if category is food, show the icon
                      category == "activities" && (
                        <Ionicons
                          style={{
                            position: "absolute",
                            opacity: 0.5,
                            // rotate
                            right: 6,
                            top: 4,
                            zIndex: 1,
                            transform: [{ rotate: "20deg" }],
                          }}
                          name="game-controller"
                          size={24}
                          color="#FFC200"
                        />
                      )
                    }
                    <Ionicons
                      name="game-controller-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Text size="xs">Activities</Text>
                </VStack>
              </HStack>
            </Animated.View>
          )}

          {addStage == "describe" && (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutRight}
              flex={1}
              backgroundColor="#FAF9F6"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                // pt="$2"
                mt="$4"
                px="$4"
              >
                <Text size="md" bold>
                  Describe your spending
                </Text>
              </HStack>
              <View flex={1} justifyContent="start">
                <BottomSheetTextInput
                  // ref={inputRef}
                  // autoFocus={true}
                  value={description}
                  placeholder="Describe here..."
                  style={styles.addTextInput}
                  // selectTextOnFocus={true}
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
            </Animated.View>
          )}
        </View>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    fontSize: 18,
    width: "90%",
    // bottom border only
    borderBottomWidth: 1,
  },
  trending: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    gap: 5,
  },
  recents: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    gap: 5,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    borderColor: "gray",
    marginTop: 10,
    borderWidth: 1,
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    color: "black",
    textAlign: "left",
  },
  contentContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  flagCircle: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
  resultContainer: {
    alignItems: "center",
  },
  resultViewContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: "relative",
  },

  addToDashboardButton: {
    backgroundColor: "black",
    alignItems: "center",
    fontWeight: "bold",
    padding: 10,
    // set maximum horizontal padding
    width: "100%",
    borderRadius: 100,
  },
  dismissButton: {
    topMargin: 10,
  },
  close: {
    position: "absolute",
    top: 0,
    right: 20,
  },
  addContentContainer: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 20,
    // justifyContent: "center",
  },
  addScrollView: {
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  footerContainer: {
    minHeight: 50,
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#FFC200",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
  badge: {
    borderRadius: 100,
    height: 50,
    width: 50,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addTextInput: {
    marginTop: 38,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    fontSize: 24,
    borderRadius: 12,
    borderBottomWidth: 1,
    alignSelf: "stretch",
    color: "black",
    textAlign: "center",
  },
});
