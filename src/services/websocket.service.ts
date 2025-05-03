import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationStore } from "@/src/store/notificationStore";
import { getUnreadNotificationCount } from "./notification.service";
import { Platform } from "react-native";

let stompClient: Client | null = null;

const API_URL =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL
    : process.env.EXPO_PUBLIC_IOS_API;

export const connectWebSocket = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    if (stompClient) {
      disconnectWebSocket();
    }

    // Create WebSocket connection
    const socket = new SockJS(`${API_URL}/ws`);
    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        // console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("Connected to WebSocket: " + frame);

      // Subscribe to user-specific notifications
      stompClient?.subscribe(
        "/user/queue/notifications",
        onNotificationReceived
      );

      stompClient?.subscribe("/topic/promotions", onPromotionReceived);
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    stompClient.activate();

    return () => {
      disconnectWebSocket();
    };
  } catch (error) {
    console.error("WebSocket connection error:", error);
  }
};

export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    stompClient = null;
    console.log("Disconnected from WebSocket");
  }
};

// Handler for user-specific notifications
const onNotificationReceived = (message: any) => {
  console.log("New notification received:", message);
  try {
    const notification = JSON.parse(message.body);
    // Update the notification count
    refreshNotificationCount();
  } catch (error) {
    console.error("Error processing notification:", error);
  }
};

// Handler for promotion notifications
const onPromotionReceived = (message: any) => {
  // console.log('New promotion received:', message);
  try {
    const promotion = JSON.parse(message.body);
    // Update the notification count
    refreshNotificationCount();
  } catch (error) {
    console.error("Error processing promotion:", error);
  }
};

// Refresh notification count
export const refreshNotificationCount = async () => {
  try {
    const response = await getUnreadNotificationCount();
    if (response && response.statusCode === 200 && response.data) {
      const { setUnreadCount } = useNotificationStore.getState();
      setUnreadCount(response.data);
    }
  } catch (error) {
    console.error("Error fetching notification count:", error);
  }
};
