import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Avatar from './Avatar'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo'
import { format, isToday } from 'date-fns'
import { useRouter } from 'expo-router'



const ConversationItem = ({ item, showDivider, router }: any) => {
    const route = useRouter()

    const openConversation = (item: any) => {
        route.push({
            pathname: '/(main)/Conversation',
            params: {
                userId: item?.id?.toString(),
                username: item?.username,
            }
        })
    }

    // دالة لتنسيق التاريخ بشكل جميل
    const formatChatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        if (isToday(date)) {
            return format(date, 'p'); // يعرض الوقت فقط إذا كان اليوم مثل: 10:30 AM
        }
        return format(date, 'MMM d'); // يعرض الشهر واليوم إذا كان قديماً مثل: Apr 25
    }
    return (
        <View>
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => openConversation(item)}
            >
                <View>
                    <Avatar uri={require('../assets/images/defaultAvatar.png')} size={47} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Typo size={17} fontWeight={'600'}>
                            {
                                item?.username
                            }
                        </Typo>
                        <Typo size={12} color={colors.neutral500}>
                            {formatChatDate(item?.createdAt || item?.lastmsgs?.createdAt)}
                        </Typo>
                    </View>
                    <Typo size={12} color={colors.neutral500}>
                        Tab to contact
                    </Typo>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ConversationItem

const styles = StyleSheet.create({
    conversationItem: {
        gap: spacingX._10,
        marginVertical: spacingY._12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    divider: {
        height: 1,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.07)'
    }
})