import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../../context/ThemeProvider'

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEK=['S','M','T','W','T','F','S']
const TIMES=['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

function toKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}

export default function CalendarTimePicker({date,onDateChange,time,onTimeChange}:{date:string;onDateChange:(v:string)=>void;time:string;onTimeChange:(v:string)=>void}){
 const {colors,spacing,radius,typography}=useTheme()
 const selected=date?new Date(`${date}T12:00:00`):new Date()
 const [viewYear,setViewYear]=useState(selected.getFullYear())
 const [viewMonth,setViewMonth]=useState(selected.getMonth())
 const [customHour,setCustomHour]=useState(10)
 const [customMinute,setCustomMinute]=useState(0)
 const [ampm,setAmpm]=useState<'AM'|'PM'>('AM')

 const days=useMemo(()=>{
  const first=new Date(viewYear,viewMonth,1).getDay()
  const count=new Date(viewYear,viewMonth+1,0).getDate()
  const cells:Array<number|null>=Array(first).fill(null)
  for(let i=1;i<=count;i++) cells.push(i)
  while(cells.length%7) cells.push(null)
  return cells
 },[viewYear,viewMonth])

 const move=(delta:number)=>{
  const d=new Date(viewYear,viewMonth+delta,1)
  setViewYear(d.getFullYear());setViewMonth(d.getMonth())
 }
 const applyCustom=()=>onTimeChange(`${customHour}:${String(customMinute).padStart(2,'0')} ${ampm}`)

 return <View>
  <Text style={[typography.label,{marginBottom:spacing.sm}]}>DATE</Text>
  <View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.md,marginBottom:spacing.lg}}>
   <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:spacing.md}}>
    <Pressable onPress={()=>move(-1)} style={{padding:8}}><Text style={{color:colors.primary,fontSize:22}}>‹</Text></Pressable>
    <Text style={{color:colors.text,fontWeight:'800',fontSize:18}}>{MONTHS[viewMonth]} {viewYear}</Text>
    <Pressable onPress={()=>move(1)} style={{padding:8}}><Text style={{color:colors.primary,fontSize:22}}>›</Text></Pressable>
   </View>
   <View style={{flexDirection:'row'}}>{WEEK.map((w,i)=><Text key={`${w}${i}`} style={{width:'14.285%',textAlign:'center',color:colors.textMuted,fontWeight:'700',paddingBottom:8}}>{w}</Text>)}</View>
   <View style={{flexDirection:'row',flexWrap:'wrap'}}>{days.map((day,i)=>{
    if(!day) return <View key={i} style={{width:'14.285%',aspectRatio:1}}/>
    const d=new Date(viewYear,viewMonth,day)
    const key=toKey(d)
    const picked=key===date
    const past=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()<new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()
    return <Pressable disabled={past} key={i} onPress={()=>onDateChange(key)} style={{width:'14.285%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderRadius:radius.pill,backgroundColor:picked?colors.primary:'transparent',opacity:past?.35:1}}><Text style={{color:picked?colors.background:colors.text,fontWeight:picked?'900':'600'}}>{day}</Text></Pressable>
   })}</View>
  </View>

  <Text style={[typography.label,{marginBottom:spacing.sm}]}>TIME</Text>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm,marginBottom:spacing.md}}>{TIMES.map(t=><Pressable key={t} onPress={()=>onTimeChange(t)} style={{paddingVertical:11,paddingHorizontal:14,borderRadius:radius.pill,borderWidth:1,borderColor:time===t?colors.primary:colors.border,backgroundColor:time===t?colors.primaryDim:colors.surface}}><Text style={{color:colors.text,fontWeight:'700'}}>{t}</Text></Pressable>)}</View>

  <View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.md}}>
   <Text style={{color:colors.textMuted,marginBottom:spacing.sm}}>Need a different time?</Text>
   <View style={{flexDirection:'row',alignItems:'center',gap:spacing.sm,flexWrap:'wrap'}}>
    <Pressable onPress={()=>setCustomHour(customHour===12?1:customHour+1)} style={{padding:12,borderRadius:radius.md,backgroundColor:colors.surfaceAlt}}><Text style={{color:colors.text,fontWeight:'800'}}>{customHour} hr</Text></Pressable>
    <Pressable onPress={()=>setCustomMinute((customMinute+15)%60)} style={{padding:12,borderRadius:radius.md,backgroundColor:colors.surfaceAlt}}><Text style={{color:colors.text,fontWeight:'800'}}>{String(customMinute).padStart(2,'0')} min</Text></Pressable>
    <Pressable onPress={()=>setAmpm(ampm==='AM'?'PM':'AM')} style={{padding:12,borderRadius:radius.md,backgroundColor:colors.surfaceAlt}}><Text style={{color:colors.text,fontWeight:'800'}}>{ampm}</Text></Pressable>
    <Pressable onPress={applyCustom} style={{padding:12,borderRadius:radius.md,backgroundColor:colors.primary}}><Text style={{color:colors.background,fontWeight:'900'}}>Use Time</Text></Pressable>
   </View>
  </View>
 </View>
}
