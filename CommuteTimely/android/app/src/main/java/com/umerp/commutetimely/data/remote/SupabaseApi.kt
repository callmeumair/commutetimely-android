package com.umerp.commutetimely.data.remote

import retrofit2.http.*

interface SupabaseApi {
    
    @POST("auth/v1/token?grant_type=password")
    suspend fun signIn(
        @Body request: SignInRequest
    ): SignInResponse

    @POST("auth/v1/signup")
    suspend fun signUp(
        @Body request: SignUpRequest
    ): SignUpResponse

    @GET("rest/v1/profiles")
    suspend fun getUserProfile(): UserProfile

    @PUT("rest/v1/profiles")
    suspend fun updateUserProfile(
        @Body profile: UserProfile
    ): UserProfile

    @GET("rest/v1/commute_profiles")
    suspend fun getCommuteProfiles(): List<CommuteProfile>

    @POST("rest/v1/commute_profiles")
    suspend fun createCommuteProfile(
        @Body profile: CommuteProfile
    ): CommuteProfile

    @PUT("rest/v1/commute_profiles")
    suspend fun updateCommuteProfile(
        @Body profile: CommuteProfile
    ): CommuteProfile

    @DELETE("rest/v1/commute_profiles")
    suspend fun deleteCommuteProfile(
        @Query("id") id: String
    ): Unit

    data class SignInRequest(
        val email: String,
        val password: String
    )

    data class SignInResponse(
        val access_token: String,
        val refresh_token: String,
        val user: User
    )

    data class SignUpRequest(
        val email: String,
        val password: String
    )

    data class SignUpResponse(
        val user: User,
        val session: Session?
    )

    data class User(
        val id: String,
        val email: String,
        val created_at: String
    )

    data class Session(
        val access_token: String,
        val refresh_token: String
    )

    data class UserProfile(
        val id: String,
        val email: String,
        val name: String?,
        val notification_settings: NotificationSettings
    )

    data class NotificationSettings(
        val enabled: Boolean = true,
        val reminder_minutes: Int = 15,
        val sound: Boolean = true,
        val vibration: Boolean = true
    )

    data class CommuteProfile(
        val id: String? = null,
        val user_id: String? = null,
        val name: String,
        val start_location: Location,
        val destination_location: Location,
        val commute_mode: String,
        val arrival_time: String,
        val is_active: Boolean = true
    )

    data class Location(
        val id: String? = null,
        val name: String,
        val latitude: Double? = null,
        val longitude: Double? = null
    )
}
