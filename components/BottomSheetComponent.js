import React from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Pressable, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import SearchBarComponent from "./SearchBarComponent";
import LocationTypeWheel from "./LocationTypeWheel";
import { useNavigation } from "@react-navigation/native";
import { useFetchEventsByLocationId } from "../hooks/events/useFetchEventsByLocationId";
import { useTheme } from "react-native-paper";
import theme from "../theme";
import { getSportIcon } from "./getIcons";

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
  const [settingMode, setSettingsMode] = useState(false);
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

  const dynamicStyles = {
    fullButton: {
      backgroundColor: colors.danger,
    },
    fullButtonText: {
      color: colors.tertiary,
    },
  };

  useEffect(() => {
    if (!settingMode) {
      setActiveFilter(null);
    }
  }, [settingMode]);

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
      index={1}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="restore"
    >
      <Button onPress={() => handleMapItemDeselect()} icon="close" style={styles.backButton} title="Back">
      </Button>
      <View style={styles.contentContainer}>
        {selectedMapItem ? (
          <View style={styles.dataContainer}>
            <Text style={styles.title}>{selectedMapItem.properties.nimi_fi}</Text>
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
            <BottomSheetScrollView>
              <View style={styles.dataContainer}>
              <Text style={styles.title}>Events:</Text>
                {events.length > 0 ? (
                  events.map((event) => (
                    <View key={event.id}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("EventScreen", { event, isFull: event.participants >= event.participantLimit })}
                        style={[styles.eventButton, event.isFull ? dynamicStyles.fullButton : {}]}
                      >
                        <View style={styles.eventContainer}>
                          <Text style={styles.eventName}>
                            {event.title}
                          </Text>
                          <Text style={styles.buttonText}>
                            {event.date}
                          </Text>
                          {event.isFull ? 
                          <Text style={styles.fullText}>Event Full</Text>:
                          <Text>participants:{event.participants}/{event.participantLimit}</Text>}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text>No events for this location.</Text>
                )}
              </View>
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
  },
  control: {
    marginTop: 20,
  },
  button: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
  },
  eventButton: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    top: 4,
    right: 25,
    margin: 0,
    padding: 0
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
    paddingRight: 50
  },
  locationSelectedText:{
    padding: 2
  },
  eventContainer: {

  },
  eventName: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
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
