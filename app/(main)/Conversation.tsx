import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { socket } from '@/api/socket';
import { api } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Header from '@/components/Header';
import BackBtn from '@/components/BackBtn';
import { scale, verticalScale } from '@/utils/styling';
import Avatar from '@/components/Avatar';
import MessageItem from '@/components/MessageItem';
import ThemedInput from '@/components/ThemedInput';
import Ionicons from '@react-native-vector-icons/ionicons';
import Loading from '@/components/Loading';

type Message = {
    id: number,
    senderId: number,
    receiverId: number,
    content: string,
    createdAt: string // أضفنا هذا الحقل لتنسيق الوقت
};

const Conversation = () => {
    const { userId, username } = useLocalSearchParams<{
        userId: string, username: string
    } | any>();

    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const id = Number(userId);

        const initChat = async () => {
            // جلب ID المستخدم الحالي مرة واحدة عند فتح الشاشة
            const userData = await AsyncStorage.getItem("userData");
            if (userData) {
                setCurrentUserId(JSON.parse(userData).id);
            }
            loadMessages(id);
        };

        initChat();

        console.log("Is Socket Connected?", socket.connected);

        socket.on('connect', () => console.log("Socket Connected Now!"));

        socket.emit('joinRoom', id);

        socket.on("receiveMessage", (msg: Message) => {
            if (msg.senderId !== currentUserId) {
                setMessages((prev) => [msg, ...prev]);
            } else {
                console.log("Skipping duplicate message from self");
            }
            console.log('msg: ' ,messages)
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [userId]);

    const sendMessage = () => {
        if (!text.trim()) return;

        // الهيكل الجديد المطابق للباك-إند
        const payload = {
            receiverId: Number(userId),
            message: {         // هذا هو الكائن الذي كان undefined
                content: text.trim()
            }
        };

        socket.emit("sendMessage", payload);

        // Optimistic UI: إضافة الرسالة فوراً للواجهة لتعزيز سرعة الاستجابة
        const newMessage: Message = {
            id: Date.now(), // ID مؤقت
            senderId: currentUserId!,
            receiverId: Number(userId),
            content: text.trim(),
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev]);
        setText("");
    };

    const loadMessages = async (id: number) => {
        setLoading(true);
        const access_token = await AsyncStorage.getItem("access_token");
        try {
            const res = await api.get(`/messages/${id}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            
            setMessages(res.data.reverse());
        } catch (error) {
            console.log('failed to load messages', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper showPattern bgOpacity={0.5}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS ? 'padding' : 'height'}
            >
                {/*Header*/}
                <Header
                    style={styles.header}
                    leftIcon={
                        <View style={styles.headerLeft}>
                            <BackBtn />
                            <Avatar
                                size={40}
                                uri={require('../../assets/images/defaultAvatar.png')}
                            />
                            <Typo
                                color={colors.white}
                                fontWeight={'500'}
                                size={22}
                            >{username}</Typo>
                        </View>
                    }
                />

                {/*messages*/}
                <View style={styles.content}>
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center' }}><Loading /></View>
                    ) : (
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id.toString()}
                            inverted={true}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.messagesContent}
                            renderItem={({ item }) => (
                                <MessageItem
                                    item={item}
                                    currentUserId={currentUserId}
                                />
                            )}
                        />
                    )}

                    <View style={styles.footer}>
                        <ThemedInput
                            value={text}
                            onChangeText={value => setText(value)}
                            containerStyle={{
                                paddingStart: spacingX._10,
                                paddingEnd: scale(65),
                                borderWidth: 0
                            }}
                            placeholder='Type message'
                        />

                        <View style={styles.inputRightIcon}>
                            <TouchableOpacity
                                style={styles.inputIcon}
                                onPress={sendMessage}
                                disabled={!text.trim()}
                            >
                                {
                                    false ? ( // تم تعطيل Loading هنا ليكون الإرسال لحظياً
                                        <Loading color={colors.black} size={"small"} />
                                    ) : (
                                        <Ionicons
                                            name='paper-plane'
                                            size={verticalScale(22)}
                                            color={colors.black}
                                        />
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}

export default Conversation

// Styles remain untouched...
const styles = StyleSheet.create({
    // ... (نفس الستايلات الخاصة بك دون أي تعديل)
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._12
    },
    inputRightBtn: {
        position: 'absolute',
        end: scale(10),
        top: verticalScale(15),
        paddingStart: spacingX._12,
        borderStartWidth: 1.5,
        borderStartColor: colors.neutral300
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopStartRadius: radius._50,
        borderTopEndRadius: radius._50,
        borderCurve: 'continuous',
        overflow: 'hidden',
        paddingHorizontal: spacingX._15
    },
    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8
    },
    footer: {
        paddingTop: spacingY._7,
        paddingVertical: verticalScale(22)
    },
    messagesContainer: {
        flex: 1
    },
    messagesContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12
    },
    plusIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full
    },
    inputRightIcon: {
        position: 'absolute',
        end: scale(10),
        paddingStart: spacingX._12,
        top: verticalScale(15),
        borderStartWidth: 1.5,
        borderStartColor: colors.neutral300
    },
})