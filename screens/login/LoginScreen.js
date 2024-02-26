import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebaseConfig";

const dummyCredentials = {
  email: "test123@example.com",
  password: "password123",
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });

      console.log("Error signing in: ", error.message);
    }
  }

  function fillDummyData() {
    setValue({
      ...value,
      email: dummyCredentials.email,
      password: dummyCredentials.password,
      error: "",
    });
  }

  return (
    <View style={styles.container}>
      <Text>Signin screen!</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          inputStyle={styles.inputStyle}
          leftIconContainerStyle={styles.leftIconContainerStyle}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={20} />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          inputStyle={styles.inputStyle}
          leftIconContainerStyle={styles.leftIconContainerStyle}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={20} />}
        />

        <Button title="Sign in" buttonStyle={styles.control} onPress={signIn} />
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.registerText}>Don't have an account? Sign up.</Text>
        </TouchableOpacity>
        <Button title="Fill with Dummy Data" buttonStyle={styles.control} onPress={fillDummyData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    width: "80%",
  },
  control: {
    marginTop: 20,
    height: 50,
  },
  inputStyle: {
    fontSize: 18,
    paddingLeft: 10,
  },
  leftIconContainerStyle: {
    paddingLeft: 15,
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
  registerText: {
    textAlign: "center",
    color: "blue",
    marginTop: 15,
  },
});

export default LoginScreen;
