import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'
import ThemedBtn from '@/components/ThemedBtn'
import { useRouter } from 'expo-router'

const welcome = () => {

  const router = useRouter()
  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Typo color={colors.white} fontWeight={'900'} size={43}>
            Bubbly
          </Typo>
        </View>

        <Animated.Image
          entering={FadeIn.duration(700).springify()}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode={'contain'}
        />

        <View>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
            Stay Connected
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
            with your friends
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
            and family
          </Typo>
        </View>

        <ThemedBtn onPress={() => router.push("/(auth)/Register")}>
          <Typo fontWeight={'bold'} size={23}>Get Started</Typo>
        </ThemedBtn>
      </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._10,
  },
  background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: 'center'
  }
})