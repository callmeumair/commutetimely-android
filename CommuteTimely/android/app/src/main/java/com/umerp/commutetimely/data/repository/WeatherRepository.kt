package com.umerp.commutetimely.data.repository

import com.umerp.commutetimely.data.remote.WeatherClient
import com.umerp.commutetimely.data.remote.WeatherService
import com.umerp.commutetimely.domain.model.Location
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WeatherRepository @Inject constructor(
    private val weatherClient: WeatherClient
) {
    suspend fun getCurrentWeather(location: Location): Result<WeatherService.WeatherData> {
        return try {
            val lat = location.latitude ?: return Result.failure(Exception("Latitude is null"))
            val lon = location.longitude ?: return Result.failure(Exception("Longitude is null"))

            // Use a dummy key since we are Mocking the response in Client
            val response = weatherClient.api.getCurrentWeather(
                lat = lat,
                lon = lon,
                apiKey = "dummy_key"
            )
            if (response.data.isNotEmpty()) {
                Result.success(response.data[0])
            } else {
                Result.failure(Exception("No weather data found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getWeatherBuffer(weatherCode: Int): Int {
        // Weatherbit codes: https://www.weatherbit.io/api/codes
        return when (weatherCode) {
            in 200..233 -> 15 // Thunderstorm
            in 300..522 -> 10 // Drizzle/Rain
            in 600..623 -> 20 // Snow
            in 700..751 -> 10 // Mist/Fog
            else -> 0 // Clear/Clouds
        }
    }
}
