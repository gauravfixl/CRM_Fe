export const API = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/backend-api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api')

