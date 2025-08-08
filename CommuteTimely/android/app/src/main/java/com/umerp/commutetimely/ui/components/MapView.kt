package com.umerp.commutetimely.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.mapbox.maps.MapView
import com.mapbox.maps.Style

@Composable
fun MapView(
    modifier: Modifier = Modifier,
    onMapReady: (MapView) -> Unit = {},
    onMapClick: ((Double, Double) -> Unit)? = null
) {
    val context = LocalContext.current
    
    val mapView = remember {
        MapView(context).apply {
            getMapboxMap().loadStyleUri(Style.MAPBOX_STREETS) { style ->
                // Style loaded
            }
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            mapView.onDestroy()
        }
    }

    AndroidView(
        factory = { mapView },
        modifier = modifier,
        update = { map ->
            onMapReady(map)
        }
    )
}
