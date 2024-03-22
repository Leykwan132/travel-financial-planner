import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens we previously created
import { HomeNavigator } from "./HomeNavigator";
import { LoginScreen } from "../screens/auth/LoginScreen";
// import OnBoarding from '@screens/OnBoarding'
import { useSelector } from "react-redux";

const AppNavigation = () => {
  // Attention, this is a Stack
  const Stack = createNativeStackNavigator();
  const { user } = useSelector((state) => state.user);

  // Please refer to the Graph2, where all modules are connected
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={!user ? "Login" : "Home"}
        screenOptions={{ headerShown: false }}
      >
        {/* <Stack.Screen name="OnBoarding" component={OnBoarding} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
