import Constants from "expo-constants";
import type { ComponentType, ReactNode } from "react";
import { Fragment, createElement } from "react";
import * as Sentry from "@sentry/react-native";

const dsn =
  (Constants.expoConfig?.extra as { sentryDsn?: string } | undefined)
    ?.sentryDsn ?? process.env.EXPO_PUBLIC_SENTRY_DSN;

const monitoringEnabled = Boolean(dsn);
let initialised = false;

export function initMonitoring(): void {
  if (initialised || !monitoringEnabled || !dsn) return;
  initialised = true;
  Sentry.init({
    dsn,
    enableNative: true,
    enableNativeCrashHandling: true,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeBreadcrumb: (breadcrumb) => {
      if (breadcrumb.data) {
        const scrubbed = { ...breadcrumb.data };
        delete (scrubbed as Record<string, unknown>).customerName;
        delete (scrubbed as Record<string, unknown>).measurements;
        breadcrumb.data = scrubbed;
      }
      return breadcrumb;
    },
    beforeSend: (event) => {
      if (event.user) {
        delete event.user.email;
        delete event.user.username;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}

type SecurityEvent =
  | "lock_attempt_failed"
  | "lock_cooldown_triggered"
  | "lock_wiped"
  | "lock_set"
  | "backup_exported"
  | "backup_imported"
  | "backup_import_rejected";

export function logSecurityEvent(
  event: SecurityEvent,
  data?: Record<string, string | number | boolean>
): void {
  if (!initialised) return;
  Sentry.addBreadcrumb({
    category: "security",
    message: event,
    level: "info",
    data,
  });
}

type FallbackProps = { error: unknown; resetError: () => void };

type ErrorBoundaryComponent = ComponentType<{
  fallback?: ((props: FallbackProps) => ReactNode) | ReactNode;
  children?: ReactNode;
}>;

const PassthroughBoundary: ErrorBoundaryComponent = ({ children }) =>
  createElement(Fragment, null, children);

export const ErrorBoundary: ErrorBoundaryComponent = monitoringEnabled
  ? (Sentry.ErrorBoundary as unknown as ErrorBoundaryComponent)
  : PassthroughBoundary;

export function wrap<T extends ComponentType<unknown>>(component: T): T {
  if (!monitoringEnabled) return component;
  return Sentry.wrap(component) as T;
}

export { monitoringEnabled };
