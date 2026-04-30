import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ButtonProps } from '@/types'
import { colors, radius } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Loading from './Loading'

const ThemedBtn = ({
    style,
    onPress,
    children,
    loading = false
}: ButtonProps) => {

  if(loading) {
    return <View style={[styles.btn, style, {backgroundColor: 'transparent'}]} >
      <Loading />
    </View>
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      {children}
    </TouchableOpacity>
  )
}

export default ThemedBtn

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        borderCurve: 'continuous',
        height: verticalScale(56),
        justifyContent: 'center',
        alignItems: 'center'
    }
})