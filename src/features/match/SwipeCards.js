import { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

function SwipeCards({ data, renderCard, onSwipeRight, onSwipeLeft }) {
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: position.x, dy: position.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const item = data[index];
    direction === 'right' ? onSwipeRight && onSwipeRight(item) : onSwipeLeft && onSwipeLeft(item);
    position.setValue({ x: 0, y: 0 });
    setIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const renderCards = () => {
    if (index >= data.length) {
      return (
        <View style={styles.noMoreCards}><Text>No more profiles</Text></View>
      );
    }
    return data.map((item, i) => {
      if (i < index) return null;
      if (i === index) {
        return (
          <Animated.View
            key={item.id || i}
            style={[styles.card, getCardStyle()]}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <View key={item.id || i} style={[styles.card, { top: 10 * (i - index), zIndex: -i }]}> 
          {renderCard(item)}
        </View>
      );
    }).reverse();
  };

  const getCardStyle = () => {
    return {
      ...position.getLayout(),
      zIndex: 99,
    };
  };

  return <View style={styles.container}>{renderCards()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    minHeight: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
});

export default SwipeCards;
