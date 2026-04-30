import { Alert, 
    KeyboardAvoidingView, 
    Platform, 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { connectSocket } from '@/api/socket'
import { api } from '@/api/api'

import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import BackBtn from '@/components/BackBtn'
import ThemedInput from '@/components/ThemedInput'
import ThemedBtn from '@/components/ThemedBtn'


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLodaing] = useState(false)

    const router = useRouter()

    const handleSubmit = async () => {
        setIsLodaing(true)
        try {
            const res = await api.post('/auth/login', {
              email,
              password
            })

            const access_token = res.data.access_token
            const userData = res.data.user

            await AsyncStorage.setItem('access_token', access_token)
            await AsyncStorage.setItem('userData', JSON.stringify(userData))

            await connectSocket();
            
            router.replace('/(main)/Home')
            setIsLodaing(false)
            
        } catch (error: any) {
            console.log("Full Error Data:", error.response?.data);

            if (error.response && (error.response.status === 400 || error.response.status === 409)) {

                const errorMessage = error.response.data.message;

                const formattedError = Array.isArray(errorMessage)
                    ? errorMessage.join('\n')
                    : errorMessage;

                Alert.alert(
                    error.response.status === 409 ? 'Conflict' : 'Validation Error',
                    formattedError
                );

            } else {
                Alert.alert('Error', 'Could not connect to the server. Please try again later.');
            }

            setIsLodaing(false)
        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS ? 'padding' : 'height'}
        >
            <ScreenWrapper showPattern>
                <View style={styles.constainer}>

                    <View style={styles.header}>
                        <BackBtn iconSize={28} />
                        <Typo color={colors.white} size={17}>
                            Forgot Password?
                        </Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={"600"}>
                                    Welcome back!
                                </Typo>
                                <Typo color={colors.neutral500}>
                                    We are happy to see you
                                </Typo>
                            </View>

                            <ThemedInput
                                placeholder='Enter your email'
                                onChangeText={(value: string) => setEmail(value)}
                                icon={
                                    <Ionicons
                                        name='mail-outline'
                                        size={verticalScale(26)}
                                        color={colors.neutral500}
                                    />
                                }

                            />
                            <ThemedInput
                                placeholder='Enter your password'
                                onChangeText={(value: string) => setPassword(value)}
                                secureTextEntry
                                icon={
                                    <Ionicons
                                        name='lock-closed-outline'
                                        size={verticalScale(26)}
                                        color={colors.neutral500}
                                    />
                                }

                            />

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <ThemedBtn loading={isLoading} onPress={handleSubmit}>
                                    <Typo
                                        fontWeight={'bold'}
                                        size={20}
                                        color={colors.black}
                                    > Login</Typo>
                                </ThemedBtn>

                                <View style={styles.footer}>
                                    <Typo>Don't have an account?</Typo>
                                    <Pressable onPress={() => router.push('/(auth)/Register')}>
                                        <Typo fontWeight={'bold'} color={colors.primaryDark}>
                                            Sign Up
                                        </Typo>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    header: {
        paddingHorizontal: spacingX._20,
        //paddingTop: spacingY._15,
        paddingBottom: spacingY._25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopStartRadius: radius._50,
        borderTopEndRadius: radius._50,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20
    },
    form: {
        gap: spacingY._15,
        paddingTop: spacingY._20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    }
})