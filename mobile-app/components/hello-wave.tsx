import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function HelloWave() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(25, { duration: 300, easing: Easing.linear }),
      4,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[{ justifyContent: "center" }, animatedStyle]}>
      <Animated.Text
        style={{
          fontSize: 28,
          lineHeight: 32,
          marginTop: -6,
        }}
      >
        👋
      </Animated.Text>
    </Animated.View>
  );
}
