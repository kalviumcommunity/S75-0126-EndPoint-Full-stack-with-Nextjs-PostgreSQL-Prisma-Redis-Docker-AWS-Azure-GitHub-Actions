import { PrismaClient } from '@prisma/client';

/**
 * Performance monitoring utilities for Prisma queries
 */

// Query timing logger
class QueryPerformanceMonitor {
  private static queryLog: Array<{
    query: string;
    duration: number;
    timestamp: Date;
  }> = [];

  static logQuery(query: string, duration: number) {
    this.queryLog.push({
      query,
      duration,
      timestamp: new Date()
    });

    // Keep only last 1000 queries to prevent memory issues
    if (this.queryLog.length > 1000) {
      this.queryLog.shift();
    }
  }

  static getSlowQueries(thresholdMs: number = 100) {
    return this.queryLog.filter(log => log.duration > thresholdMs);
  }

  static getAverageQueryTime(): number {
    if (this.queryLog.length === 0) return 0;
    const total = this.queryLog.reduce((sum, log) => sum + log.duration, 0);
    return total / this.queryLog.length;
  }

  static getQueryStats() {
    return {
      totalQueries: this.queryLog.length,
      averageDuration: this.getAverageQueryTime(),
      slowQueries: this.getSlowQueries().length,
      slowestQuery: this.queryLog.length > 0 
        ? Math.max(...this.queryLog.map(q => q.duration)) 
        : 0
    };
  }

  static clearLogs() {
    this.queryLog = [];
  }
}

// Enhanced Prisma client with performance monitoring
class MonitoredPrismaClient extends PrismaClient {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    // Setup query event listener for monitoring
    // @ts-ignore
    this.$on('query', (e: any) => {
      QueryPerformanceMonitor.logQuery(e.query, e.duration);
    });
  }
}

// Benchmark utility function
export async function benchmarkQuery<T>(
  queryFn: () => Promise<T>,
  queryDescription: string
): Promise<{ result: T; duration: number; queryDescription: string }> {
  const startTime = performance.now();
  try {
    const result = await queryFn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ ${queryDescription}: ${duration.toFixed(2)}ms`);
    return { result, duration, queryDescription };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(`❌ ${queryDescription} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}

// Compare performance between two queries
export async function compareQueries<T, U>(
  query1: { fn: () => Promise<T>, description: string },
  query2: { fn: () => Promise<U>, description: string }
): Promise<{
  query1Result: { result: T; duration: number };
  query2Result: { result: U; duration: number };
  performanceRatio: number;
}> {
  console.log('\n🔍 Performance Comparison:');
  console.log('========================');
  
  const result1 = await benchmarkQuery(query1.fn, query1.description);
  const result2 = await benchmarkQuery(query2.fn, query2.description);
  
  const performanceRatio = result2.duration / result1.duration;
  
  console.log('\n📊 Results Summary:');
  console.log(`- ${query1.description}: ${result1.duration.toFixed(2)}ms`);
  console.log(`- ${query2.description}: ${result2.duration.toFixed(2)}ms`);
  console.log(`- Performance ratio: ${performanceRatio.toFixed(2)}x`);
  
  if (performanceRatio > 1) {
    console.log(`- ${query1.description} is ${((performanceRatio - 1) * 100).toFixed(2)}% faster`);
  } else {
    console.log(`- ${query2.description} is ${((1/performanceRatio - 1) * 100).toFixed(2)}% faster`);
  }
  
  return {
    query1Result: { result: result1.result, duration: result1.duration },
    query2Result: { result: result2.result, duration: result2.duration },
    performanceRatio
  };
}

// Database health check utility
export async function databaseHealthCheck(prisma: any) {
  try {
    // Test basic connectivity
    const connectionTest = await benchmarkQuery(
      () => prisma.$queryRaw`SELECT 1 as test`,
      'Database Connection Test'
    );
    
    const userCountTest = await benchmarkQuery(
      () => prisma.user.count(),
      'User Count Query'
    );
    
    // Test join performance
    const complexQueryTest = await benchmarkQuery(
      () => prisma.user.findMany({
        take: 10,
        include: {
          businesses: true,
          orders: {
            take: 5,
            include: {
              items: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      }),
      'Complex Join Query'
    );
    
    const stats = QueryPerformanceMonitor.getQueryStats();
    
    return {
      status: 'healthy',
      connection: 'successful',
      metrics: {
        userCount: userCountTest.result,
        averageQueryTime: stats.averageDuration,
        totalQueriesLogged: stats.totalQueries,
        slowQueries: stats.slowQueries
      },
      benchmarks: {
        connectionTest: connectionTest.duration,
        userCountTest: userCountTest.duration,
        complexQueryTest: complexQueryTest.duration
      }
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    };
  }
}

// Export monitoring utilities
export { QueryPerformanceMonitor, MonitoredPrismaClient };