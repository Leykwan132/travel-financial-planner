import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Avatar,
  Text,
  HStack,
  VStack,
  Icon,
  View,
  Divider,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  CheckboxLabel,
  CheckboxGroup,
  Pressable,
  useToast,
} from "@gluestack-ui/themed";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  ScreenContainer,
  ImageView,
  TripCard,
  DayPicker,
  Transaction,
} from "../components";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Modal, Portal } from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  createSelectTransactionById,
  makeSelectTransactionById,
  deleteTransaction,
} from "../redux/features/transaction/transactionsSlice";

import { deleteTrip } from "../redux/features/trip/tripsSlice";

import LottieView from "lottie-react-native";

interface DetailProps {
  // Define your props here
  navigation?: any;
}

export const DetailScreen: React.FC<DetailProps> = ({ route, navigation }) => {
  const { tripId, total, baseCurrency, title, destination } = route.params;
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.transactions);

  const selectTransactionById = useMemo(
    () => createSelectTransactionById(tripId),
    [tripId]
  );
  const transactions = useSelector(selectTransactionById);

  // handle filtering for category
  // values of the checkboxes
  const [values, setValues] = useState([]);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [categoryChanged, setCategoryChanged] = useState(false);
  const handleApplyFilterCategory = () => {
    const filteredData = transactions.filter((transaction) => {
      return values.length === 0 || values.includes(transaction.category);
    });
    setFilteredTransactions(filteredData);
    setCurrentCategory(values);
    setCategoryChanged(false);
    bottomSheetModalRefCategory.current?.close();
  };

  // handle deletion
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toast = useToast();

  const handleDeleteTrip = async () => {
    try {
      await dispatch(deleteTrip(tripId));
      await dispatch(deleteTransaction(tripId));
      navigation.goBack();
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
                <Text size="md">Trip Deleted.</Text>
              </HStack>
            </View>
          );
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  // ref for Day BottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "42%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  // ref for Category BottomSheet
  const bottomSheetModalRefCategory = useRef<BottomSheetModal>(null);
  const snapPointsCategory = useMemo(() => ["30%", "50%"], []);
  const handlePresentModalPressCategory = useCallback(() => {
    bottomSheetModalRefCategory.current?.present();
  }, []);
  const handleSheetChangesCategory = useCallback((index: number) => {}, []);

  // renders backdrop
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        onPress={() => {
          // setValues(selectedCategories);
          setCategoryChanged(false);
        }}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <ScreenContainer>
      {/* <HStack alignItems="center" space="sm"> */}
      <HStack justifyContent="space-between" alignItems="center">
        <TouchableOpacity
          onPress={() => {
            setCurrentCategory([]);
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={showModal}>
          <MaterialIcons name="delete-outline" size={24} color="red" />
        </TouchableOpacity>
      </HStack>
      <View style={styles.parentContainer}>
        <HStack style={styles.title}>
          <View>
            <Text size="3xl">{title}</Text>
            <Text size="md">{destination} </Text>
          </View>
          <Avatar bgColor="gray" size="lg" borderRadius="$xl">
            {/* <AvatarFallbackText>Sandeep Srivastava</AvatarFallbackText> */}
            <AntDesign name="hearto" size={16} color="white" />
          </Avatar>
        </HStack>
        <HStack style={styles.filterContainer}>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <HStack style={styles.filterContent}>
              <AntDesign name="calendar" size={16} color="black" />
              <Text size="sm">All Days</Text>
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePresentModalPressCategory}>
            <HStack
              style={
                currentCategory.length !== 0
                  ? styles.filterContentSelected
                  : styles.filterContent
              }
            >
              <AntDesign
                name="appstore-o"
                size={16}
                color={currentCategory.length !== 0 ? "white" : "black"}
              />
              {
                // if selected categories is not empty, render the selected categories

                currentCategory.length !== 0 ? (
                  <Text
                    size="sm"
                    color="white"
                  >{`Category (${currentCategory.length})`}</Text>
                ) : (
                  <Text size="sm" color="black">
                    All Categories{" "}
                  </Text>
                )
              }
            </HStack>
          </TouchableOpacity>
        </HStack>
        <Text size="xl" bold>
          Transactions
        </Text>

        {/* render this if transactions is none */}
        {filteredTransactions.length === 0 ? (
          <View alignItems="center" justifyContent="center">
            <LottieView
              source={require("../assets/lottie/not-found.json")}
              autoPlay
              style={{ width: 250, height: 250 }}
              loop={false}
            />
            <Text size="md" mt="$4">
              No Transactions yet.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionContainer}
          >
            {transactions.map((transaction, index) => {
              return (
                <Transaction
                  key={index}
                  amount={transaction.amount}
                  category={transaction.category}
                  description={transaction.description}
                  date={transaction.date}
                  baseCurrency={baseCurrency}
                />
              );
            })}
          </ScrollView>
        )}
        {
          // render this if transactions is none
          transactions.length !== 0 && (
            <HStack style={styles.totalContainer}>
              <Text> Total:</Text>
              <Text size="4xl" bold mr="$3">
                {baseCurrency} {total}
              </Text>
            </HStack>
          )
        }

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          <View style={styles.contentContainer}>
            <Text size="xl" alignSelf="center">
              Date
            </Text>
            <Divider mt="$4" width="110%" />
            <View
              style={{
                width: "100%",
                alignItems: "start",
                marginVertical: 20,
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{}}
              >
                <HStack alignItems="center">
                  <DayPicker />
                  <DayPicker />
                  <DayPicker />
                  <DayPicker />

                  <DayPicker />
                  <DayPicker />
                  <DayPicker />
                </HStack>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                alignItems: "center",
                borderRadius: 10,
                width: "100%",
                maxWidth: Dimensions.get("window").width - 40,
                paddingVertical: 10,
              }}
            >
              <Text color="white" bold>
                Apply
              </Text>
            </TouchableOpacity>
            <Pressable
              style={{
                alignItems: "center",
                padding: 13,
              }}
              onPress={() => {
                setFilteredTransactions(transactions);
                bottomSheetModalRefCategory.current?.close();
              }}
            >
              <Text color="black" bold>
                Reset
              </Text>
            </Pressable>
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={bottomSheetModalRefCategory}
          index={1}
          snapPoints={snapPointsCategory}
          onChange={handleSheetChangesCategory}
          onDismiss={() => {
            setCategoryChanged(false);
          }}
          backdropComponent={renderBackdrop}
        >
          <View style={styles.contentContainer}>
            <Text size="xl" alignSelf="center">
              Category
            </Text>
            <Divider mt="$4" mb="$2" width="110%" />
            <CheckboxGroup
              // value={values}
              value={categoryChanged ? values : currentCategory}
              onChange={(keys) => {
                setCategoryChanged(true);
                setValues(keys);
              }}
              style={styles.checkParentContainer}
            >
              <VStack space="sm" style={styles.checkContentContainer}>
                <Checkbox
                  aria-label="checkbox"
                  value="Transport"
                  style={styles.checkBoxContainer}
                >
                  <CheckboxIndicator mr="$2" style={styles.checkBox}>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Transportation</CheckboxLabel>
                </Checkbox>
                <Divider width="90%" alignSelf="flex-end" />

                <Checkbox
                  aria-label="checkbox"
                  value="Stay"
                  style={styles.checkBoxContainer}
                >
                  <CheckboxIndicator mr="$2" style={styles.checkBox}>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Accommodation</CheckboxLabel>
                </Checkbox>
                <Divider width="90%" alignSelf="flex-end" />

                <Checkbox
                  aria-label="checkbox"
                  value="Food"
                  style={styles.checkBoxContainer}
                >
                  <CheckboxIndicator mr="$2" style={styles.checkBox}>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Food</CheckboxLabel>
                </Checkbox>
                <Divider width="90%" alignSelf="flex-end" />

                <Checkbox
                  aria-label="checkbox"
                  value="Activities"
                  style={styles.checkBoxContainer}
                >
                  <CheckboxIndicator mr="$2" style={styles.checkBox}>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Activity</CheckboxLabel>
                </Checkbox>
                <Divider mb="$4" width="90%" alignSelf="flex-end" />
              </VStack>
            </CheckboxGroup>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                alignItems: "center",
                borderRadius: 10,
                width: "100%",
                maxWidth: Dimensions.get("window").width - 40,
                paddingVertical: 10,
              }}
              onPress={handleApplyFilterCategory}
            >
              <Text color="white" bold>
                Apply
              </Text>
            </TouchableOpacity>
            <Pressable
              style={{
                alignItems: "center",
                padding: 13,
              }}
              onPress={() => {
                setFilteredTransactions(transactions);
                setValues([]);
                setCurrentCategory([]);
                bottomSheetModalRefCategory.current?.close();
              }}
            >
              <Text color="black" bold>
                Reset
              </Text>
            </Pressable>
          </View>
        </BottomSheetModal>
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
                padding: 30,
              }}
              space="md"
            >
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Delete Trip?
              </Text>
              <Text>
                You will delete the trip and all transactions permanently.
              </Text>
            </VStack>
            <Divider />
            <Pressable p="$3" onPress={handleDeleteTrip}>
              <Text color="red" bold>
                Delete{" "}
              </Text>
            </Pressable>
            <Divider />
            <Pressable p="$3" onPress={hideModal}>
              <Text>Cancel</Text>
            </Pressable>
          </Modal>
        </Portal>
      </View>
    </ScreenContainer>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  // Add your styles here

  parentContainer: {
    width: "100%",
    flex: 1,
    marginTop: 20,
    marginBottom: -30,
  },
  title: {
    gap: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionContainer: {
    gap: 10,
    marginTop: 10,
    paddingBottom: 100,
  },
  filterContainer: {
    gap: 20,
    marginVertical: 15,
    alignItems: "center",
  },
  filterContent: {
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  filterContentSelected: {
    backgroundColor: "black",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  totalContainer: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#FFC200",
    borderWidth: 1,
    width: "100%",
    borderColor: "gray",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: "red",
  },
  checkBox: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "black",
    width: 20,
    height: 20,
  },
  checkBoxContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    padding: 10,
    alignItems: "center",
    gap: 20,
    width: "100%",
    // backgroundColor: "yellow",
  },
  checkParentContainer: {
    width: "100%",
  },
  modalContainer: {
    // padding: 20,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 40,
    backgroundColor: "white",
    // width: 200,
    borderRadius: 10,
    alignSelf: "center",
  },
});
