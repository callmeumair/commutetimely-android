package com.umerp.commutetimely.data.repository

import com.umerp.commutetimely.data.local.TokenStore
import com.umerp.commutetimely.data.remote.SupabaseApi
import com.umerp.commutetimely.data.remote.SupabaseClient
import com.umerp.commutetimely.domain.model.CommuteProfile
import com.umerp.commutetimely.domain.model.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseRepository @Inject constructor(
    private val supabaseClient: SupabaseClient,
    private val tokenStore: TokenStore
) {
    
    suspend fun signIn(email: String, password: String): Result<SupabaseApi.SignInResponse> {
        return try {
            val response = supabaseClient.api.signIn(SupabaseApi.SignInRequest(email, password))
            tokenStore.saveToken(response.access_token)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signUp(email: String, password: String): Result<SupabaseApi.SignUpResponse> {
        return try {
            val response = supabaseClient.api.signUp(SupabaseApi.SignUpRequest(email, password))
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserProfile(): Result<UserProfile> {
        return try {
            val response = supabaseClient.api.getUserProfile()
            Result.success(UserProfile(
                id = response.id,
                email = response.email,
                name = response.name,
                notificationSettings = com.umerp.commutetimely.domain.model.NotificationSettings(
                    enabled = response.notification_settings.enabled,
                    reminderMinutes = response.notification_settings.reminder_minutes,
                    sound = response.notification_settings.sound,
                    vibration = response.notification_settings.vibration
                )
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateUserProfile(profile: UserProfile): Result<UserProfile> {
        return try {
            val response = supabaseClient.api.updateUserProfile(SupabaseApi.UserProfile(
                id = profile.id,
                email = profile.email,
                name = profile.name,
                notification_settings = SupabaseApi.NotificationSettings(
                    enabled = profile.notificationSettings.enabled,
                    reminder_minutes = profile.notificationSettings.reminderMinutes,
                    sound = profile.notificationSettings.sound,
                    vibration = profile.notificationSettings.vibration
                )
            ))
            Result.success(UserProfile(
                id = response.id,
                email = response.email,
                name = response.name,
                notificationSettings = com.umerp.commutetimely.domain.model.NotificationSettings(
                    enabled = response.notification_settings.enabled,
                    reminderMinutes = response.notification_settings.reminder_minutes,
                    sound = response.notification_settings.sound,
                    vibration = response.notification_settings.vibration
                )
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCommuteProfiles(): Result<List<CommuteProfile>> {
        return try {
            val response = supabaseClient.api.getCommuteProfiles()
            val profiles = response.map { apiProfile ->
                CommuteProfile(
                    id = apiProfile.id,
                    name = apiProfile.name,
                    startLocation = com.umerp.commutetimely.domain.model.Location(
                        id = apiProfile.start_location.id,
                        name = apiProfile.start_location.name,
                        latitude = apiProfile.start_location.latitude,
                        longitude = apiProfile.start_location.longitude
                    ),
                    destinationLocation = com.umerp.commutetimely.domain.model.Location(
                        id = apiProfile.destination_location.id,
                        name = apiProfile.destination_location.name,
                        latitude = apiProfile.destination_location.latitude,
                        longitude = apiProfile.destination_location.longitude
                    ),
                    commuteMode = com.umerp.commutetimely.domain.model.CommuteMode.valueOf(apiProfile.commute_mode.uppercase()),
                    arrivalTime = apiProfile.arrival_time,
                    isActive = apiProfile.is_active
                )
            }
            Result.success(profiles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createCommuteProfile(profile: CommuteProfile): Result<CommuteProfile> {
        return try {
            val response = supabaseClient.api.createCommuteProfile(SupabaseApi.CommuteProfile(
                id = profile.id,
                name = profile.name,
                start_location = SupabaseApi.Location(
                    id = profile.startLocation.id,
                    name = profile.startLocation.name,
                    latitude = profile.startLocation.latitude,
                    longitude = profile.startLocation.longitude
                ),
                destination_location = SupabaseApi.Location(
                    id = profile.destinationLocation.id,
                    name = profile.destinationLocation.name,
                    latitude = profile.destinationLocation.latitude,
                    longitude = profile.destinationLocation.longitude
                ),
                commute_mode = profile.commuteMode.name.lowercase(),
                arrival_time = profile.arrivalTime,
                is_active = profile.isActive
            ))
            Result.success(profile.copy(id = response.id))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signOut() {
        tokenStore.clearToken()
    }

    fun isAuthenticated(): Boolean {
        return tokenStore.getToken() != null
    }
}
