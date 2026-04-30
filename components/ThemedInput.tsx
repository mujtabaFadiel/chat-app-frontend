import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const ThemedInput = (props: InputProps) => {
    const [isFocused, setIsFocused] = useState(false)
  return (
    <View style={[
        styles.container,
        props.containerStyle && props.containerStyle,
        isFocused && styles.primaryBorder    
    ]}>
      {props.icon && props.icon}

      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  )
}

export default ThemedInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: verticalScale(56),
    borderColor: colors.neutral200,
    borderRadius: radius.full,
    paddingHorizontal: spacingX._15,
    backgroundColor: colors.neutral100,
    borderCurve: 'continuous',
    gap: spacingX._10
  },
  primaryBorder: {
    borderColor: colors.primary
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: verticalScale(14)
  } 
})