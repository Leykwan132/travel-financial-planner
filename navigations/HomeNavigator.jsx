import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  HomeScreen,
  ProfileScreen,
  TripScreen,
  DetailScreen,
  TransactionScreen,
} from "../screens";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { View, Button } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const TripStack = createNativeStackNavigator();

function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

function TripStackScreen() {
  return (
    <TripStack.Navigator screenOptions={{ headerShown: false }}>
      <TripStack.Screen name="Trip" component={TripScreen} />
      <TripStack.Screen name="Details" component={DetailScreen} />
      <TripStack.Screen name="Transaction" component={TransactionScreen} />
    </TripStack.Navigator>
  );
}
export const HomeNavigator = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripStackScreen}
        options={{
          tabBarLabel: "Trips",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="led-strip-variant"
              color={color}
              size={size}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            // navigation.navigate("Details");
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
