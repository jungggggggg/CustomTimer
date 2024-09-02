import React, { useContext } from 'react';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimeContext } from '../components/GlobalTimeContext';
import { router } from 'expo-router';

export default function RootScreen() {
  const {
    chooseMinuteTime,
    chooseSecondTime,
    setchooseMinuteTime,
    setchooseSecondTime,
    startTimer,
    setStartTimer,
  } = useContext(TimeContext);

  const stop = () => {
    router.replace('./');
  };

  useEffect(() => {
    if (startTimer) {
      const timer = setInterval(() => {
        setchooseSecondTime((prevSeconds) => {
          if (prevSeconds === 0) {
            if (chooseMinuteTime === 0) {
              clearInterval(timer);
              Alert.alert('ringing', 'Time is over!', [
                {
                  text: 'Got It',
                  onPress: () => router.replace('./'),
                },
              ]);
              return 0;
            } else {
              setchooseMinuteTime((prevMinutes) => prevMinutes - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    chooseMinuteTime,
    setStartTimer,
    setchooseMinuteTime,
    setchooseSecondTime,
    startTimer,
  ]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.timeFont}>
        {`${chooseMinuteTime.toString().padStart(2, '0')} : ${chooseSecondTime.toString().padStart(2, '0')}`}
      </Text>

      <TouchableOpacity style={styles.buttonStyle} onPress={stop}>
        <Text style={styles.buttonFont}>pause</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wheelContainer: {
    flexDirection: 'row',
  },
  timeFont: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 20,
    paddingHorizontal: 100,
    margin: 10,
    marginTop: 50,
  },
  buttonFont: {
    fontSize: 30,
    color: 'white',
  },
});
