import {Injectable} from '@nestjs/common';
import {createClient} from 'redis';

@Injectable()
export class RedisService {
    private publisherClient;
    private subscriberClient;

    constructor() {
        this.publisherClient = createClient({
            url: 'redis://localhost:6379',
            // password:'PdiFyZgOVKiq1fT'
        });
        this.subscriberClient = createClient({
            url: 'redis://localhost:6379',
            // password: 'PdiFyZgOVKiq1fT'  // 비밀번호 필요시 추가
        });
        // Redis 클라이언트 연결
        this.publisherClient.connect().then(() => console.log('Publisher Redis client connected'))
            .catch((error) => console.error('Publisher Redis client connection failed:', error));

        this.subscriberClient.connect()
            .then(() => console.log('Subscriber Redis client connected'))
            .catch((error) => console.error('Subscriber Redis client connection failed:', error));
    }

    async subscribeToRoom(roomName: string, callback: (message: string) => void) {
        await this.subscriberClient.subscribe(roomName, (err, count) => {
            if (err) {
                console.error('Failed to subscribe: ', err);
                return;
            }
            console.log(`Subscribed to ${count} channel(s). Listening for updates on the ${roomName} room.`);
        });

        // 메시지 수신 시 처리
        this.subscriberClient.on('message', (channel, message) => {
            if (channel === roomName) {
                try {
                    const parsedMessage = JSON.parse(message);  // 메시지 디코딩
                    callback(parsedMessage.message);
                } catch (e) {
                    console.error('Error parsing message:', e);
                    callback(message);  // 파싱에 실패하면 원본 메시지로 콜백 호출
                }
            }
        });
    }

// 메시지 발행 메서드 (PUBLISH)
    async publishMessage(roomName: string, chatMessage: string) {
        try {
            const message = JSON.stringify({ message: chatMessage });
            console.log('Publishing message:', message);
            const result = await this.publisherClient.publish(roomName, message);

            // 발행된 메시지가 0개의 구독자에게 전달된 경우 (구독자가 없는 경우)
            if (result === 0) {
                console.warn(`No subscribers found for room: ${roomName}`);
            }
        } catch (error) {
            console.error(`Error publishing message to room: ${roomName}`, error);
        }
    }
}
