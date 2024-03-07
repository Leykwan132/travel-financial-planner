import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { HStack, View, Text } from "@gluestack-ui/themed";
import { toRad } from "react-native-redash";
import { AntDesign } from "@expo/vector-icons";
const AnimatedRectButton = Animated.createAnimatedComponent(RectButton);

// inherent the `BottomSheetFooterProps` to be able receive
// `animatedFooterPosition`.
interface CustomFooterProps extends BottomSheetFooterProps {}

const CustomFooter = ({ animatedFooterPosition }: CustomFooterProps) => {
  //#region hooks
  // we need the bottom safe insets to avoid bottom notches.
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  // extract animated index and other functionalities
  const { expand, collapse, animatedIndex, close } = useBottomSheet();
  //#endregion

  //#region styles
  // create the arrow animated style reacting to the
  // sheet index.
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const arrowRotate = interpolate(
      animatedIndex.value,
      [0, 1],
      [toRad(0), toRad(-180)],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotate: `${arrowRotate}rad` }],
    };
  }, []);
  const arrowStyle = useMemo(
    () => [arrowAnimatedStyle, styles.arrow],
    [arrowAnimatedStyle]
  );
  // create the content animated style reacting to the
  // sheet index.
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-0.85, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    }),
    [animatedIndex]
  );
  const containerStyle = useMemo(
    () => [containerAnimatedStyle, styles.container],
    [containerAnimatedStyle]
  );
  //#endregion

  //#region callbacks
  const handleArrowPress = useCallback(() => {
    // if sheet is collapsed, then we extend it,
    // or the opposite.
    close();
  }, []);
  //#endregion

  return (
    <BottomSheetFooter
      // we pass the bottom safe inset
      bottomInset={0}
      // we pass the provided `animatedFooterPosition`
      animatedFooterPosition={animatedFooterPosition}
    >
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        style={styles.parentContainer}
      >
        <HStack style={styles.totalContainer}>
          <Text>Total:</Text>
          <Text size="4xl" bold>
            $100
          </Text>
        </HStack>
      </HStack>
    </BottomSheetFooter>
  );
};

// footer style
const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: -10,
    paddingVertical: 24,
  },
  totalContainer: {
    gap: 20,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 34,
    top: -10,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 30,
  },
});

export default CustomFooter;
