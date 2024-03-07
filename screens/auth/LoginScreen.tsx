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

interface LoginScreenProps {
  // Add any props you need for the LoginScreen component
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();

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
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast
              nativeID={toastId}
              action="error"
              variant="accent"
              style={{
                borderRadius: 10,
                backgroundColor: "white",
              }}
            >
              <HStack alignItems="center" justifyContent="center" space="md">
                <Feather name="user-x" size={28} color="black" />
                <VStack space="xs">
                  <ToastTitle>Logged in failed!</ToastTitle>
                  <ToastDescription>Please try again!</ToastDescription>
                </VStack>
              </HStack>
            </Toast>
          );
        },
      });
      console.log("error", error);
    }
  };
  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <Text>Login to See more!</Text>
        <Pressable onPress={googleLogin}>
          <HStack space="md" backgroundColor="white" style={styles.button}>
            <AntDesign name="google" size={24} color="black" />
            <Text style={styles.text}>Login with Google</Text>
          </HStack>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

// export default LoginScreen;
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  text: {
    color: "black",
  },
});
