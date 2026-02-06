package com.umerp.commutetimely.ui.screens.result

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

import androidx.hilt.navigation.compose.hiltViewModel
import com.umerp.commutetimely.domain.model.LeaveTimeResult
import com.umerp.commutetimely.domain.model.Trip
import com.umerp.commutetimely.ui.viewmodels.TripsViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ResultScreen(
    result: LeaveTimeResult,
    onPlanAnother: () -> Unit,
    onBackToHome: () -> Unit,
    viewModel: TripsViewModel = hiltViewModel()
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Leave Time Calculated",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(32.dp))

        Card(
            modifier = Modifier.fillMaxWidth().padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Leave at: ${result.leaveTime}", style = MaterialTheme.typography.displaySmall)
                Text("Arrive by: ${result.arrivalTime}", style = MaterialTheme.typography.titleMedium)
                Divider(modifier = Modifier.padding(vertical = 8.dp))
                Text("From: ${result.startLocation.name}")
                Text("To: ${result.destinationLocation.name}")
                Text("Mode: ${result.commuteMode.label}")
                Text("Duration: ${result.duration} mins")
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = {
                val trip = Trip(
                    startLocation = result.startLocation,
                    destinationLocation = result.destinationLocation,
                    commuteMode = result.commuteMode,
                    arrivalTime = result.arrivalTime,
                    leaveTime = result.leaveTime,
                    date = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()),
                    durationMinutes = result.duration
                )
                viewModel.saveTrip(trip)
                onBackToHome()
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Save Trip & Notify Me")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedButton(
            onClick = onPlanAnother,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Plan Another")
        }
    }
}
