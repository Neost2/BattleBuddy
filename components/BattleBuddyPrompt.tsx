import React from 'react';
import { Pressable, Text } from 'react-native';

export default function BattleBuddyPrompt({onPress}: any){
 return (
  <Pressable onPress={onPress} style={{
    padding:18,
    borderRadius:18,
    borderWidth:1
  }}>
    <Text style={{fontWeight:'800',fontSize:18}}>
      Talk to BattleBuddy
    </Text>
    <Text>
      I'm here to listen and help you work through your day.
    </Text>
  </Pressable>
 );
}
