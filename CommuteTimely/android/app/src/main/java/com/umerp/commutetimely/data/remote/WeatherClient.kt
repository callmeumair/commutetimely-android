package com.umerp.commutetimely.data.remote

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.ResponseBody.Companion.toResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WeatherClient @Inject constructor() {

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(Interceptor { chain ->
            val request = chain.request()
            // Mock Response for Weatherbit
            // Since we don't have a valid API Key in this environment
            if (request.url.toString().contains("api.weatherbit.io")) {
                val responseString = """
                    {
                        "count": 1,
                        "data": [
                            {
                                "app_temp": 24.5,
                                "aqi": 45,
                                "city_name": "San Francisco",
                                "clouds": 0,
                                "country_code": "US",
                                "datetime": "2024-03-12:14",
                                "dewpt": 10.5,
                                "dhi": 100,
                                "dna": 0,
                                "elev_angle": 30,
                                "ghi": 500,
                                "h_angle": 0,
                                "lat": 37.77,
                                "lon": -122.42,
                                "ob_time": "2024-03-12 14:30",
                                "pod": "d",
                                "precip": 0,
                                "pres": 1013,
                                "rh": 50,
                                "slp": 1015,
                                "snow": 0,
                                "solar_rad": 400,
                                "state_code": "CA",
                                "station": "KSFO",
                                "sunrise": "12:00",
                                "sunset": "23:00",
                                "temp": 22.5,
                                "timezone": "America/Los_Angeles",
                                "ts": 1678888888,
                                "uv": 5,
                                "vis": 16,
                                "weather": {
                                    "icon": "c01d",
                                    "code": 800,
                                    "description": "Clear sky"
                                },
                                "wind_cdir": "NW",
                                "wind_cdir_full": "northwest",
                                "wind_dir": 315,
                                "wind_spd": 3.5
                            }
                        ]
                    }
                """.trimIndent()
                
                return@Interceptor Response.Builder()
                    .code(200)
                    .message("OK")
                    .request(request)
                    .protocol(Protocol.HTTP_1_1)
                    .body(responseString.toResponseBody("application/json".toMediaType()))
                    .addHeader("content-type", "application/json")
                    .build()
            }
            chain.proceed(request)
        })
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl("https://api.weatherbit.io/v2.0/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val api: WeatherService = retrofit.create(WeatherService::class.java)
}
