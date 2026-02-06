package com.umerp.commutetimely.di

import com.umerp.commutetimely.data.remote.AuthService
import com.umerp.commutetimely.data.remote.CommuteService
import com.umerp.commutetimely.data.remote.MapboxClient
import com.umerp.commutetimely.data.local.TokenStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.ResponseBody.Companion.toResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(tokenStore: TokenStore): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        // Mock Interceptor to simulate Backend Responses securely
        val mockInterceptor = Interceptor { chain ->
            val request = chain.request()
            val url = request.url.toString()
            
            // Validate Authorization Header for protected routes
            if (url.contains("/trips") && request.header("Authorization") == null) {
                return@Interceptor Response.Builder()
                    .code(401)
                    .message("Unauthorized")
                    .request(request)
                    .protocol(Protocol.HTTP_1_1)
                    .body("{}".toResponseBody("application/json".toMediaType()))
                    .build()
            }

            val responseString = when {
                url.endsWith("/auth/login") -> """
                    {
                        "token": "secure_mock_token_123",
                        "userId": "user_123",
                        "userProfile": { "id": "user_123", "email": "test@example.com", "name": "Test User" }
                    }
                """.trimIndent()
                url.endsWith("/auth/me") -> """
                    {
                        "id": "user_123", 
                        "email": "test@example.com", 
                        "name": "Test User" 
                    }
                """.trimIndent()
                
                url.endsWith("/auth/signup") -> """
                    {
                        "token": "secure_mock_token_123",
                        "userId": "user_123",
                        "userProfile": { "id": "user_123", "email": "test@example.com", "name": "Test User" }
                    }
                """.trimIndent()
                
                url.endsWith("/trips") && request.method == "POST" -> request.body?.let { 
                     // Echo back the body with an ID
                     val buffer = okio.Buffer()
                     it.writeTo(buffer)
                     buffer.readUtf8().replace("}", ", \"id\": \"trip_${System.currentTimeMillis()}\"}")
                } ?: "{}"

                url.endsWith("/trips") && request.method == "GET" -> """
                    [
                        {
                            "id": "trip_demo_1",
                            "startLocation": { "name": "Home", "latitude": 37.7749, "longitude": -122.4194 },
                            "destinationLocation": { "name": "Work", "latitude": 37.3382, "longitude": -121.8863 },
                            "commuteMode": "DRIVE",
                            "arrivalTime": "09:00",
                            "leaveTime": "08:15",
                            "date": "2024-02-06",
                            "durationMinutes": 45
                        }
                    ]
                """.trimIndent()

                else -> "{}"
            }

            Response.Builder()
                .code(200)
                .message("OK")
                .request(request)
                .protocol(Protocol.HTTP_1_1)
                .body(responseString.toResponseBody("application/json".toMediaType()))
                .addHeader("content-type", "application/json")
                .build()
        }

        return OkHttpClient.Builder()
            .addInterceptor(mockInterceptor) // Simulate Backend
            .addInterceptor(loggingInterceptor)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.commutetimely.com/") // Placeholder URL
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthService(retrofit: Retrofit): AuthService {
        return retrofit.create(AuthService::class.java)
    }

    @Provides
    @Singleton
    fun provideCommuteService(retrofit: Retrofit): CommuteService {
        return retrofit.create(CommuteService::class.java)
    }

    @Provides
    @Singleton
    fun provideMapboxClient(): MapboxClient {
        return MapboxClient()
    }
}
