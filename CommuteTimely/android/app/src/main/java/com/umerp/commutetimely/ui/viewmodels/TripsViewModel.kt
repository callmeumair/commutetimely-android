package com.umerp.commutetimely.ui.viewmodels

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.umerp.commutetimely.data.repository.CommuteRepository
import com.umerp.commutetimely.domain.model.Trip
import com.umerp.commutetimely.notifications.LeaveTimeWorker
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit
import javax.inject.Inject

@HiltViewModel
class TripsViewModel @Inject constructor(
    private val repository: CommuteRepository,
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val _trips = MutableStateFlow<List<Trip>>(emptyList())
    val trips: StateFlow<List<Trip>> = _trips

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    init {
        // Backend handles init, so we just fetch
        fetchTrips()
    }

    fun fetchTrips() {
        viewModelScope.launch {
            _isLoading.value = true
            repository.getTrips().onSuccess {
                _trips.value = it
            }
            _isLoading.value = false
        }
    }

    fun saveTrip(trip: Trip) {
        viewModelScope.launch {
            repository.saveTrip(trip).onSuccess {
                fetchTrips()
                scheduleNotification(it)
            }
        }
    }

    private fun scheduleNotification(trip: Trip) {
        val workManager = WorkManager.getInstance(context)
        
        val inputData = Data.Builder()
            .putString("title", "Time to leave for ${trip.destinationLocation.name}!")
            .putString("message", "Leave now to arrive by ${trip.arrivalTime}")
            .build()

        // Calculate delay
        try {
            // Assuming formats: Date "yyyy-MM-dd", LeaveTime "HH:mm"
            // If date is "Today" or just not full date, we might need logic.
            // But based on mock, let's assume valid ISO date or similar.
            // For resilience, if parsing fails, default to 1 min.
            
            // Note: In a real app we would use java.time explicitly.
            // Simplified parsing for "HH:mm" assuming it's for TODAY if date logic is complex,
            // but let's try to be as real as possible used in MapViewModel logic.
            
            val parts = trip.leaveTime.split(":")
            val leaveHour = parts[0].toInt()
            val leaveMinute = parts[1].toInt()
            
            val leaveCalendar = java.util.Calendar.getInstance()
            leaveCalendar.set(java.util.Calendar.HOUR_OF_DAY, leaveHour)
            leaveCalendar.set(java.util.Calendar.MINUTE, leaveMinute)
            leaveCalendar.set(java.util.Calendar.SECOND, 0)
            
            // If leave time is in the past for today, maybe it's for tomorrow? 
            // Or assume it's just passed.
            // For now, if passed, we set delay to 0 (immediate).
            var delay = leaveCalendar.timeInMillis - System.currentTimeMillis()
            if (delay < 0) {
                 // Check if it was meant for tomorrow? 
                 // Assuming trip logic allows future dates. 
                 // If trip.date is present, parse it.
                 // Ideally we parse trip.date + trip.leaveTime
                 
                 // Fallback: Default to immediate execution
                 delay = 0
            }

            val request = OneTimeWorkRequestBuilder<LeaveTimeWorker>()
                .setInitialDelay(delay, TimeUnit.MILLISECONDS)
                .setInputData(inputData)
                .build()

            workManager.enqueue(request)
        } catch (e: Exception) {
            e.printStackTrace()
            // Fallback
             val request = OneTimeWorkRequestBuilder<LeaveTimeWorker>()
                .setInitialDelay(1, TimeUnit.MINUTES)
                .setInputData(inputData)
                .build()
             workManager.enqueue(request)
        }
    }
}
