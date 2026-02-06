package com.umerp.commutetimely.data.remote

import com.umerp.commutetimely.domain.model.UserProfile
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

data class AuthRequest(val email: String, val passwordHash: String)
data class AuthResponse(val token: String, val userId: String, val userProfile: UserProfile)

interface AuthService {
    @POST("auth/login")
    suspend fun signIn(@Body request: AuthRequest): AuthResponse

    @POST("auth/signup")
    suspend fun signUp(@Body request: AuthRequest): AuthResponse

    @GET("auth/me")
    suspend fun getUserProfile(): UserProfile
}
