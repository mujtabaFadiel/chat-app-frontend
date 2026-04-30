import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';


export const socket = io('http://10.160.180.119:3000', {
    autoConnect: false,
    transports: ['polling', 'websocket'],
    forceNew: true,
    reconnectionAttempts: 5,
    timeout: 10000,
});

export const connectSocket = async () => {
    const token = await AsyncStorage.getItem("access_token");
    
   if (token) {
        // تأكد أن التوكن يرسل بالشكل الذي يتوقعه الـ Gateway عندك
        // إذا كان الباك-إند يعمل بـ jwt.verify مباشر، يفضل إرسال التوكن صافي
        const cleanToken = token.replace('Bearer ', ''); 
        
        socket.auth = { token: cleanToken };
        socket.connect();
        
        console.log("Attempting Socket Connection with token...");
    }
    console.log("no token");
}

// أضف مستمعات للأخطاء لمساعدتك في التصحيح
socket.on('connect_error', (err) => {
    console.log('Socket Connection Error:', err.message);
});