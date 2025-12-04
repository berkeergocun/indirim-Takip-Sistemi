import { connectDB } from '~/server/utils/db';
import { SchedulerService } from '~/server/services/scheduler.service';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    await SchedulerService.runNow();

    return {
      success: true,
      message: 'Manual price check started for all products',
    };
  } catch (error: any) {
    console.error('Error running manual check:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to run manual check',
    });
  }
});
