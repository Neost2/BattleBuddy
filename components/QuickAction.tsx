import React from 'react';
import { Pressable, Text } from 'react-native';

export default function QuickAction({title,subtitle,onPress}: any){
 return (
  <Pressable onPress={onPress} style={{
    padding:16,
    borderRadius:16,
    borderWidth:1,
    marginBottom:10
  }}>
    <Text style={{fontWeight:'800'}}>{title}</Text>
    <Text>{subtitle}</Text>
  </Pressable>
 );
}
