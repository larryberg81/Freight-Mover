import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    const trimmed = trackingId.trim();
    if (!trimmed) {
      setError('Enter a tracking ID to continue');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.push(`/track/${encodeURIComponent(trimmed)}`);
  };

  const s = styles(colors, insets);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Hero section */}
      <View style={s.hero}>
        {/* Logo / brand mark */}
        <View style={s.logoRow}>
          <MaterialCommunityIcons name="truck-fast" size={32} color={colors.primary} />
          <Text style={s.logoText}>MoveFreight</Text>
          <Text style={s.logoFast}> Fast</Text>
        </View>

        <Text style={s.headline}>Track your{'\n'}shipment</Text>
        <Text style={s.sub}>
          Enter your tracking ID to check real-time status, location, and delivery timeline.
        </Text>
      </View>

      {/* Search card */}
      <View style={s.card}>
        <Text style={s.cardLabel}>TRACKING ID</Text>
        <View style={[s.inputRow, error ? s.inputRowError : null]}>
          <Feather name="search" size={18} color={colors.mutedForeground} style={s.inputIcon} />
          <TextInput
            style={s.input}
            value={trackingId}
            onChangeText={(v) => { setTrackingId(v); setError(''); }}
            placeholder="e.g. STN5088840683"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            testID="tracking-id-input"
          />
          {trackingId.length > 0 && (
            <Pressable onPress={() => { setTrackingId(''); setError(''); }} hitSlop={8}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [s.searchBtn, pressed && s.searchBtnPressed]}
          onPress={handleSearch}
          testID="search-button"
        >
          <Feather name="search" size={18} color={colors.primaryForeground} />
          <Text style={s.searchBtnText}>Track Shipment</Text>
        </Pressable>

        {/* Demo hint */}
        <Pressable
          style={s.demoHint}
          onPress={() => {
            setTrackingId('STN5088840683');
            setError('');
            Haptics.selectionAsync();
          }}
        >
          <Feather name="zap" size={12} color={colors.primary} />
          <Text style={s.demoHintText}>Try demo: STN5088840683</Text>
        </Pressable>
      </View>

      {/* Feature pills */}
      <View style={s.pillsRow}>
        {[
          { icon: 'clock' as const, label: 'Real-time status' },
          { icon: 'map-pin' as const, label: 'Live location' },
          { icon: 'list' as const, label: 'Full timeline' },
        ].map(({ icon, label }) => (
          <View key={label} style={s.pill}>
            <Feather name={icon} size={12} color={colors.primary} />
            <Text style={s.pillText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles = (colors: any, insets: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'web' ? 67 : insets.top,
      paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom,
      paddingHorizontal: 24,
    },
    hero: {
      marginTop: 32,
      marginBottom: 32,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    logoText: {
      fontSize: 18,
      fontFamily: 'Inter_700Bold',
      color: colors.foreground,
      marginLeft: 8,
    },
    logoFast: {
      fontSize: 18,
      fontFamily: 'Inter_700Bold',
      color: colors.primary,
    },
    headline: {
      fontSize: 40,
      fontFamily: 'Inter_700Bold',
      color: colors.foreground,
      lineHeight: 46,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    sub: {
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
      lineHeight: 22,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      marginBottom: 20,
    },
    cardLabel: {
      fontSize: 11,
      fontFamily: 'Inter_600SemiBold',
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      marginBottom: 10,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      height: 48,
      marginBottom: 14,
    },
    inputRowError: {
      borderColor: colors.destructive,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'Inter_500Medium',
      color: colors.foreground,
      height: '100%',
    },
    errorText: {
      fontSize: 13,
      fontFamily: 'Inter_400Regular',
      color: colors.destructive,
      marginBottom: 12,
      marginTop: -8,
    },
    searchBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    searchBtnPressed: {
      opacity: 0.85,
    },
    searchBtnText: {
      fontSize: 15,
      fontFamily: 'Inter_600SemiBold',
      color: colors.primaryForeground,
    },
    demoHint: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 14,
    },
    demoHintText: {
      fontSize: 13,
      fontFamily: 'Inter_400Regular',
      color: colors.primary,
    },
    pillsRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    pillText: {
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
      color: colors.mutedForeground,
    },
  });
