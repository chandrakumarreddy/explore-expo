import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  TransitionSpecs,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useState } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const stack = createNativeStackNavigator();
const tab = createBottomTabNavigator();

const authContext = createContext({
  hasUser: false,
  setUser: () => {},
});

export default function App() {
  const [hasUser, setUser] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <authContext.Provider value={{ hasUser, setUser }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </authContext.Provider>
    </SafeAreaView>
  );
}

const LoginScreen = () => {
  const { setUser } = useContext(authContext);
  return (
    <View style={styles.layout}>
      <TouchableOpacity onPress={() => setUser(true)}>
        <Text style={styles.loginBtn}>Click here to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = () => (
  <tab.Navigator screenOptions={{ headerShown: false }}>
    <tab.Screen name="Feed" component={FeedScreen} />
    <tab.Screen name="Catalog" component={CatalogScreen} />
  </tab.Navigator>
);

const AppNavigator = () => {
  const { hasUser } = useContext(authContext);
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: customTransition.gestureDirection,
        transitionSpec: customTransition.transitionSpec,
        cardStyleInterpolator: customTransition.cardStyleInterpolator,
        headerStyleInterpolator: customTransition.headerStyleInterpolator,
      }}
    >
      {!hasUser ? (
        <stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <stack.Screen name="Tabs" component={TabNavigator} />
      )}
    </stack.Navigator>
  );
};

function FeedScreen() {
  const nav = useNavigation();
  console.log("first");
  return (
    <View style={styles.layout}>
      <Text>Feed screen</Text>
      <Button title="catalog screen" onPress={() => nav.navigate("Catalog")} />
    </View>
  );
}

function CatalogScreen() {
  return (
    <View style={styles.layout}>
      <Text>Catalog screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    fontSize: 16,
    color: "blue",
    fontWeight: 600,
  },
});

const customTransitionConfig = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const customTransition = {
  gestureDirection: "horizontal",
  transitionSpec: {
    open: customTransitionConfig,
    close: customTransitionConfig,
  },
  headerStyleInterpolator: ({ current }) => ({
    leftButtonStyle: {
      opacity: current.progress,
    },
    rightButtonStyle: {
      opacity: current.progress,
    },
  }),
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};
