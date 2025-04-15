import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
