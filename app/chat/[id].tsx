import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useChatScreen } from '@/src/features/chat/hooks/useChatScreen';
import { ChatHeader } from '@/src/features/chat/components/ChatHeader';
import { ChatInput } from '@/src/features/chat/components/ChatInput';
import { MessageBubble } from '@/src/shared/components/ui/MessageBubble';
import { TypingIndicator } from '@/src/shared/components/ui/TypingIndicator';
import { EmptyState } from '@/src/shared/components/ui/EmptyState';
import { ScreenWrapper } from '@/src/shared/components/layout/ScreenWrapper';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import type { Message } from '@/src/shared/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const haptics = useHaptics();
  const flatListRef = useRef<FlatList<Message>>(null);

  const {
    conversation,
    agent,
    model,
    input,
    setInput,
    isStreaming,
    streamingText,
    error,
    handleSend,
    handleStop,
    handleRetry,
    handleDeleteMessage,
    handleClearError,
  } = useChatScreen(id);

  useEffect(() => {
    if (!conversation) {
      router.replace('/(tabs)');
    }
  }, [conversation]);

  if (!conversation) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, backgroundColor: colors.background }} />
      </ScreenWrapper>
    );
  }

  const displayMessages = conversation.messages;
  const reversedMessages = [...displayMessages].reverse();
  const showEmpty = displayMessages.length === 0 && !isStreaming;

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ChatHeader title={conversation.title} agent={agent} model={model} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={reversedMessages}
            keyExtractor={(item) => item.id}
            inverted
            renderItem={({ item, index }) => (
              <MessageBubble
                message={item}
                index={index}
                onDelete={handleDeleteMessage}
                onRetry={item.error ? handleRetry : undefined}
              />
            )}
            contentContainerStyle={[
              { paddingTop: 12, paddingBottom: 8 },
              showEmpty && { flex: 1 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              isStreaming ? (
                streamingText ? (
                  <MessageBubble
                    message={{
                      id: '__streaming__',
                      role: 'assistant',
                      content: streamingText,
                      timestamp: Date.now(),
                    }}
                    index={0}
                  />
                ) : (
                  <TypingIndicator visible />
                )
              ) : null
            }
            ListEmptyComponent={
              showEmpty ? (
                <EmptyState
                  icon="message-square"
                  title={agent?.name ?? 'Assistant'}
                  subtitle={agent?.description ?? 'Send a message to start chatting'}
                />
              ) : null
            }
          />

          {error && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginHorizontal: 12,
                marginBottom: 8,
                padding: 10,
                borderRadius: 10,
                backgroundColor: colors.destructiveMuted,
                borderWidth: 1,
                borderColor: colors.destructiveBorder,
              }}
            >
              {/* Error banner inline */}
            </View>
          )}

          <ChatInput
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
          />
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}
