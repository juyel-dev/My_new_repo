import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/src/shared/hooks/useColors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatInput({ value, onChangeText, onSend, onStop, isStreaming }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          paddingBottom: bottom + 8,
        },
      ]}
    >
      <View style={[styles.inputBox, { backgroundColor: colors.input, borderColor: colors.borderMid }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text } as object]}
          placeholder="Message..."
          placeholderTextColor={colors.textFaint}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={4000}
          returnKeyType="send"
          onSubmitEditing={onSend}
          blurOnSubmit={false}
          editable={!isStreaming}
        />

        {isStreaming ? (
          <Pressable onPress={onStop} style={[styles.sendBtn, { backgroundColor: colors.destructive }]}>
            <Feather name="square" size={16} color="#fff" />
          </Pressable>
        ) : (
          <Pressable
            onPress={onSend}
            disabled={!value.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: value.trim() ? colors.primary : colors.chip,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="send" size={16} color={value.trim() ? '#fff' : colors.textFaint} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
    minHeight: 46,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    maxHeight: 120,
    paddingTop: 6,
    paddingBottom: 6,
    lineHeight: 20,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
