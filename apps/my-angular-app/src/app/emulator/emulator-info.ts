const authPort = 9099;
const host = 'localhost';

export const EmulatorInfo = {
  host,
  auth: {
    port: authPort,
    useEmulatorUrl: `http://${host}:${authPort}`,
    firebaseAuthEmulatorHost: `${host}:${authPort}`,
  },
} as const;
