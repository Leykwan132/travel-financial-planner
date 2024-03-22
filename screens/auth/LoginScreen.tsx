import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  VStack,
  HStack,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { StyleSheet, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { ScreenContainer } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/features/user/userSlice";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

interface LoginScreenProps {
  // Add any props you need for the LoginScreen component
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();

  const webClientId =
    "335998453473-nt90g9s6tiqsf8u2a2lrue4vmihlr59j.apps.googleusercontent.com";

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
    });
  }, []);

  const googleLogin = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const { user, idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);

      dispatch(login(user));

      navigation.reset({ index: 0, routes: [{ name: "Home" }] });

      toast.show({
        placement: "bottom",
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
                  source={require("../../assets/lottie/success.json")}
                  autoPlay
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  loop={false}
                />
                <Text size="md">Login Successfully!</Text>
              </HStack>
            </View>
          );
        },
      });
    } catch (error) {
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
                  source={require("../../assets/lottie/failed.json")}
                  autoPlay
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  loop={false}
                />
                <Text size="md">Login Unsuccessful!</Text>
              </HStack>
            </View>
          );
        },
      });
      console.log("error", error);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <LottieView
          source={require("../../assets/lottie/travel2.json")}
          autoPlay
          style={{
            marginTop: 40,
            width: "200%",
            height: "70%",
          }}
          loop
        />
        <VStack
          space="md"
          width="100%"
          style={{
            position: "absolute",
            bottom: 40,
          }}
        >
          <VStack space="sm" mb="$4">
            <Text bold size="2xl" color="black">
              Welcome to Current.{" "}
            </Text>
            <Text size="sm">
              The only foreign travel companion you ever need.{" "}
            </Text>
          </VStack>
          <Pressable
            onPress={googleLogin}
            style={{
              width: "100%",
            }}
          >
            <HStack
              space="md"
              backgroundColor="white"
              alignItems="center"
              justifyContent="center"
              style={styles.button}
            >
              <AntDesign name="google" size={24} color="black" />
              <Text style={styles.text}>Continue with Google</Text>
            </HStack>
          </Pressable>
        </VStack>
      </View>
    </ScreenContainer>
  );
};

// export default LoginScreen;
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 30,
    flex: 1,
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#FFC200",
  },
  text: {
    color: "black",
  },
});
