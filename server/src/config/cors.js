export function corsOptions(originEnv) {
  return {
    origin: [originEnv || 'http://localhost:5173'],
    credentials: true
  };
}
