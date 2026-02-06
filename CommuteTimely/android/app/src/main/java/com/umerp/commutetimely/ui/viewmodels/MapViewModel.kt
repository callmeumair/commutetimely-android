package com.umerp.commutetimely.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.umerp.commutetimely.data.repository.MapboxRepository
import com.umerp.commutetimely.data.repository.WeatherRepository
import com.umerp.commutetimely.domain.model.Location
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MapViewModel @Inject constructor(
    private val mapboxRepository: MapboxRepository,
    private val weatherRepository: WeatherRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MapUiState())
    val uiState: StateFlow<MapUiState> = _uiState.asStateFlow()

    fun searchLocation(query: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val locations = mapboxRepository.geocode(query)
                locations.fold(
                    onSuccess = { locationList ->
                        _uiState.value = _uiState.value.copy(
                            searchResults = locationList,
                            isLoading = false,
                            error = null
                        )
                    },
                    onFailure = { exception ->
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = exception.message
                        )
                    }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun getDirections(origin: Location, destination: Location) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val directions = mapboxRepository.getDirections(origin, destination)
                directions.fold(
                    onSuccess = { directionsResponse ->
                        _uiState.value = _uiState.value.copy(
                            directions = directionsResponse,
                            isLoading = false,
                            error = null
                        )
                    },
                    onFailure = { exception ->
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = exception.message
                        )
                    }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun calculateCommute(
        origin: Location, 
        destination: Location, 
        arrivalTime: String,
        mode: com.umerp.commutetimely.domain.model.CommuteMode
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                // 1. Get Traffic Duration
                val directionsResult = mapboxRepository.getDirections(origin, destination)
                
                // 2. Get Weather
                val weatherResult = weatherRepository.getCurrentWeather(origin)
                
                // 3. Process Results
                if (directionsResult.isSuccess) {
                    val route = directionsResult.getOrNull()?.routes?.firstOrNull() ?: throw Exception("No route found")
                    val trafficDurationMins = (route.duration / 60).toInt()
                    
                    var weatherBuffer = 0
                    if (weatherResult.isSuccess) {
                        val weatherData = weatherResult.getOrNull()
                        if (weatherData != null) {
                            weatherBuffer = weatherRepository.getWeatherBuffer(weatherData.weather.code)
                        }
                    }
                    
                    val safetyBuffer = 10 
                    val totalDuration = trafficDurationMins + weatherBuffer + safetyBuffer
                    
                    // 4. Calculate Leave Time
                    // Parse arrival time (HH:mm)
                    val parts = arrivalTime.split(":")
                    val arrivalHour = parts[0].toInt()
                    val arrivalMinute = parts[1].toInt()
                    
                    var leaveHour = arrivalHour
                    var leaveMinute = arrivalMinute - totalDuration
                    
                    while (leaveMinute < 0) {
                        leaveMinute += 60
                        leaveHour -= 1
                    }
                    if (leaveHour < 0) leaveHour += 24
                    
                    val leaveTimeStr = String.format("%02d:%02d", leaveHour, leaveMinute)
                    
                    val result = com.umerp.commutetimely.domain.model.LeaveTimeResult(
                        arrivalTime = arrivalTime,
                        leaveTime = leaveTimeStr,
                        commuteMode = mode,
                        duration = totalDuration,
                        startLocation = origin,
                        destinationLocation = destination
                    )
                    
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        calculationResult = result,
                        error = null
                    )
                    
                } else {
                    throw Exception("Failed to get directions: ${directionsResult.exceptionOrNull()?.message}")
                }
                
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun clearSearchResults() {
        _uiState.value = _uiState.value.copy(searchResults = emptyList())
    }
}

data class MapUiState(
    val isLoading: Boolean = false,
    val searchResults: List<Location> = emptyList(),
    val directions: com.umerp.commutetimely.data.remote.MapboxApi.DirectionsResponse? = null,
    val calculationResult: com.umerp.commutetimely.domain.model.LeaveTimeResult? = null,
    val error: String? = null
)
