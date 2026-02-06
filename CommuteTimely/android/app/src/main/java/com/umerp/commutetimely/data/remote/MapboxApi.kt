package com.umerp.commutetimely.data.remote

import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface MapboxApi {
    
    @GET("directions/v5/mapbox/{profile}/{coordinates}")
    suspend fun getDirections(
        @Path("profile") profile: String,
        @Path("coordinates") coordinates: String,
        @Query("access_token") accessToken: String,
        @Query("annotations") annotations: String = "duration,distance",
        @Query("overview") overview: String = "full",
        @Query("steps") steps: Boolean = true
    ): DirectionsResponse

    @GET("geocoding/v5/mapbox.places/{query}.json")
    suspend fun geocode(
        @Query("access_token") accessToken: String,
        @Query("query") query: String,
        @Query("limit") limit: Int = 5,
        @Query("types") types: String = "poi,address"
    ): GeocodingResponse

    data class DirectionsResponse(
        val routes: List<Route>,
        val code: String,
        val waypoints: List<Waypoint>
    )

    data class Route(
        val geometry: String,
        val legs: List<Leg>,
        val weight_name: String,
        val weight: Double,
        val duration: Double,
        val distance: Double
    )

    data class Leg(
        val steps: List<Step>,
        val weight: Double,
        val duration: Double,
        val distance: Double,
        val summary: String
    )

    data class Step(
        val geometry: String,
        val maneuver: Maneuver,
        val weight: Double,
        val duration: Double,
        val distance: Double,
        val name: String
    )

    data class Maneuver(
        val location: List<Double>,
        val bearing_before: Int,
        val bearing_after: Int,
        val type: String,
        val instruction: String
    )

    data class Waypoint(
        val location: List<Double>,
        val name: String
    )

    data class GeocodingResponse(
        val type: String,
        val features: List<Feature>
    )

    data class Feature(
        val id: String,
        val type: String,
        val place_type: List<String>,
        val relevance: Double,
        val properties: Properties,
        val text: String,
        val place_name: String,
        val center: List<Double>
    )

    data class Properties(
        val accuracy: String? = null,
        val address: String? = null,
        val category: String? = null
    )
}
