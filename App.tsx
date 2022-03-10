import { StatusBar, StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <Login />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
