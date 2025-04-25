// cronJobs/updateRegisterStatus.js

import cron from 'node-cron';
import registerModel from '../src/models/register.model.js';
// Run this every day at 2:00 AM
//0 2 * * *
cron.schedule('*/5 * * * *', async () => {
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const tenMinutesAgo = new Date();
tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

  try {
    const result = await registerModel.updateMany(
      { createdAt: { $lte: tenMinutesAgo }, status: 0 },
      { $set: { status: 1 } }
    );
    console.log(` [CRON] Updated ${result.modifiedCount} users to status 1.`);
  } catch (err) {
    console.error('[CRON] Error updating statuses:', err);
  }
});