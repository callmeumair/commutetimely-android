package com.umerp.commutetimely.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp


@Composable
fun SettingsScreen() {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Settings",
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 24.dp)
        )



        // Notifications
        SettingsSection(title = "Notifications") {
             SettingsToggleItem("Enable Notifications", true)
             SettingsToggleItem("Sound", true)
             SettingsToggleItem("Vibration", true)
             SettingsToggleItem("Personalized Daily Notifications", false)
        }

        // Appearance
        SettingsSection(title = "Appearance") {
             SettingsNavItem("Theme", "System")
        }

        // Privacy
        SettingsSection(title = "Privacy") {
             SettingsToggleItem("Analytics", false)
             SettingsToggleItem("Data Sharing", false)
             Text(
                 text = "Help improve CommuteTimely by sharing anonymous usage data",
                 style = MaterialTheme.typography.bodySmall,
                 color = MaterialTheme.colorScheme.onSurfaceVariant,
                 modifier = Modifier.padding(top = 8.dp, start = 16.dp, end = 16.dp, bottom = 16.dp)
             )
        }
        
        // Display
        SettingsSection(title = "Display") {
             SettingsNavItem("Temperature", "°F")
             SettingsNavItem("Distance", "mi")
        }

        // About
        SettingsSection(title = "About") {
             SettingsNavItem("Version", "2.0.2")
        }
        
        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
fun SettingsSection(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
        fontWeight = FontWeight.Bold
    )
    Card(
        modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column {
            content()
        }
    }
}

@Composable
fun SettingsToggleItem(title: String, initialValue: Boolean) {
    var checked by remember { mutableStateOf(initialValue) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title, style = MaterialTheme.typography.bodyLarge)
        Switch(
            checked = checked,
            onCheckedChange = { checked = it }
        )
    }
    Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f), thickness = 1.dp)
}

@Composable
fun SettingsNavItem(title: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(horizontal = 16.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title, style = MaterialTheme.typography.bodyLarge)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.width(8.dp))
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
    Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f), thickness = 1.dp)
}
