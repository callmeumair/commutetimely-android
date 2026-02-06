package com.umerp.commutetimely.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.umerp.commutetimely.ui.screens.home.HomeScreen
import com.umerp.commutetimely.ui.screens.landing.LandingScreen
import com.umerp.commutetimely.ui.screens.planner.PlannerScreen
import com.umerp.commutetimely.ui.screens.result.ResultScreen
import com.umerp.commutetimely.ui.screens.settings.SettingsScreen
import com.umerp.commutetimely.ui.screens.MainScreen

import com.umerp.commutetimely.domain.model.LeaveTimeResult
import kotlinx.serialization.json.Json

@Composable
fun CommuteTimelyNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Landing.route
    ) {
        // ... (Landing and main composables remain same)
        composable(Screen.Landing.route) {
            LandingScreen(
                onGetStarted = {
                    navController.navigate("main") {
                        popUpTo(Screen.Landing.route) { inclusive = true }
                    }
                }
            )
        }

        composable("main") {
            MainScreen(
                onCalculate = { result ->
                    navController.navigate(Screen.Result.createRoute(result))
                }
            )
        }

        // Result Screen (Pushed on top of tabs)
        composable(
            route = Screen.Result.route,
            arguments = Screen.Result.arguments
        ) { backStackEntry ->
            val resultJson = backStackEntry.arguments?.getString("result") ?: ""
            val result = try {
                Json.decodeFromString<LeaveTimeResult>(resultJson)
            } catch (e: Exception) {
                null
            }

            if (result != null) {
                ResultScreen(
                    result = result,
                    onPlanAnother = {
                        navController.popBackStack()
                    },
                    onBackToHome = {
                        // Pop back to the main screen, but ensure we go to the Trips tab
                        navController.popBackStack("main", inclusive = false)
                    }
                )
            }
        }
    }
}
