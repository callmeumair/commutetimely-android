package com.umerp.commutetimely.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.umerp.commutetimely.data.repository.SupabaseRepository
import com.umerp.commutetimely.domain.model.UserProfile
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val supabaseRepository: SupabaseRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        checkAuthStatus()
    }

    private fun checkAuthStatus() {
        _uiState.value = _uiState.value.copy(
            isAuthenticated = supabaseRepository.isAuthenticated()
        )
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val result = supabaseRepository.signIn(email, password)
                result.fold(
                    onSuccess = { response ->
                        _uiState.value = _uiState.value.copy(
                            isAuthenticated = true,
                            isLoading = false,
                            error = null,
                            user = UserProfile(
                                id = response.user.id,
                                email = response.user.email,
                                name = null
                            )
                        )
                    },
                    onFailure = { exception ->
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = exception.message
                        )
                    }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun signUp(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val result = supabaseRepository.signUp(email, password)
                result.fold(
                    onSuccess = { response ->
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = null,
                            user = UserProfile(
                                id = response.user.id,
                                email = response.user.email,
                                name = null
                            )
                        )
                    },
                    onFailure = { exception ->
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = exception.message
                        )
                    }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            supabaseRepository.signOut()
            _uiState.value = _uiState.value.copy(
                isAuthenticated = false,
                user = null
            )
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

data class AuthUiState(
    val isLoading: Boolean = false,
    val isAuthenticated: Boolean = false,
    val user: UserProfile? = null,
    val error: String? = null
)
