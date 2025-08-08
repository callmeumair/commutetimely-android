package com.umerp.commutetimely.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.umerp.commutetimely.data.repository.MapboxRepository
import com.umerp.commutetimely.domain.model.Location
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MapViewModel @Inject constructor(
    private val mapboxRepository: MapboxRepository
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

    fun getEstimatedTravelTime(origin: Location, destination: Location): Int? {
        var travelTime: Int? = null
        viewModelScope.launch {
            try {
                val result = mapboxRepository.getEstimatedTravelTime(origin, destination)
                result.fold(
                    onSuccess = { time ->
                        travelTime = time
                    },
                    onFailure = { exception ->
                        _uiState.value = _uiState.value.copy(error = exception.message)
                    }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message)
            }
        }
        return travelTime
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
    val error: String? = null
)
