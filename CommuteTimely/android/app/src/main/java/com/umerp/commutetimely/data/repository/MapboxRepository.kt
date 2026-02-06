package com.umerp.commutetimely.data.repository

import com.umerp.commutetimely.BuildConfig
import com.umerp.commutetimely.data.remote.MapboxApi
import com.umerp.commutetimely.data.remote.MapboxClient
import com.umerp.commutetimely.domain.model.Location
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MapboxRepository @Inject constructor(
    private val mapboxClient: MapboxClient
) {
    
    suspend fun getDirections(
        origin: Location,
        destination: Location,
        profile: String = "driving-traffic"
    ): Result<MapboxApi.DirectionsResponse> {
        return try {
            val coordinates = "${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}"
            
            val response = mapboxClient.api.getDirections(
                accessToken = BuildConfig.MAPBOX_ACCESS_TOKEN,
                profile = profile,
                coordinates = coordinates
            )
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getEstimatedTravelTime(
        origin: Location,
        destination: Location,
        profile: String = "driving-traffic"
    ): Result<Int> {
        return try {
            val directions = getDirections(origin, destination, profile)
            directions.fold(
                onSuccess = { response ->
                    if (response.routes.isNotEmpty()) {
                        Result.success((response.routes[0].duration / 60).toInt()) // Convert to minutes
                    } else {
                        Result.failure(Exception("No routes found"))
                    }
                },
                onFailure = { exception ->
                    Result.failure(exception)
                }
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun geocode(query: String): Result<List<Location>> {
        return try {
            val response = mapboxClient.api.geocode(
                accessToken = BuildConfig.MAPBOX_ACCESS_TOKEN,
                query = query
            )
            val locations = response.features.map { feature ->
                Location(
                    id = feature.id,
                    name = feature.place_name,
                    latitude = feature.center[1],
                    longitude = feature.center[0]
                )
            }
            Result.success(locations)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reverseGeocode(latitude: Double, longitude: Double): Result<Location> {
        return try {
            val query = "$longitude,$latitude"
            val response = mapboxClient.api.geocode(
                accessToken = BuildConfig.MAPBOX_ACCESS_TOKEN,
                query = query
            )
            if (response.features.isNotEmpty()) {
                val feature = response.features[0]
                Result.success(Location(
                    id = feature.id,
                    name = feature.place_name,
                    latitude = feature.center[1],
                    longitude = feature.center[0]
                ))
            } else {
                Result.failure(Exception("No location found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
