import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Switch, View } from "react-native";
import { Text, useThemeColor } from "../Themed";

interface SettingsCardProps {
  label: string;
  value?: number | string;
  icon?: string;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  index?: number;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  label,
  value,
  icon,
  showSwitch,
  switchValue,
  onSwitchChange,
  index = 0,
}) => {
  const cardBg = useThemeColor({}, "card");
  const color = useThemeColor({}, "text");

  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, slideAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={styles.rightContainer}>
        {value !== undefined && (
          <Text style={[styles.value, { color }]}>{value}</Text>
        )}
        {icon && <Text style={styles.icon}>{icon}</Text>}
        {showSwitch && (
          <Switch
            testID="switch"
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: "#ccc", true: "#4cd137" }}
            thumbColor={switchValue ? "#fff" : "#fff"}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default SettingsCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    fontSize: 24,
  },
});
