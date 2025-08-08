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

@Composable
fun CommuteTimelyNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Landing.route
    ) {
        composable(Screen.Landing.route) {
            LandingScreen(
                onGetStarted = {
                    navController.navigate(Screen.Planner.route)
                }
            )
        }

        composable(Screen.Planner.route) {
            PlannerScreen(
                onCalculate = { result ->
                    navController.navigate(Screen.Result.createRoute(result))
                }
            )
        }

        composable(
            route = Screen.Result.route,
            arguments = Screen.Result.arguments
        ) {
            ResultScreen(
                onPlanAnother = {
                    navController.navigate(Screen.Planner.route) {
                        popUpTo(Screen.Planner.route) { inclusive = true }
                    }
                },
                onBackToHome = {
                    navController.navigate(Screen.Landing.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToPlanner = {
                    navController.navigate(Screen.Planner.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                onBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}
