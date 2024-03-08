import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../config/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  async function signUp() {
    if (email === "" || password === "" || displayName === "" || firstName === "" || lastName === "") {
      setError("All fields are mandatory.");
      return;
    }

    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        email,
        displayName,
        firstName,
        lastName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profilePictureUrl: "",
        eventsCreated: [],
        eventsParticipating: [],
      };

      await setDoc(doc(firestore, "users", userCredential.user.uid), userData);
      console.log("User document created in Firestore.");
      console.log("User registered: ", userCredential.user);
    } catch (error) {
      console.error("Error in signUp:", error);
      setError(error.message);
    }
  }

  return (
    <ImageBackground source={require("../../assets/helip_bg.png")} resizeMode="cover" style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.innerContainer}>
          <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
            <Button icon="arrow-left">Back</Button>
          </TouchableOpacity>
          <Text variant="headlineLarge" style={styles.title}>
            Sign Up!
          </Text>
          <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
          <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />
          <TextInput label="Display Name" value={displayName} onChangeText={setDisplayName} mode="outlined" style={styles.input} />
          <TextInput label="First Name" value={firstName} onChangeText={setFirstName} mode="outlined" style={styles.input} />
          <TextInput label="Last Name" value={lastName} onChangeText={setLastName} mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={signUp} style={styles.button}>
            Sign up
          </Button>
          {error ? <Text style={styles.error}>{error}</Text> : null}
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
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
  },
  innerContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegisterScreen;
