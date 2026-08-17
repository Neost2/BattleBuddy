import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function WellnessCard({title, value, subtitle, onPress}: any) {
  return (
    <Pressable onPress={onPress} style={{
      padding:18,
      borderRadius:18,
      borderWidth:1,
      marginBottom:12
    }}>
      <Text style={{fontWeight:'700',fontSize:18}}>{title}</Text>
      {value && <Text style={{fontSize:28,fontWeight:'800',marginTop:8}}>{value}</Text>}
      {subtitle && <Text style={{marginTop:6}}>{subtitle}</Text>}
    </Pressable>
  );
}
