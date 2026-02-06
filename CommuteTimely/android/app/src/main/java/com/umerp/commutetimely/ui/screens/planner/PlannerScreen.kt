package com.umerp.commutetimely.ui.screens.planner

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.umerp.commutetimely.domain.model.CommuteMode
import com.umerp.commutetimely.domain.model.LeaveTimeResult
import com.umerp.commutetimely.domain.model.Location
import com.umerp.commutetimely.ui.components.MapView
import com.umerp.commutetimely.ui.viewmodels.MapViewModel
import com.umerp.commutetimely.ui.components.LocationAutocomplete

private enum class ActiveField {
    START,
    DESTINATION
}

@Composable
fun PlannerScreen(
    onCalculate: (LeaveTimeResult) -> Unit,
    mapViewModel: MapViewModel = hiltViewModel()
) {
    val mapState by mapViewModel.uiState.collectAsState()
    var startLocation by remember { mutableStateOf<Location?>(null) }
    var destinationLocation by remember { mutableStateOf<Location?>(null) }
    var selectedMode by remember { mutableStateOf(CommuteMode.DRIVE) }
    var startSearchQuery by remember { mutableStateOf("") }
    var destSearchQuery by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Plan Your Commute",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        // Active Field Component State
        var activeField by remember { mutableStateOf<ActiveField?>(null) }

        // Start Location Autocomplete
        LocationAutocomplete(
            query = startSearchQuery,
            onQueryChange = { query ->
                startSearchQuery = query
                if (query.length > 2) {
                    activeField = ActiveField.START
                    mapViewModel.searchLocation(query)
                } else if (query.isEmpty()) {
                    mapViewModel.clearSearchResults()
                    startLocation = null
                }
            },
            searchResults = if (activeField == ActiveField.START) mapState.searchResults else emptyList(),
            onLocationSelected = { location ->
                startLocation = location
                startSearchQuery = location.name
                mapViewModel.clearSearchResults()
                activeField = null
            },
            label = "Start Location",
            modifier = Modifier.fillMaxWidth(),
            active = activeField == ActiveField.START,
            onActiveChange = { isActive ->
                if (isActive) activeField = ActiveField.START
            }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Destination Location Autocomplete
        LocationAutocomplete(
            query = destSearchQuery,
            onQueryChange = { query ->
                destSearchQuery = query
                if (query.length > 2) {
                    activeField = ActiveField.DESTINATION
                    mapViewModel.searchLocation(query)
                } else if (query.isEmpty()) {
                    mapViewModel.clearSearchResults()
                    destinationLocation = null
                }
            },
            searchResults = if (activeField == ActiveField.DESTINATION) mapState.searchResults else emptyList(),
            onLocationSelected = { location ->
                destinationLocation = location
                destSearchQuery = location.name
                mapViewModel.clearSearchResults()
                activeField = null
            },
            label = "Destination",
            modifier = Modifier.fillMaxWidth(),
            active = activeField == ActiveField.DESTINATION,
            onActiveChange = { isActive ->
                if (isActive) activeField = ActiveField.DESTINATION
            }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Commute Mode Selection
        Text(
            text = "Commute Mode",
            style = MaterialTheme.typography.titleMedium
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            CommuteMode.values().forEach { mode ->
                FilterChip(
                    selected = selectedMode == mode,
                    onClick = { selectedMode = mode },
                    label = { Text(mode.label) }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Map View
        MapView(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Initializing result observation
        LaunchedEffect(mapState.calculationResult) {
            mapState.calculationResult?.let { result ->
                onCalculate(result)
            }
        }

        // Calculate Button
        Button(
            onClick = {
                if (startLocation != null && destinationLocation != null) {
                    mapViewModel.calculateCommute(
                        origin = startLocation!!,
                        destination = destinationLocation!!,
                        arrivalTime = "09:00", // Defaulting to 9 AM for prototype
                        mode = selectedMode
                    )
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = startLocation != null && destinationLocation != null && !mapState.isLoading
        ) {
            if (mapState.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Calculate Leave Time")
            }
        }

        if (mapState.isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )
        }

        if (mapState.error != null) {
            Text(
                text = mapState.error!!,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
