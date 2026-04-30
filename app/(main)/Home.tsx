import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConversationItem from '@/components/ConversationItem'
import { api } from '@/api/api'

const Home = () => {

    const router = useRouter()

    const [username, setUsername] = useState()
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            const access_token = await AsyncStorage.getItem("access_token")

            const res = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            const jsonValue = await AsyncStorage.getItem("userData")
            if (jsonValue != null) {
                const userData = JSON.parse(jsonValue)
                const filteredUsers = res.data.filter((user: any) => {
                    return userData.id != user.id

                })
                console.log('fillter: ', filteredUsers)
                setUsername(userData.username);
                console.log('USERS: ', res.data)
                setUsers(filteredUsers)
            }
        } catch (error) {
            console.log('failed to load user data', error);
        }
    }

    return (
        <ScreenWrapper showPattern bgOpacity={0.4}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo
                            color={colors.neutral100}
                            size={19}
                            textProps={{ numberOfLines: 1 }}
                        >
                            Welcome back,
                            <Typo size={20} color={colors.white} fontWeight={'800'}>
                                {' '}{username}
                            </Typo>
                        </Typo>
                    </View>

                    <TouchableOpacity
                        style={styles.settingIcon}
                        onPress={() => router.push('/(main)/Profile')}
                    >
                        <Ionicons
                            name='settings'
                            size={verticalScale(22)}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: spacingY._20 }}
                    >
                        <View style={styles.navBar}>
                            <View style={styles.tabs}>
                                <TouchableOpacity
                                    style={[styles.TabStyle, styles.activeTabStyle]}
                                >
                                    <Typo>Direct Messages</Typo>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.conversationList}>
                            <FlatList
                                data={users}
                                keyExtractor={(item) => item.id.toString()}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <ConversationItem item={item} />
                                )}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacingX._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._15,
    },
    row: {
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
        overflow: 'hidden',
        paddingHorizontal: spacingX._20
    },
    navBar: {
        flexDirection: 'row',
        gap: spacingX._15,
        paddingHorizontal: spacingX._10,
        alignItems: 'center'
    },
    tabs: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    TabStyle: {
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._20,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100
    },
    activeTabStyle: {
        backgroundColor: colors.primaryLight
    },
    conversationList: {
        paddingVertical: spacingY._20
    },
    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: "absolute",
        bottom: verticalScale(30),
        end: verticalScale(30),
    }
})