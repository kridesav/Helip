import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore} from "../../config/firebaseConfig";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


const RegisterScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  async function signUp() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    setValue({ ...value, error: "" });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, value.email, value.password);
      console.log("User registered: ", userCredential.user);

      const userData = {
        email: value.email,
        displayName: value.displayName || '',  //Displayname
        firstName: '',
        lastName: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        email: '',
        profilePictureUrl: '',
        eventsCreated: [],
        eventsParticipating: [],

      };

      // Create a document in 'users' collection with the auth user's UID as the document ID
      await setDoc(doc(firestore, "users", userCredential.user.uid), userData);
      console.log('User document created in Firestore.');
      console.log("User registered: ", userCredential.user);
    } catch (error) {
      console.error("Error in signUp:", error);
      setValue({ ...value, error: error.message });
    }
  }

  return (
    <View style={styles.container}>
      <Text>Signup screen!</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={16} />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={16} />}
        />

        <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} />
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
});

export default RegisterScreen;
