import React, { useState } from "react";
import { Button, TextInput, Surface, Avatar, HelperText } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import useAuth from "../../hooks/useAuth";
import editUser from "../../hooks/events/utils/editUser";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";


export default function EditProfileScreen({ route }) {
  const { profile: initialProfile } = route.params;
  const [profile, setProfile] = useState(initialProfile);
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [description, setDescription] = useState(profile?.description ?? "");
  const [avatar, setAvatar] = useState(profile?.profilePictureUrl ?? "");
  const [visible, setVisible] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const user = useAuth();

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const handleFirstNameChange = (text) => {
    setFirstName(text);
    if (text.length < 2 || text.length > 16) {
      setFirstNameError("First Name must be between 2 and 16 characters");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
    if (text.length < 2 || text.length > 16) {
      setLastNameError("Last Name must be between 2 and 16 characters");
    } else {
      setLastNameError("");
    }
  };

  const handleDisplayNameChange = (text) => {
    setDisplayName(text);
    if (text.length < 2 || text.length > 16) {
      setDisplayNameError("Display Name must be between 2 and 16 characters");
    } else {
      setDisplayNameError("");
    }
  };

  const handleSave = async () => {
    const userData = {
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      profilePictureUrl: avatar,
      description: description
    };

    try {
      const result = await editUser()(userData, user.currentUser.uid);
      if (result) {
        console.log("Profile updated");
        setProfile(userData);
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
    setVisible(false);
  };

  const handleAvatar = () => setVisible(!visible);

  return (

    <Surface style={styles.background}>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>

        <View style={styles.content}>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.flexGrow}>
            <Avatar.Image
              style={{ alignSelf: "center", marginTop: 15, marginBottom: 15 }}
              size={84}
              source={{ uri: `https://api.multiavatar.com/${profile?.profilePictureUrl ? profile.profilePictureUrl : profile?.displayName}.png` }}
            />
            <Surface elevation={2} style={styles.bottomlist}>

              <TextInput style={styles.input} label="First Name" value={firstName} onChangeText={handleFirstNameChange} />
              <HelperText type="error" visible={!!firstNameError}>
                {firstNameError}
              </HelperText>
              <TextInput style={styles.input} label="Last Name" value={lastName} onChangeText={handleLastNameChange} />
              <HelperText type="error" visible={!!lastNameError}>
                {lastNameError}
              </HelperText>
              <TextInput style={styles.input} label="Display Name" value={displayName} onChangeText={handleDisplayNameChange} />
              <HelperText type="error" visible={!!displayNameError}>
                {displayNameError}
              </HelperText>
              
              {visible && <TextInput style={styles.input} label="Generate avatar with nickname" value={avatar} onChangeText={setAvatar} />}
              <HelperText>
              </HelperText>
              <TextInput style={styles.input} mode="outlined"
                editable
                multiline
                numberOfLines={2}
                maxLength={400} label="Tell something about yourself" value={description} onChangeText={handleDescriptionChange} />
            </Surface>
            <View style={styles.buttons}>
              <Button style={styles.button} icon="camera-image" mode="outlined" compact onPress={handleAvatar}>
                Change Avatar
              </Button>
              <Button
                style={styles.button}
                icon="content-save"
                mode="outlined"
                compact
                onPress={handleSave}
                disabled={!!firstNameError || !!lastNameError || !!displayNameError}
              >
                Save
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView >
    </Surface >

  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: "center",
  },
  buttons: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",

  },
  bottomlist: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    paddingBottom: 15


  },
  input: {
    backgroundColor: "transparent",
  },

  flex: {
    flex: 1,

  },
  flexGrow: {
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom: 100,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});
