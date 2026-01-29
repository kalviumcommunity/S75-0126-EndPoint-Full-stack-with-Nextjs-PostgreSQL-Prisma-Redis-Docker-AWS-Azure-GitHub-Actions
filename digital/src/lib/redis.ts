// Redis client disabled temporarily to avoid connection errors
// import Redis from "ioredis";
// const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Mock Redis client for now
const mockRedis = {
  get: async () => null,
  set: async () => "OK",
  del: async () => 1,
  exists: async () => 0,
};

export default mockRedis;
