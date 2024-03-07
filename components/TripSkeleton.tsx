import React from "react";
import {
  Skeleton,
  VStack,
  View,
  HStack,
  Center,
  NativeBaseProvider,
} from "native-base";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

interface TripSkeletonProps {
  // Define your component props here
}

export const TripSkeleton: React.FC<TripSkeletonProps> = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={50} height={50} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={80} height={15} />
            <SkeletonPlaceholder.Item marginTop={10} width={120} height={15} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={60}
          height={30}
          borderRadius={10}
          marginRight={10}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default TripSkeleton;
