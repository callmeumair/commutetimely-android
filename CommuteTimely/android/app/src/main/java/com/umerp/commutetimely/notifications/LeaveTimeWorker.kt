package com.umerp.commutetimely.notifications

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.umerp.commutetimely.util.NotificationHelper
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

@HiltWorker
class LeaveTimeWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val title = inputData.getString("title") ?: "Time to leave!"
        val message = inputData.getString("message") ?: "Your commute starts now."
        
        val notificationHelper = NotificationHelper(applicationContext)
        notificationHelper.showNotification(title, message)
        
        return Result.success()
    }
}
