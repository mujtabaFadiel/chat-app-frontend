import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import BackBtn from '@/components/BackBtn'
import ThemedInput from '@/components/ThemedInput'
import Ionicons from '@react-native-vector-icons/ionicons'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import ThemedBtn from '@/components/ThemedBtn'
import { api } from '@/api/api'

const register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLodaing] = useState(false)

    const router = useRouter()

    const handleSubmit = async () => {
        setIsLodaing(true)
        try {
            await api.post('/users/register', {
                username: username,
                email: email,
                password: password
            })

            router.replace("/(auth)/Login")
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
                            Need some help?
                        </Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={"600"}>
                                    Getting Started
                                </Typo>
                                <Typo color={colors.neutral500}>
                                    Create an account to continue
                                </Typo>
                            </View>

                            <ThemedInput
                                placeholder='Enter your username'
                                onChangeText={(value: string) => setUsername(value)}
                                icon={
                                    <Ionicons
                                        name='person-outline'
                                        size={verticalScale(26)}
                                        color={colors.neutral500}
                                    />
                                }

                            />
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
                                    > Sign Up</Typo>
                                </ThemedBtn>

                                <View style={styles.footer}>
                                    <Typo>Already have an account? </Typo>
                                    <Pressable onPress={() => router.push('/(auth)/Login')}>
                                        <Typo fontWeight={'bold'} color={colors.primaryDark}>
                                            Login
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

export default register

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