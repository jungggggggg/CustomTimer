/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { TimeContext } from '../components/GlobalTimeContext';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootScreen() {
  const { chooseSecondTime, setchooseMinuteTime, setchooseSecondTime } =
    useContext(TimeContext);

  const startCounting = () => {
    router.replace('/counting');
  };

  const wheelRef = React.useRef<WheelPickerExpo>(null);

  const numbers = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString(),
    value: i,
  }));

  const rotation = useRef(new Animated.Value(0)).current;
  const scales = Array.from(
    { length: 5 },
    () => useRef(new Animated.Value(1)).current,
  );
  const translateYs = Array.from(
    { length: 5 },
    () => useRef(new Animated.Value(0)).current,
  );
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const [boxesVisible, setBoxesVisible] = useState(false);

  const rotateAndAnimateBoxes = () => {
    setBoxesVisible(true); // 박스를 보이도록 설정

    Animated.sequence([
      // 아래의 컴포넌트가 부드럽게 밀려나도록 애니메이션
      Animated.timing(contentTranslateY, {
        toValue: 120, // 아래로 120px 이동, 좀 더 밀려나도록 조정
        duration: 300,
        useNativeDriver: true,
      }),
      // 회전과 박스 애니메이션을 동시에 실행
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.stagger(
          100,
          scales.map((scale) =>
            Animated.spring(scale, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            }),
          ),
        ),
      ]),
    ]).start(() => {
      rotation.setValue(0); // 아이콘 회전 값 초기화
    });
  };

  const handleBoxPress = (index) => {
    Animated.parallel([
      // 선택한 박스 위로 점프
      Animated.sequence([
        Animated.spring(translateYs[index], {
          toValue: -20, // 살짝 위로 이동
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(translateYs[index], {
          toValue: 0, // 다시 제자리로
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      // 모든 박스 축소 및 제거 애니메이션
      Animated.stagger(
        100,
        scales
          .map((scale) =>
            Animated.timing(scale, {
              toValue: 0,
              duration: 200, // 축소 시간을 200ms로 설정하여 빠르게 사라지게 함
              useNativeDriver: true,
            }),
          )
          .reverse(), // 역순으로 애니메이션
      ),
    ]).start(() => {
      setBoxesVisible(false);

      // 공백 유지 후 아래의 컴포넌트를 부드럽게 원래 위치로 이동
      setTimeout(() => {
        Animated.timing(contentTranslateY, {
          toValue: 0, // 원래 위치로 이동
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1000); // 공백 유지 시간 (1초)
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'], // 0도에서 720도까지 회전
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const contentStyle = {
    transform: [{ translateY: contentTranslateY }],
  };

  const colors = ['#ff6e6e', '#ffcf6e', '#ccff6e', '#6effcf', '#6ea7ff'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={rotateAndAnimateBoxes}>
            <Animated.View style={animatedStyle}>
              <FontAwesome name="eyedropper" size={24} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {boxesVisible && (
          <View style={styles.boxContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleBoxPress(index)}
              >
                <Animated.View
                  style={[
                    styles.box,
                    {
                      backgroundColor: color,
                      transform: [
                        { scale: scales[index] },
                        { translateY: translateYs[index] },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.wheelContainer}>
            <WheelPickerExpo
              ref={wheelRef}
              height={400}
              width={100}
              initialSelectedIndex={0}
              items={numbers}
              renderItem={({ label }) =>
                label ? (
                  <Text style={styles.timeFont}>
                    {label.toString().padStart(2, '0')}
                  </Text>
                ) : null
              }
              onChange={({ item }) => {
                if (item) {
                  setchooseMinuteTime(item.value);
                }
              }}
            />
            <Text style={[styles.timeFont, { paddingTop: 165 }]}>:</Text>
            <WheelPickerExpo
              height={400}
              width={100}
              initialSelectedIndex={chooseSecondTime}
              items={numbers}
              renderItem={({ label }) =>
                label ? (
                  <Text style={styles.timeFont}>
                    {label.toString().padStart(2, '0')}
                  </Text>
                ) : null
              }
              onChange={({ item }) => {
                if (item) {
                  setchooseSecondTime(item.value);
                }
              }}
            />
          </View>

          <TouchableOpacity style={styles.buttonStyle} onPress={startCounting}>
            <Text style={styles.buttonFont}>start</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    top: 10, // 원래 위치의 y 좌표 (조정 가능)
    left: 20, // 원래 위치의 x 좌표 (조정 가능)
  },
  boxContainer: {
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center', // 박스들이 중앙에 배치되도록
  },
  box: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
  },
  wheelContainer: {
    flexDirection: 'row',
    marginTop: 100,
  },
  timeFont: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 100,
    marginTop: 50,
  },
  buttonFont: {
    fontSize: 30,
    color: 'white',
  },
});
