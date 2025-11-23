import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WelcomeScreenProps {
  onFinish: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [step, fadeAnim]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      fadeAnim.setValue(0);
    } else {
      onFinish();
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-violet-600">
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="items-center px-8 w-full"
      >
        {step === 1 ? (
          <>
            <View className="justify-center items-center mb-8 w-32 h-32 bg-white rounded-3xl shadow-lg">
              <Text className="text-6xl">📂</Text>
            </View>
            <Text className="mb-4 text-3xl font-bold text-center text-white">
              Gestionnaire de Fichiers
            </Text>
            <Text className="mb-12 text-lg text-center text-violet-100">
              Centralisez tous vos documents en un seul endroit sécurisé.
            </Text>
          </>
        ) : (
          <>
            <View className="justify-center items-center mb-8 w-32 h-32 bg-violet-500 rounded-full border-4 border-white shadow-lg">
              <Text className="text-6xl">🚀</Text>
            </View>
            <Text className="mb-4 text-3xl font-bold text-center text-white">
              Synchronisation Live
            </Text>
            <Text className="mb-12 text-lg text-center text-violet-100">
              Vos fichiers sont mis à jour en temps réel avec tous vos
              appareils.
            </Text>
          </>
        )}

        {/* Indicateurs d'étape */}
        <View className="flex-row mb-12 space-x-2">
          <View
            className={`h-2 w-2 rounded-full ${step === 1 ? "bg-white w-8" : "bg-violet-400"}`}
          />
          <View
            className={`h-2 w-2 rounded-full ${step === 2 ? "bg-white w-8" : "bg-violet-400"}`}
          />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="px-10 py-4 w-full bg-white rounded-full shadow-lg"
        >
          <Text className="text-lg font-bold text-center text-violet-600">
            {step === 1 ? "Suivant" : "Commencer"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};
