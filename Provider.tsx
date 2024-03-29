import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NativeBaseProvider, Box } from "native-base";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"; // Optional if you want to use default theme
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./redux/store";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import AppNavigation from "./navigations/AppNavigation";
import { useSelector } from "react-redux";
interface Props {
  // Define your component props here
}

const Providers: React.FC<Props> = ({ children }) => {
  // Your component logic here

  return (
    <Provider store={store}>
      {/* <NavigationContainer> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <NativeBaseProvider>
            <BottomSheetModalProvider>
              <GluestackUIProvider config={config}>
                {children}
              </GluestackUIProvider>
            </BottomSheetModalProvider>
          </NativeBaseProvider>
        </PaperProvider>
      </GestureHandlerRootView>
      {/* </NavigationContainer> */}
      <Toast />
    </Provider>
  );
};

export default Providers;
