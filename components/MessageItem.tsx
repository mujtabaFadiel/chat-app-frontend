import { StyleSheet, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo'
import { format, isValid } from 'date-fns'

const MessageItem = ({ item, currentUserId }: any) => {
    
    // دالة تنسيق الوقت
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return isValid(date) ? format(date, 'p') : '';
        } catch (error) {
            return '';
        }
    }

    // تحديد ما إذا كانت الرسالة لي بناءً على الـ ID الممرر من الشاشة الأب
    const isMe = item.senderId === currentUserId;

    return (
        <View 
            style={[styles.messageContainer,
                isMe ? styles.mymessage : styles.theirMessage
            ]}
        >
            <View
                style={[styles.messageBubble,
                    isMe ? styles.myBubble : styles.theirBubble
                ]}
            >
                <Typo size={15}>{item.content}</Typo>

                <Typo
                    style={{ alignSelf: 'flex-end' }}
                    size={11}
                    fontWeight={'500'}
                    color={isMe ? colors.neutral600 : colors.neutral600} // يمكنك التحكم باللون هنا
                >
                    {formatTime(item.createdAt)}
                </Typo>
            </View>
        </View>
    )
}

export default MessageItem

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '80%',
        flexDirection: 'row',
        gap: spacingX._7,
    },
    mymessage: {
        alignSelf: 'flex-end'
    },
    theirMessage: {
        alignSelf: 'flex-start'
    },
    messageAvatar: {
        alignSelf: 'flex-end'
    },
    attachment: {
        height: verticalScale(180),
        width: verticalScale(180),
        borderRadius: radius._10
    },
    messageBubble: {
        padding: spacingX._10,
        borderRadius: radius._15,
        gap: spacingY._5
    },
    myBubble: {
        backgroundColor: colors.myBubble
    },
    theirBubble: {
        backgroundColor: colors.otherBubble
    }
})