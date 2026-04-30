import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import { verticalScale } from '@/utils/styling'
import { Ionicons } from '@react-native-vector-icons/ionicons';

const BackBtn = ({
    style,
    iconSize=26,
    color=colors.white,
}: BackButtonProps) => {

    const router = useRouter()
  return (
    <TouchableOpacity 
        onPress={() => router.back()}
        style={[styles.btn, style]}    
    >
        <Ionicons name='arrow-back' size={verticalScale(iconSize)} color={color}/>
    </TouchableOpacity>
  )
}

export default BackBtn

const styles = StyleSheet.create({
    btn: {}
})