import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import BackBtn from '@/components/BackBtn'
import Avatar from '@/components/Avatar'
import Ionicons from '@react-native-vector-icons/ionicons'
import Typo from '@/components/Typo'
import ThemedInput from '@/components/ThemedInput'
import ThemedBtn from '@/components/ThemedBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { socket } from '@/api/socket'

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()

    const router = useRouter()

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("userData");

            if (jsonValue !== null) {
                const userData = JSON.parse(jsonValue);

                console.log('User Object:', userData);

                setUsername(userData.username);
                setEmail(userData.email);
            }
        } catch (error) {
            console.log('failed to load user data', error);
        }
    };

    const showLogOutAlert = () => {
        Alert.alert("Confirm", "Are sure you want to logout?", [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel logout"),
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: () => handleLogout(),
                style: 'destructive'
            }
        ])
    }
    const handleLogout = async () => {
        try {
            if (socket.connected) {
                socket.disconnect();
                console.log("Socket disconnected on logout");
            }
            await AsyncStorage.removeItem("access_token")
            router.replace('/(auth)/Login')
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    return (
        <ScreenWrapper isModal>
            <View style={styles.container}>
                <Header title='Update Profile'
                    leftIcon={Platform.OS == 'android' && <BackBtn color={colors.black} />}
                    style={{ marginVertical: spacingY._15 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={require('../../assets/images/defaultAvatar.png')}
                            size={170}
                        />
                        <TouchableOpacity style={styles.editIcon}>
                            <Ionicons
                                name='pencil'
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ gap: spacingY._20 }}>
                        <View style={styles.inputContainer}>
                            <Typo style={{ paddingStart: spacingX._10 }}>
                                Username
                            </Typo>

                            <ThemedInput
                                value={username}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingStart: spacingX._20,
                                    //backgroundColor: colors.neutral300
                                }}
                                onChangeText={() => { }}
                                editable={false}
                            />

                        </View>

                        <View style={styles.inputContainer}>
                            <Typo style={{ paddingStart: spacingX._10 }}>
                                Email
                            </Typo>

                            <ThemedInput
                                value={email}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingStart: spacingX._20,
                                    //backgroundColor: colors.neutral300
                                }}
                                onChangeText={() => { }}
                                editable={false}
                            />

                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    !isLoading && (
                        <ThemedBtn
                            style={{
                                backgroundColor: colors.rose,
                                height: verticalScale(56),
                                width: verticalScale(56),
                            }}

                            onPress={showLogOutAlert}
                        >
                            <Ionicons
                                name='log-out-outline'
                                size={verticalScale(30)}
                                color={colors.white}
                            />
                        </ThemedBtn>
                    )
                }

                <ThemedBtn style={{ flex: 1 }} loading={isLoading} onPress={() => { }}>
                    <Typo color={colors.black} fontWeight={'700'}>Update</Typo>
                </ThemedBtn>
            </View>
        </ScreenWrapper>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
        // paddingVertical: spacingY_30,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral200,
        marginBottom: spacingY._10,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
        // overflow: "hidden",
        // position: "relative",
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._7,
    },
})