import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import Card from './src/components/Card';

const CARD_PAIRS_VALUE = 7;

type cardType = {
  value: number
}

export default function App() {

  const [cards, setCards] = useState<cardType[]>([]);
  const [stepCount, setStepCount] = useState(0);
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [solvedCards, setSolvedCards] = useState<number[]>([]);

  const init = () => {
    const shuffle = (arr: cardType[]) => (
      arr.sort(() => Math.random() - 0.5)
    )

    //Generate array of objects based on number of pairs
    let arr = [];
    for(var i=1;i<=CARD_PAIRS_VALUE;i++){
      arr.push({
        value:i 
      });
    }

    //Duplicate the pairs and shuffle
    let duplicated_cards = [...arr, ...arr].map((card, i) => ({ ...card}))
    setCards(shuffle(duplicated_cards));
    setStepCount(0);
    setOpenCards([]);
    setSolvedCards([]);
  }

  useEffect(() => {
    init();
  },[]);

  const checkIsFlipped = (index: number) => {
    return openCards.includes(index);
  };

  const checkIsSolved = (index: number ) => {
    return solvedCards.includes(index);
  };

  const evaluate = () => {
    const [first, second] = openCards;
    if (cards[first].value === cards[second].value) {
      console.log(first,second);
      setSolvedCards((prev) => [ ...prev, first, second ]);
      setOpenCards([]);
      return;
    }
    setOpenCards([]);
  };

  const toggleCard = ( index:number ) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
    }else{
      setOpenCards([index]);
    }
    setStepCount(prev => prev + 1);
  }

  useEffect(() => {
    if (openCards.length === 2) {
      setTimeout(evaluate, 500);
    }
  }, [openCards]);

  useEffect(() => {
    if(solvedCards.length === CARD_PAIRS_VALUE * 2) {
      alert(`You won with ${stepCount} steps`);
      init();
    }
  },[solvedCards]);

  return (
    <View style={styles.container}>
      <StatusBar style={'auto'} />
      <View style={styles.header}>
        <Pressable onPress={init}>
          <Text style={styles.colorBlue}>Restart</Text>
        </Pressable>
        <View>
          <Text style={styles.stepsText}>STEPS: <Text style={styles.colorBlue}>{stepCount}</Text></Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.cardWrapper}>
        {cards.map((card,i) => <Card 
          key={`card-${i}`}
          cardIndex={i}
          toggleCard={toggleCard} 
          isFlipped={checkIsFlipped(i)}
          isSolved={checkIsSolved(i)}
          cardData={card} />)}
        <View style={{width: '30%'}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginTop: 30,
    paddingHorizontal: 10
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  colorBlue: {
    color: '#446cb3'
  },
  stepsText: {
    fontSize: 20,
    color: '#fff'
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }
});
