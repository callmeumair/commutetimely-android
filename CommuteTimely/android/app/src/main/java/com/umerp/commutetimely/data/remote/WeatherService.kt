package com.umerp.commutetimely.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherService {
    @GET("current")
    suspend fun getCurrentWeather(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("key") apiKey: String
    ): WeatherResponse

    data class WeatherResponse(
        val data: List<WeatherData>,
        val count: Int
    )

    data class WeatherData(
        val temp: Double,
        val rh: Int,
        val weather: WeatherDescription,
        val wind_spd: Double
    )

    data class WeatherDescription(
        val icon: String,
        val code: Int,
        val description: String
    )
}
