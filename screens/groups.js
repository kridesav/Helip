import React from 'react';
import { View, TextInput, FlatList, Image, Text, StyleSheet } from 'react-native';

// Mock data - replace with real data source
const users = [
  {
    id: '1',
    name: 'Football',
    handle: '@football',
    profilePicture: require('../image/football.jpg')
  },
  {
    id: '2',
    name: 'Basketball',
    handle: '@basketball',
    profilePicture: require('../image/basketball.jpg')
  },
  {
    id: '3',
    name: 'Hockey',
    handle: '@hockey',
    profilePicture: require('../image/hockey.jpg')
  },
  {
    id: '4',
    name: 'Tyler Durden',
    handle: '@edwardnorton',
    profilePicture: require('../image/marla.jpg')
  },
  {
    id: '5',
    name: 'SpongeBob',
    handle: '@bobsponge',
    profilePicture: require('../image/spongebob.jpg')
  },
  {
    id: '6',
    name: 'Nelson Mandela',
    handle: '@edwardnorton',
    profilePicture: require('../image/nelsonmandela.jpg')
  },
];

export default function GroupsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for ..."
      // Add onChangeText handler if needed
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id} // Replace 'item.id' with your actual unique id field
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image source={item.profilePicture} style={styles.profilePic} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userHandle}>{item.handle}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userHandle: {
    fontSize: 14,
    color: 'grey',
  },

});
