package com.umerp.commutetimely.ui.screens

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.umerp.commutetimely.ui.navigation.Screen
import com.umerp.commutetimely.ui.screens.planner.PlannerScreen
import com.umerp.commutetimely.ui.screens.map.MapScreen
import com.umerp.commutetimely.ui.screens.settings.SettingsScreen
import com.umerp.commutetimely.ui.screens.trips.TripsScreen
import com.umerp.commutetimely.domain.model.LeaveTimeResult

enum class BottomNavItem(
    val route: String,
    val icon: ImageVector,
    val label: String
) {
    Trips("trips", Icons.Default.List, "Trips"),
    Map("map_screen", Icons.Default.Map, "Map"),
    Settings(Screen.Settings.route, Icons.Default.Settings, "Settings")
}

@Composable
fun MainScreen(
    onCalculate: (LeaveTimeResult) -> Unit
) {
    val navController = rememberNavController()
    // Default to Trips
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                BottomNavItem.values().forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = currentRoute == item.route,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavItem.Trips.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            
            // Trips Tab (Home)
            composable(BottomNavItem.Trips.route) {
                TripsScreen(
                    onCreateTrip = {
                        navController.navigate(Screen.Planner.route)
                    }
                )
            }

            // Planner Screen (Hidden from bottom bar, accessed from Trips)
            composable(Screen.Planner.route) {
                PlannerScreen(
                    onCalculate = { result ->
                        // Delegate to root nav or handle here?
                        // For now, assuming onCalculate navigates to ResultScreen via root nav controller which we don't have access to here easily unless we pass it down.
                        // Wait, onCalculate is a callback passed from CommuteTimelyNavigation.
                        onCalculate(result)
                    }
                )
            }

            // Map Tab
            composable(BottomNavItem.Map.route) {
                MapScreen()
            }

            // Settings Tab
            composable(Screen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}
