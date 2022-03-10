import { StyleSheet } from "react-native";
import { height } from "./dimension";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  getStartModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: height * 0.3,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: "center",
  },
});
