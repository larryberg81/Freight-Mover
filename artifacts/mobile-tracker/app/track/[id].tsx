import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGetShipment, getGetShipmentQueryKey } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';

const STEPS = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

function getStepIndex(progress: number): number {
  if (progress <= 0) return -1;
  if (progress <= 25) return 0;
  if (progress <= 50) return 1;
  if (progress <= 75) return 2;
  return 3;
}

function statusColor(
  status: string,
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>
): string {
  const s = status.toLowerCase();
  if (s.includes('delivered')) return colors.success;
  if (s.includes('transit') || s.includes('out for')) return colors.primary;
  if (s.includes('pending')) return colors.warning;
  return colors.mutedForeground;
}

function timelineIconColor(
  status: string,
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>
): string {
  if (status === 'active') return colors.primary;
  if (status === 'done') return colors.success;
  return colors.mutedForeground;
}

export default function TrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: shipment,
    isLoading,
    isError,
    refetch,
  } = useGetShipment(id ?? '', {
    query: {
      queryKey: getGetShipmentQueryKey(id ?? ''),
      enabled: Boolean(id),
      retry: 1,
    },
  });

  const s = styles(colors, insets);

  const renderHeader = () => (
    <View style={s.header}>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          router.back();
        }}
        style={s.backBtn}
        hitSlop={8}
      >
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </Pressable>
      <View style={s.headerTitle}>
        <MaterialCommunityIcons name="truck-fast" size={18} color={colors.primary} />
        <Text style={s.headerTitleText}>Tracking</Text>
      </View>
      <View style={{ width: 38 }} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[s.root, s.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderHeader()}
        <View style={s.centeredContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>Looking up shipment…</Text>
        </View>
      </View>
    );
  }

  if (isError || !shipment) {
    return (
      <View style={[s.root, s.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderHeader()}
        <View style={s.centeredContent}>
          <View style={s.errorIcon}>
            <Feather name="alert-circle" size={36} color={colors.destructive} />
          </View>
          <Text style={s.errorTitle}>Shipment not found</Text>
          <Text style={s.errorSub}>
            No shipment found for tracking ID{'\n'}
            <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>
              {id}
            </Text>
          </Text>
          <Pressable
            style={({ pressed }) => [s.retryBtn, pressed && { opacity: 0.8 }]}
            onPress={() => refetch()}
          >
            <Feather name="refresh-cw" size={14} color={colors.primaryForeground} />
            <Text style={s.retryBtnText}>Retry</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.backLink, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <Text style={s.backLinkText}>Search again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const stepIdx = getStepIndex(shipment.progress);
  const accent = statusColor(shipment.status, colors);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {renderHeader()}

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Status card ── */}
        <View style={s.card}>
          <View style={s.idRow}>
            <Text style={s.idLabel}>TRACKING ID</Text>
            <Text style={[s.statusBadge, { backgroundColor: accent + '22', color: accent }]}>
              {shipment.status.toUpperCase()}
            </Text>
          </View>
          <Text style={s.trackingId}>{shipment.trackingId}</Text>

          <View style={s.divider} />

          {/* Progress steps */}
          <View style={s.stepsRow}>
            {STEPS.map((step, i) => {
              const isActive = i === stepIdx;
              const isDone = i < stepIdx;
              const dotColor = isDone || isActive ? colors.primary : colors.border;
              const labelColor = isActive
                ? colors.primary
                : isDone
                ? colors.foreground
                : colors.mutedForeground;
              return (
                <React.Fragment key={step}>
                  <View style={s.stepItem}>
                    <View
                      style={[
                        s.stepDot,
                        { borderColor: dotColor, backgroundColor: isDone || isActive ? dotColor : 'transparent' },
                      ]}
                    >
                      {isDone && (
                        <Feather name="check" size={8} color={colors.background} />
                      )}
                      {isActive && (
                        <View style={s.stepDotInner} />
                      )}
                    </View>
                    <Text
                      style={[s.stepLabel, { color: labelColor }]}
                      numberOfLines={2}
                    >
                      {step}
                    </Text>
                  </View>
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        s.stepLine,
                        { backgroundColor: i < stepIdx ? colors.primary : colors.border },
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Progress bar */}
          <View style={s.progressBarBg}>
            <View
              style={[
                s.progressBarFill,
                { width: `${shipment.progress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={s.progressLabel}>{shipment.progress}% complete</Text>
        </View>

        {/* ── Route card ── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>ROUTE</Text>
          <RouteRow
            icon="map-pin"
            label="Origin"
            value={shipment.origin}
            colors={colors}
          />
          <View style={s.routeConnector}>
            <View style={[s.routeConnectorLine, { backgroundColor: colors.border }]} />
          </View>
          <RouteRow
            icon="flag"
            label="Destination"
            value={shipment.destination}
            colors={colors}
            accent
          />

          <View style={s.divider} />

          <View style={s.infoGrid}>
            <InfoCell label="Pickup" value={shipment.pickupDate} colors={colors} />
            <InfoCell label="Est. Delivery" value={shipment.estDelivery} colors={colors} />
            <InfoCell label="Weight" value={shipment.weight} colors={colors} />
            <InfoCell label="Service" value={shipment.serviceType} colors={colors} />
          </View>
        </View>

        {/* ── Shipment details card ── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>SHIPMENT DETAILS</Text>
          <DetailRow label="Mode" value={shipment.shipmentMode} colors={colors} />
          <DetailRow label="Carrier" value={shipment.carrier} colors={colors} />
          <DetailRow label="Dimensions" value={shipment.dimensions} colors={colors} />
          <DetailRow label="Insurance" value={shipment.insurance} colors={colors} />
          <DetailRow label="Signature" value={shipment.signatureRequired} colors={colors} />
        </View>

        {/* ── Sender / Receiver ── */}
        <View style={s.twoCol}>
          <ContactCard
            title="SENDER"
            name={shipment.senderName}
            address={shipment.senderAddress}
            colors={colors}
          />
          <ContactCard
            title="RECEIVER"
            name={shipment.receiverName}
            address={shipment.receiverAddress}
            colors={colors}
          />
        </View>

        {/* ── Timeline ── */}
        {shipment.timeline.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>TIMELINE</Text>
            {shipment.timeline.map((event, i) => (
              <TimelineItem
                key={i}
                event={event}
                isLast={i === shipment.timeline.length - 1}
                colors={colors}
              />
            ))}
          </View>
        )}

        {/* ── Payment summary ── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>PAYMENT</Text>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Base rate</Text>
            <Text style={s.payValue}>${shipment.baseShippingRate.toFixed(2)}</Text>
          </View>
          {shipment.weightCharges > 0 && (
            <View style={s.payRow}>
              <Text style={s.payLabel}>Weight charges</Text>
              <Text style={s.payValue}>${shipment.weightCharges.toFixed(2)}</Text>
            </View>
          )}
          {shipment.insuranceFee > 0 && (
            <View style={s.payRow}>
              <Text style={s.payLabel}>Insurance fee</Text>
              <Text style={s.payValue}>${shipment.insuranceFee.toFixed(2)}</Text>
            </View>
          )}
          <View style={s.divider} />
          <View style={s.payRow}>
            <Text style={[s.payLabel, s.payTotal]}>Total</Text>
            <Text style={[s.payValue, s.payTotal]}>
              ${(shipment.baseShippingRate + shipment.weightCharges + shipment.insuranceFee).toFixed(2)}
            </Text>
          </View>
          <View style={s.payStatusRow}>
            <View
              style={[
                s.payStatusBadge,
                {
                  backgroundColor:
                    shipment.paymentStatus === 'PAID'
                      ? colors.success + '22'
                      : colors.warning + '22',
                },
              ]}
            >
              <Text
                style={[
                  s.payStatusText,
                  {
                    color:
                      shipment.paymentStatus === 'PAID' ? colors.success : colors.warning,
                  },
                ]}
              >
                {shipment.paymentStatus}
              </Text>
            </View>
            <Text style={s.payMode}>{shipment.paymentMode}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function RouteRow({
  icon,
  label,
  value,
  colors,
  accent = false,
}: {
  icon: 'map-pin' | 'flag';
  label: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
  accent?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
      <Feather
        name={icon}
        size={16}
        color={accent ? colors.primary : colors.mutedForeground}
        style={{ marginTop: 2 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Inter_500Medium',
            color: colors.mutedForeground,
            letterSpacing: 0.8,
          }}
        >
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.foreground, marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InfoCell({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          color: colors.mutedForeground,
          letterSpacing: 0.8,
          marginBottom: 3,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground }}>
        {value || '—'}
      </Text>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DetailRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.mutedForeground }}>
        {label}
      </Text>
      <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.foreground, flexShrink: 1, textAlign: 'right', marginLeft: 16 }}>
        {value || '—'}
      </Text>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContactCard({ title, name, address, colors }: { title: string; name: string; address: string; colors: any }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14 }}>
      <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.mutedForeground, letterSpacing: 1.1, marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground, marginBottom: 3 }}>
        {name}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, lineHeight: 17 }}>
        {address}
      </Text>
    </View>
  );
}

function TimelineItem({
  event,
  isLast,
  colors,
}: {
  event: {
    date: string;
    time?: string | null;
    event: string;
    location: string;
    note?: string | null;
    status: string;
  };
  isLast: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
}) {
  const dotColor = timelineIconColor(event.status, colors);
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: isLast ? 0 : 16 }}>
      {/* Timeline line + dot */}
      <View style={{ alignItems: 'center', width: 16 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: dotColor + '33',
            borderWidth: 2,
            borderColor: dotColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          {event.status === 'done' && (
            <Feather name="check" size={7} color={dotColor} />
          )}
        </View>
        {!isLast && (
          <View style={{ flex: 1, width: 1.5, backgroundColor: colors.border, marginTop: 4 }} />
        )}
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingBottom: isLast ? 0 : 4 }}>
        <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground, marginBottom: 2 }}>
          {event.event}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, marginBottom: 2 }}>
          {event.location}
        </Text>
        {event.note && (
          <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, fontStyle: 'italic', marginBottom: 2 }}>
            {event.note}
          </Text>
        )}
        <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground }}>
          {event.date}
          {event.time ? `  ·  ${event.time}` : ''}
        </Text>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles = (colors: any, insets: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {},
    centeredContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerTitleText: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: colors.foreground,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      gap: 12,
      paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    idRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    idLabel: {
      fontSize: 11,
      fontFamily: 'Inter_500Medium',
      color: colors.mutedForeground,
      letterSpacing: 1,
    },
    statusBadge: {
      fontSize: 11,
      fontFamily: 'Inter_600SemiBold',
      letterSpacing: 0.8,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },
    trackingId: {
      fontSize: 22,
      fontFamily: 'Inter_700Bold',
      color: colors.foreground,
      letterSpacing: 0.5,
      marginBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },
    stepsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    stepItem: {
      alignItems: 'center',
      width: 60,
    },
    stepDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    stepDotInner: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#fff',
    },
    stepLine: {
      flex: 1,
      height: 2,
      marginTop: 9,
    },
    stepLabel: {
      fontSize: 9,
      fontFamily: 'Inter_500Medium',
      textAlign: 'center',
      lineHeight: 12,
    },
    progressBarBg: {
      height: 4,
      backgroundColor: colors.muted,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressLabel: {
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
      marginTop: 6,
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: 'Inter_600SemiBold',
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      marginBottom: 12,
    },
    routeConnector: {
      paddingLeft: 26,
      paddingVertical: 4,
    },
    routeConnectorLine: {
      height: 24,
      width: 1.5,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    twoCol: {
      flexDirection: 'row',
      gap: 10,
    },
    payRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    payLabel: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
    },
    payValue: {
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: colors.foreground,
    },
    payTotal: {
      fontFamily: 'Inter_700Bold',
      color: colors.foreground,
      fontSize: 16,
    },
    payStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    payStatusBadge: {
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    payStatusText: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    payMode: {
      fontSize: 13,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
    },
    loadingText: {
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
      marginTop: 14,
    },
    errorIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.destructive + '22',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 20,
      fontFamily: 'Inter_700Bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    errorSub: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    retryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: colors.radius,
      marginBottom: 12,
    },
    retryBtnText: {
      fontSize: 15,
      fontFamily: 'Inter_600SemiBold',
      color: colors.primaryForeground,
    },
    backLink: {
      paddingVertical: 8,
    },
    backLinkText: {
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: colors.primary,
    },
  });
