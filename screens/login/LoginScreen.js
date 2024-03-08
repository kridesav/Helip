import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebaseConfig";

const dummyCredentials = {
  email: "test123@example.com",
  password: "password123",
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signIn() {
    if (email === "" || password === "") {
      setError("Email and password are mandatory.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await getIdToken(user);
      console.log("User's token: ", token);
    } catch (error) {
      setError(error.message);
      console.log("Error signing in: ", error.message);
    }
  }

  function fillDummyData() {
    setEmail(dummyCredentials.email);
    setPassword(dummyCredentials.password);
    setError("");
  }

  return (
    <ImageBackground source={require("../../assets/helip_bg.png")} resizeMode="cover" style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.signinContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome!
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} autoCapitalize="none" />
          <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />
          <Button mode="contained" onPress={signIn} style={styles.button}>
            Sign in
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={styles.registerText}>Don't have an account? Sign up.</Text>
          </TouchableOpacity>
          <Button mode="text" onPress={fillDummyData} style={styles.button}>
            Fill with Dummy Data
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  signinContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    marginBottom: 10,
    color: "red",
    textAlign: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: 15,
    color: "blue",
  },
});

export default LoginScreen;
