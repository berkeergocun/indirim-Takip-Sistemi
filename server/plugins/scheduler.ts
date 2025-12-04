import { SchedulerService } from '../services/scheduler.service';

export default defineNitroPlugin(async (nitroApp) => {
  console.log('🚀 Initializing Price Tracker Scheduler Plugin...');
  
  try {
    await SchedulerService.start();
  } catch (error) {
    console.error('Failed to start scheduler:', error);
  }

  nitroApp.hooks.hook('close', () => {
    console.log('Shutting down scheduler...');
    SchedulerService.stop();
  });
});
