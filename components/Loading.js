import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default LoadingIndicator = () => {

  // array of animated values
  const animations = useRef([...Array(3)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const startAnimation = () => {
      // Loop through each animation and start it
      const animationSequences = animations.map((animation) =>
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Start all animations in parallel and loop them
      Animated.loop(Animated.parallel(animationSequences)).start();
    };

    startAnimation();
  }, [animations]);

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => {
        const ballStyle = {
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 3],
                outputRange: [1, 0.5], // ball size
              }),
            },
            {
              translateX: animation.interpolate({
                inputRange: [0.5, 1.5],
                outputRange: [0.5, width - 250 - index * 70], // ball movement across the screen
              }),
            },
          ],
        };

        return <Animated.View key={index} style={[styles.ball, ballStyle]} />;
      })}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'row', 
        height: "100%", 
        zIndex: 1000,
      },
      ball: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'orange',
        margin: 5, 
        position: 'absolute', 
      },
  });
