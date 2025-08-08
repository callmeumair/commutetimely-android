package com.umerp.commutetimely.domain.model

enum class CommuteMode(val label: String, val icon: String, val color: String) {
    WALK("Walk", "directions_walk", "#4CAF50"),
    DRIVE("Drive", "directions_car", "#2196F3"),
    BUS("Bus", "directions_bus", "#FF9800"),
    TRAIN("Train", "train", "#9C27B0")
}

data class Location(
    val id: String? = null,
    val name: String,
    val latitude: Double? = null,
    val longitude: Double? = null
)

data class CommuteProfile(
    val id: String? = null,
    val name: String,
    val startLocation: Location,
    val destinationLocation: Location,
    val commuteMode: CommuteMode,
    val arrivalTime: String,
    val isActive: Boolean = true
)

data class LeaveTimeResult(
    val arrivalTime: String,
    val leaveTime: String,
    val commuteMode: CommuteMode,
    val duration: Int,
    val startLocation: Location,
    val destinationLocation: Location
)

data class NotificationSettings(
    val enabled: Boolean = true,
    val reminderMinutes: Int = 15,
    val sound: Boolean = true,
    val vibration: Boolean = true
)

data class UserProfile(
    val id: String,
    val email: String,
    val name: String? = null,
    val notificationSettings: NotificationSettings = NotificationSettings()
)
