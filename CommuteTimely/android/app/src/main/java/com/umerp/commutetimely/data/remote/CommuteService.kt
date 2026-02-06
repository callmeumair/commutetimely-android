package com.umerp.commutetimely.data.remote

import com.umerp.commutetimely.domain.model.Trip
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface CommuteService {
    @POST("trips")
    suspend fun saveTrip(@Body trip: Trip): Trip

    @GET("trips")
    suspend fun getTrips(): List<Trip>
}
