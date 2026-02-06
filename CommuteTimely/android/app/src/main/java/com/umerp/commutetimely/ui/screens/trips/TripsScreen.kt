package com.umerp.commutetimely.ui.screens.trips

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.hilt.navigation.compose.hiltViewModel
import com.umerp.commutetimely.domain.model.Trip
import com.umerp.commutetimely.ui.viewmodels.TripsViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun TripsScreen(
    onCreateTrip: () -> Unit,
    viewModel: TripsViewModel = hiltViewModel()
) {
    val trips by viewModel.trips.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "My Trips",
                style = MaterialTheme.typography.headlineLarge
            )
            
             IconButton(onClick = onCreateTrip) {
                 Icon(
                     imageVector = Icons.Default.Add,
                     contentDescription = "Add Trip"
                 )
             }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            CircularProgressIndicator()
        } else if (trips.isEmpty()) {
            EmptyState(onCreateTrip)
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(trips) { trip ->
                    TripItem(trip)
                }
            }
        }
    }
}

@Composable
fun TripItem(trip: Trip) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Leave at: ${trip.leaveTime}",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = trip.date,
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Text(
                text = "Arrive: ${trip.arrivalTime}",
                style = MaterialTheme.typography.bodyMedium
            )
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            Text(text = "From: ${trip.startLocation.name}", style = MaterialTheme.typography.bodySmall)
            Text(text = "To: ${trip.destinationLocation.name}", style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
fun EmptyState(onCreateTrip: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Map,
            contentDescription = null,
            modifier = Modifier.size(80.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No Trips Yet",
            style = MaterialTheme.typography.titleLarge
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Create your first trip to get started with\nintelligent leave-time predictions",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(32.dp))
        Button(
            onClick = onCreateTrip,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Create Your First Trip")
        }
    }
}
