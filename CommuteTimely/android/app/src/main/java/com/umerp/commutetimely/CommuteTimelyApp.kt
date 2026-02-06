package com.umerp.commutetimely

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

import com.mapbox.maps.ResourceOptionsManager

import com.umerp.commutetimely.util.NotificationHelper

@HiltAndroidApp
class CommuteTimelyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        ResourceOptionsManager.getDefault(this, BuildConfig.MAPBOX_ACCESS_TOKEN)
        
        // Create notification channel
        NotificationHelper(this).createNotificationChannel()
    }
}
