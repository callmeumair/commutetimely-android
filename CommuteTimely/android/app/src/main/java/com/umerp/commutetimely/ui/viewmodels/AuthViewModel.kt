package com.umerp.commutetimely.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.umerp.commutetimely.data.repository.CommuteRepository
import com.umerp.commutetimely.domain.model.UserProfile
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val commuteRepository: CommuteRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        checkAuthStatus()
    }

    private fun checkAuthStatus() {
        val isAuthenticated = commuteRepository.isAuthenticated()
        _uiState.value = _uiState.value.copy(
            isAuthenticated = isAuthenticated
        )
        
        if (isAuthenticated) {
            viewModelScope.launch {
                commuteRepository.getUserProfile().onSuccess { userProfile ->
                    _uiState.value = _uiState.value.copy(user = userProfile)
                }
            }
        }
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val result = commuteRepository.signIn(email, password)
                result.fold(
                    onSuccess = { userProfile ->
                        _uiState.value = _uiState.value.copy(
                            isAuthenticated = true,
                            isLoading = false,
                            error = null,
                            user = userProfile
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
                val result = commuteRepository.signUp(email, password)
                result.fold(
                    onSuccess = { userProfile ->
                        _uiState.value = _uiState.value.copy(
                            isAuthenticated = true,
                            isLoading = false,
                            error = null,
                            user = userProfile
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
            commuteRepository.signOut()
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
