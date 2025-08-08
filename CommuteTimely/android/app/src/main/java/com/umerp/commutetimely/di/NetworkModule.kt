package com.umerp.commutetimely.di

import com.umerp.commutetimely.data.remote.SupabaseClient
import com.umerp.commutetimely.data.remote.MapboxClient
import com.umerp.commutetimely.data.local.TokenStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
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

        return OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()
                val request = original.newBuilder()
                    .apply {
                        tokenStore.getToken()?.let { token ->
                            header("Authorization", "Bearer $token")
                        }
                    }
                    .method(original.method, original.body)
                    .build()
                chain.proceed(request)
            }
            .addInterceptor(loggingInterceptor)
            .build()
    }

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return SupabaseClient()
    }

    @Provides
    @Singleton
    fun provideMapboxClient(): MapboxClient {
        return MapboxClient()
    }
}
