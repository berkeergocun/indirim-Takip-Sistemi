import * as schedule from 'node-schedule';
import { PriceCheckerService } from './price-checker.service';
import { connectDB } from '../utils/db';

export class SchedulerService {
  private static job: schedule.Job | null = null;

  static async start(): Promise<void> {
    // Ensure DB is connected
    await connectDB();

    // Default: Every 6 hours (at minute 0)
    // Cron format: minute hour day month dayOfWeek
    const cronSchedule = process.env.CRON_SCHEDULE || '0 */6 * * *';
    
    console.log(`🕐 Starting scheduler with pattern: ${cronSchedule}`);

    this.job = schedule.scheduleJob(cronSchedule, async () => {
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
      this.job.cancel();
      console.log('⏹️  Scheduler stopped');
    }
  }

  static async runNow(): Promise<void> {
    console.log('▶️  Running price check manually...');
    await PriceCheckerService.checkAllProducts();
  }
}
