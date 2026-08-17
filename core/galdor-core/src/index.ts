export type XiantronEvent = {
  readonly type: string;
  readonly timestamp: string;
  readonly payload: Record<string, unknown>;
};

export interface EventBus {
  publish(event: XiantronEvent): Promise<void>;
}

export interface PolicyEngine {
  authorize(input: {
    readonly subject: string;
    readonly action: string;
    readonly resource: string;
  }): Promise<boolean>;
}

export interface GaldorCore {
  readonly events: EventBus;
  readonly policy: PolicyEngine;
}
