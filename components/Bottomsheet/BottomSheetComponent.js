import React from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Pressable, TouchableOpacity, Image, Linking } from "react-native";
import { Text, Avatar, Button, Surface } from "react-native-paper";
import SearchBarComponent from "./SearchBarComponent";
import LocationTypeWheel from "./LocationTypeWheel";
import { useNavigation } from "@react-navigation/native";
import { useFetchEventsByLocationId } from "../../hooks/events/useFetchEventsByLocationId";
import { useTheme } from "react-native-paper";
import { getSportIcon } from "../getIcons";

const BottomSheetComponent = ({
  handleListItemPress,
  places,
  filteredLocations,
  setFilteredLocations,
  bottomSheetRef,
  selectedMapItem,
  handleMapItemDeselect,
  activeFilter,
  setActiveFilter,
}) => {
  const snapPoints = useMemo(() => ["3.5%", "15%", "40%", "80%"], []);
  const [pageNumber, setPageNumber] = useState(0);
  const { colors } = useTheme();
  const navigation = useNavigation();


  //Hakee locationId:n mukaan eventit
  const [locationId, setLocationId] = useState(null);
  useEffect(() => {
    if (selectedMapItem && selectedMapItem.properties) {
      setLocationId(selectedMapItem.properties.id);
    } else {
      setLocationId(null);
    }
  }, [selectedMapItem]);

  const { events } = useFetchEventsByLocationId(locationId);

  const NativeButton = (props) => {
    return (
      <Pressable style={styles.button} onPress={props.onPress}>
        <Image source={props.icon} style={styles.icon} />
        <Text style={styles.listText}>{props.title}</Text>
      </Pressable>
    );
  };

  const filteredAndSlicedLocations = activeFilter
    ? filteredLocations
        .filter((item) => getSportIcon(item.properties.tyyppi_nim) === activeFilter.uri)
        .slice(pageNumber * 100, pageNumber * 100 + 100)
    : filteredLocations.slice(pageNumber * 100, pageNumber * 100 + 100);

  return (
    <BottomSheet
      /* handleComponent={Handle} */
      index={1}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="restore"
      backgroundComponent={() => (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.surface,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
        />
      )}
    >
      <View style={styles.contentContainer}>
        {selectedMapItem ? (
<<<<<<< HEAD
          <Surface style={styles.dataContainer}>
            <Surface elevation={0} style={styles.titleBackContainer}>
              <Text style={styles.title}>{selectedMapItem.properties.nimi_fi}</Text>
              <Button onPress={() => handleMapItemDeselect()} icon="close" style={styles.backButton} title="Back">
            </Button>
            </Surface>
            <TouchableOpacity onPress={() => Linking.openURL(selectedMapItem.properties.www)}>
              <Text style={{color: 'blue'}}>{selectedMapItem.properties.www}</Text>
            </TouchableOpacity>
            <Text>{selectedMapItem.properties.katuosoite}</Text>
            <Surface elevation={0} style={styles.buttonContainer}>
              <Button
                icon="plus-circle"
                mode="elevated"
                style={styles.control}
                title="Add Event"
                onPress={() => navigation.navigate("AddEventScreen", { selectedMapItem })}
              >
                Add Event
              </Button>
            </Surface>
=======
          <View style={styles.dataContainer}>
            <View style={styles.topContainer}>
              <View elevation={0} style={styles.titleBackContainer}>
                <Text style={styles.title}>{selectedMapItem.properties.nimi_fi}</Text>
                <Button onPress={() => handleMapItemDeselect()} icon="close" style={styles.backButton} title="Back">
                </Button>
              </View>
              <Text>{selectedMapItem.properties.www}</Text>
              <Text>{selectedMapItem.properties.katuosoite}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  icon="plus-circle"
                  mode="elevated"
                  style={styles.control}
                  title="Add Event"
                  onPress={() => navigation.navigate("AddEventScreen", { selectedMapItem })}
                >
                  Add Event
                </Button>
              </View>
            </View>
>>>>>>> feature/myevents
            <BottomSheetScrollView>
              <Surface elevation={0} style={styles.dataContainer}>
              <Text style={styles.title}>Events:</Text>
                {events.length > 0 ? (
                  events.map((event) => (
                    <Surface elevation={3} key={event.id} style={styles.eventContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("EventScreen", { event, isFull: event.participants >= event.participantLimit })}
                        style={styles.eventButton}
                      >
                        <View>
                          <Text style={styles.eventName}>
                            {event.title}
                          </Text>
                          <Text style={styles.buttonText}>
                            {event.date}
                          </Text>
                          <Text>participants:{event.participants}/{event.participantLimit}</Text>
                        </View>
                      </TouchableOpacity>
                    </Surface>
                  ))
                ) : (
                  <Text>No events for this location.</Text>
                )}
              </Surface>
            </BottomSheetScrollView>
          </View>
        ) : (
          <>
            <View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <SearchBarComponent snapBottomSheet={handleMapItemDeselect} setFilteredLocations={setFilteredLocations} places={places} />
              </View>
              <LocationTypeWheel onActiveIconChange={setActiveFilter} />
              <BottomSheetScrollView>
                {filteredAndSlicedLocations.map((item) => {
                  const icon = getSportIcon(item.properties.tyyppi_nim);
                  return (
                    <View key={item.properties.id}>
                      <NativeButton
                        onPress={() => handleListItemPress(item)}
                        icon={icon}
                        title={`${item.properties.nimi_fi} - ${item.distance.toFixed(2)} km`}
                      />
                    </View>
                  );
                }) || []}
              </BottomSheetScrollView>
            </View>
          </>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
  },
  dataContainer: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: '100%'
  },
  control: {
    marginTop: 20,
  },
  topContainer: {
    width: '80%'
  },
  titleBackContainer:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignContent: 'space-between'
  },
  button: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: "row",
  },
  eventButton: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
  },
  backButton: {
    width:'1%',
  },
  listText: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    flexShrink: 1,
  },
  title: {
    fontWeight: "bold",
    width: '90%'
  },
  locationSelectedText:{
    padding: 2
  },
  eventContainer: {
    marginVertical: 5,
    borderRadius: 10,
    padding:5
  },
  eventName: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    marginBottom: 4
  },
  fullText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  icon: {
    width: 27,
    height: 27,
    marginRight: 10,
  },
});

export default BottomSheetComponent;
