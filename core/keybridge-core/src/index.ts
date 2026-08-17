export type KeyBridgeTransport = 'usb' | 'ble' | 'nfc';

export type KeyBridgeDevice = {
  readonly id: string;
  readonly transport: KeyBridgeTransport;
  readonly displayName: string;
};

export type AuthenticationChallenge = {
  readonly id: string;
  readonly challenge: Uint8Array;
  readonly relyingParty?: string;
};

export type AuthenticationResult = {
  readonly deviceId: string;
  readonly signature: Uint8Array;
  readonly userVerified: boolean;
};

export interface KeyBridgeAuthenticator {
  listDevices(): Promise<readonly KeyBridgeDevice[]>;
  authenticate(challenge: AuthenticationChallenge): Promise<AuthenticationResult>;
}
