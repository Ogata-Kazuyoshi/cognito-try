package com.presignedurl.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

data class RedirectUrl(val url: String)

interface SuccessHandlerConfigurationType {
    var url: String
    fun createRedirectUrl(): RedirectUrl
}

@Configuration
class SuccessHandlerConfiguration : SuccessHandlerConfigurationType {
    @Value("\${environments.after-auth-redirect-url}")
    override lateinit var url: String

    @Bean
    override fun createRedirectUrl(): RedirectUrl {
        return RedirectUrl(this.url)
    }
}
