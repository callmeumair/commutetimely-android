package com.umerp.commutetimely.ui.navigation

import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.umerp.commutetimely.domain.model.LeaveTimeResult
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.net.URLEncoder

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
            val json = Json.encodeToString(result)
            val encodedJson = URLEncoder.encode(json, "UTF-8")
            return "result/$encodedJson"
        }
    }
    object Home : Screen("home")
    object Settings : Screen("settings")
}
