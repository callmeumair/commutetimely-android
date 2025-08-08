package com.umerp.commutetimely.ui.navigation

import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.umerp.commutetimely.domain.model.LeaveTimeResult

sealed class Screen(val route: String) {
    object Landing : Screen("landing")
    object Planner : Screen("planner")
    object Result : Screen("result/{result}") {
        val arguments = listOf(
            navArgument("result") {
                type = NavType.StringType
            }
        )
        
        fun createRoute(result: LeaveTimeResult): String {
            // TODO: Implement proper serialization
            return "result/$result"
        }
    }
    object Home : Screen("home")
    object Settings : Screen("settings")
}
