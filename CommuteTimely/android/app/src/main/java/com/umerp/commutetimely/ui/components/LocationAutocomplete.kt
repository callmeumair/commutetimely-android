package com.umerp.commutetimely.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.toSize
import com.umerp.commutetimely.domain.model.Location

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LocationAutocomplete(
    query: String,
    onQueryChange: (String) -> Unit,
    searchResults: List<Location>,
    onLocationSelected: (Location) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    active: Boolean = false,
    onActiveChange: (Boolean) -> Unit = {}
) {
    var textFieldSize by remember { mutableStateOf(Size.Zero) }
    var expanded by remember { mutableStateOf(false) }

    // Expand dropdown only when there are results and the field is active
    LaunchedEffect(searchResults, active) {
        expanded = active && searchResults.isNotEmpty()
    }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { 
            // We manage expansion manually based on search results
        },
        modifier = modifier
    ) {
        OutlinedTextField(
            value = query,
            onValueChange = {
                onQueryChange(it)
                onActiveChange(true)
            },
            label = { Text(label) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
                .onGloballyPositioned { coordinates ->
                    textFieldSize = coordinates.size.toSize()
                },
            singleLine = true,
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { 
                expanded = false 
                onActiveChange(false)
            },
            modifier = Modifier.width(with(LocalDensity.current) { textFieldSize.width.toDp() })
        ) {
            searchResults.forEach { location ->
                DropdownMenuItem(
                    text = { Text(location.name) },
                    onClick = {
                        onLocationSelected(location)
                        expanded = false
                        onActiveChange(false)
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                )
            }
        }
    }
}
