import { Avatar } from '@/components/ui/Avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { currentWorker } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  harvest: "For FFB harvesting, ensure the fruit bunches are ripe (orange-red color with loose fruits). Use a chisel for palms under 3m and a sickle on a pole for taller palms. Always cut at the base of the bunch stalk. Remember to collect all loose fruits!",
  fertilizer: "For fertilizer application, spread 3kg of NPK compound per palm in a circle around the trunk (about 1.5m radius). Apply during early morning or late afternoon to prevent nutrient loss. Always wear gloves and avoid application before heavy rain.",
  pest: "Common pests include rhinoceros beetle (look for V-shaped cuts on fronds) and bagworms. For beetles, set up pheromone traps. For bagworms, apply Bacillus thuringiensis spray. Report any unusual pest activity to your supervisor immediately.",
  disease: "Ganoderma is the most serious disease - look for bracket fungi at the trunk base, yellowing fronds, and unopened spears. Mark infected palms and avoid spreading soil from infected areas. Early detection is crucial!",
  safety: "Always wear proper PPE: safety boots, gloves, long sleeves, and eye protection when spraying. Stay hydrated in hot weather. Never work alone in remote areas. Report any injuries immediately.",
  weather: "Check weather conditions before outdoor work. Avoid harvesting during heavy rain (slippery conditions). Postpone spraying if rain is expected within 4 hours. Take shelter during thunderstorms.",
  default: "I'm your AI assistant for palm oil plantation work. I can help you with:\n\n• Harvesting techniques\n• Fertilizer application\n• Pest & disease control\n• Safety guidelines\n• Weather considerations\n\nWhat would you like to know?",
};

const QUICK_PROMPTS = [
  "How to harvest FFB?",
  "Fertilizer application tips",
  "Pest control methods",
  "Safety guidelines",
];

export default function ChatScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI plantation assistant. How can I help you today? 🌴",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('harvest') || lowerMessage.includes('ffb') || lowerMessage.includes('fruit')) {
      return AI_RESPONSES.harvest;
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('manur') || lowerMessage.includes('npk')) {
      return AI_RESPONSES.fertilizer;
    }
    if (lowerMessage.includes('pest') || lowerMessage.includes('beetle') || lowerMessage.includes('bagworm')) {
      return AI_RESPONSES.pest;
    }
    if (lowerMessage.includes('disease') || lowerMessage.includes('ganoderma') || lowerMessage.includes('sick')) {
      return AI_RESPONSES.disease;
    }
    if (lowerMessage.includes('safety') || lowerMessage.includes('ppe') || lowerMessage.includes('protect')) {
      return AI_RESPONSES.safety;
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('storm')) {
      return AI_RESPONSES.weather;
    }
    
    return AI_RESPONSES.default;
  };

  const sendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(messageText),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { paddingTop: 10, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.aiAvatar, { backgroundColor: colors.primaryLight }]}>
          <IconSymbol name="sparkles" size={24} color={colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.menuBtn, { backgroundColor: colors.backgroundSecondary }]}>
          <IconSymbol name="gear" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.sender === 'user' ? styles.userMessageRow : styles.aiMessageRow,
              ]}
            >
              {message.sender === 'ai' && (
                <View style={[styles.messageAvatar, { backgroundColor: colors.primaryLight }]}>
                  <IconSymbol name="sparkles" size={16} color={colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user'
                    ? [styles.userBubble, { backgroundColor: colors.primary }]
                    : [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: message.sender === 'user' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    { color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.textMuted },
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
              {message.sender === 'user' && (
                <Avatar source={currentWorker.avatar} name={currentWorker.name} size={32} />
              )}
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageRow, styles.aiMessageRow]}>
              <View style={[styles.messageAvatar, { backgroundColor: colors.primaryLight }]}>
                <IconSymbol name="sparkles" size={16} color={colors.primary} />
              </View>
              <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { backgroundColor: colors.textMuted }]} />
                  <View style={[styles.typingDot, styles.typingDot2, { backgroundColor: colors.textMuted }]} />
                  <View style={[styles.typingDot, styles.typingDot3, { backgroundColor: colors.textMuted }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {messages.length <= 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickPromptsContainer}
            contentContainerStyle={styles.quickPromptsContent}
          >
            {QUICK_PROMPTS.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickPrompt, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => sendMessage(prompt)}
              >
                <Text style={[styles.quickPromptText, { color: colors.text }]}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.backgroundSecondary },
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={inputText.trim() ? '#FFFFFF' : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.sm,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    borderBottomRightRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  aiBubble: {
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  typingBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  quickPromptsContainer: {
    maxHeight: 50,
    marginBottom: Spacing.sm,
  },
  quickPromptsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  quickPrompt: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  quickPromptText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    
    // --- UPDATED FIX ---
    // 1. Reset paddingBottom to normal size so the bar isn't "thick"
    paddingBottom: Spacing.md, 
    // 2. Use marginBottom to lift the WHOLE bar up above the tabs
    marginBottom: Platform.OS === 'ios' ? 95 : 85,
    
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
  textInput: {
    fontSize: FontSizes.md,
    maxHeight: 80,
    padding: 0,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});