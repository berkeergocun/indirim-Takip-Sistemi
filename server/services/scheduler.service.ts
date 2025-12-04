import cron from 'node-cron';
import { PriceCheckerService } from './price-checker.service';
import { connectDB } from '../utils/db';

export class SchedulerService {
  private static job: cron.ScheduledTask | null = null;

  static async start(): Promise<void> {
    // Ensure DB is connected
    await connectDB();

    // Default: Every 6 hours
    const schedule = process.env.CRON_SCHEDULE || '0 */6 * * *';
    
    console.log(`🕐 Starting scheduler with pattern: ${schedule}`);

    this.job = cron.schedule(schedule, async () => {
      console.log(`\n⏰ Cron job triggered at ${new Date().toISOString()}`);
      try {
        await PriceCheckerService.checkAllProducts();
      } catch (error) {
        console.error('Scheduler error:', error);
      }
    });

    console.log('✅ Scheduler started successfully');
  }

  static stop(): void {
    if (this.job) {
      this.job.stop();
      console.log('⏹️  Scheduler stopped');
    }
  }

  static async runNow(): Promise<void> {
    console.log('▶️  Running price check manually...');
    await PriceCheckerService.checkAllProducts();
  }
}
