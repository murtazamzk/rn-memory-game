import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';

type propTypes = { 
    cardData: {
        value: number,
    },
    cardIndex: number,
    isFlipped: boolean,
    isSolved: boolean,
    toggleCard: (i: number) => void
}

export default function Card({ cardData, cardIndex, toggleCard, isFlipped, isSolved}: propTypes) {

    const handleClick = () => {
        !isFlipped && !isSolved && toggleCard(cardIndex);
    };

    const flipAnimation = useRef( new Animated.Value(0)).current;

    let flipRotation = 0;
    flipAnimation.addListener(({value}) => flipRotation = value);
    const flipToFrontStyle = {
        transform: [{ 
            rotateY: flipAnimation.interpolate( {
                inputRange: [ 0, 180 ],
                outputRange: [ "0deg", "180deg" ]
            }) 
        }]
    };
    const flipToBackStyle = {
        transform: [{ 
            rotateY: flipAnimation.interpolate( {
                inputRange: [ 0, 180 ],
                outputRange: [ "180deg", "360deg" ]
            }) 
        }]
    };

    const flipToFront = () => {
        Animated.timing( flipAnimation, {
          toValue: 180,
          duration: 300,
          useNativeDriver: true,
        }).start();
    };

    const flipToBack = () => {
        Animated.timing( flipAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if(isFlipped || isSolved) {
            flipToFront();
        }else{
            flipToBack();
        }
    },[isFlipped, isSolved]);

    return (
        <Pressable style={styles.cardWrapper} onPress={handleClick}>
            <Animated.View style={[styles.card, styles.cardFront, flipToBackStyle]}>
                <Text>{cardData.value}</Text>
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, flipToFrontStyle]}>
                <Text>?</Text>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: '30%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    card: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 7,
        borderColor: '#fff',
    },
    cardFront: {
        color: '#333',
        backgroundColor: '#fff',
        position: "absolute",
        top: 0,
        left: 0,
    },
    cardBack: {
        backgroundColor: '#446cb3',
        backfaceVisibility: "hidden"
    }
})