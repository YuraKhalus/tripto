import { app } from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Tripto API: http://localhost:${PORT}/api/health`);
});
