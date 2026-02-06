package com.umerp.commutetimely.data.repository

import com.umerp.commutetimely.data.local.TokenStore
import com.umerp.commutetimely.data.remote.AuthRequest
import com.umerp.commutetimely.data.remote.AuthService
import com.umerp.commutetimely.data.remote.CommuteService
import com.umerp.commutetimely.domain.model.Trip
import com.umerp.commutetimely.domain.model.UserProfile
import javax.inject.Inject
import javax.inject.Singleton
import java.security.MessageDigest

@Singleton
class CommuteRepository @Inject constructor(
    private val authService: AuthService,
    private val commuteService: CommuteService,
    private val tokenStore: TokenStore
) {

    suspend fun signIn(email: String, password: String): Result<UserProfile> = runCatching {
        // In a real app, send pwd over HTTPS. Here we simulate a hash or just send it.
        // For strict parity with previous logic, we can keep hashing if the backend expects it, 
        // but typically client-side hashing is not enough. Let's just pass it to the service.
        val response = authService.signIn(AuthRequest(email, password))
        tokenStore.saveToken(response.token)
        response.userProfile
    }

    suspend fun signUp(email: String, password: String): Result<UserProfile> = runCatching {
        val response = authService.signUp(AuthRequest(email, password))
        tokenStore.saveToken(response.token)
        response.userProfile
    }

    suspend fun saveTrip(trip: Trip): Result<Trip> = runCatching {
        if (!isAuthenticated()) throw Exception("Not authenticated")
        commuteService.saveTrip(trip)
    }

    suspend fun getTrips(): Result<List<Trip>> = runCatching {
        if (!isAuthenticated()) throw Exception("Not authenticated")
        commuteService.getTrips()
    }

    suspend fun getUserProfile(): Result<UserProfile> = runCatching {
        if (!isAuthenticated()) throw Exception("Not authenticated")
        authService.getUserProfile()
    }

    suspend fun signOut() {
        tokenStore.clearToken()
    }

    fun isAuthenticated(): Boolean {
        return tokenStore.getToken() != null
    }

    // Keep helper if beneficial, otherwise logic is in Service/Interceptor
}
