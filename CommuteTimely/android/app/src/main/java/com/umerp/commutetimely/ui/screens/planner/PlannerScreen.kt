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

        // Start Location Search
        OutlinedTextField(
            value = startSearchQuery,
            onValueChange = { 
                startSearchQuery = it
                if (it.length > 2) {
                    mapViewModel.searchLocation(it)
                }
            },
            label = { Text("Start Location") },
            modifier = Modifier.fillMaxWidth()
        )

        // Start Location Results
        if (mapState.searchResults.isNotEmpty() && startSearchQuery.isNotEmpty()) {
            LazyColumn(
                modifier = Modifier.height(200.dp)
            ) {
                items(mapState.searchResults) { location ->
                    ListItem(
                        headlineContent = { Text(location.name) },
                        modifier = Modifier.clickable {
                            startLocation = location
                            startSearchQuery = location.name
                            mapViewModel.clearSearchResults()
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Destination Location Search
        OutlinedTextField(
            value = destSearchQuery,
            onValueChange = { 
                destSearchQuery = it
                if (it.length > 2) {
                    mapViewModel.searchLocation(it)
                }
            },
            label = { Text("Destination") },
            modifier = Modifier.fillMaxWidth()
        )

        // Destination Location Results
        if (mapState.searchResults.isNotEmpty() && destSearchQuery.isNotEmpty()) {
            LazyColumn(
                modifier = Modifier.height(200.dp)
            ) {
                items(mapState.searchResults) { location ->
                    ListItem(
                        headlineContent = { Text(location.name) },
                        modifier = Modifier.clickable {
                            destinationLocation = location
                            destSearchQuery = location.name
                            mapViewModel.clearSearchResults()
                        }
                    )
                }
            }
        }

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

        // Calculate Button
        Button(
            onClick = {
                if (startLocation != null && destinationLocation != null) {
                    val mockResult = LeaveTimeResult(
                        arrivalTime = "09:00",
                        leaveTime = "08:30",
                        commuteMode = selectedMode,
                        duration = 30,
                        startLocation = startLocation!!,
                        destinationLocation = destinationLocation!!
                    )
                    onCalculate(mockResult)
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = startLocation != null && destinationLocation != null
        ) {
            Text("Calculate Leave Time")
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
