package com.presignedurl.backend.config

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import java.util.*

@Component
class CustomOAuth2SuccessHandler(
    private val redirectUrl: RedirectUrl
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        authentication: Authentication?,
    ) {
        val oAuth2AuthenticationToken = authentication as OAuth2AuthenticationToken
        val clientRegistrationId = oAuth2AuthenticationToken.authorizedClientRegistrationId
        val principal = authentication.principal as OAuth2User
        println("principal $principal")
        val sub = when (clientRegistrationId) {
            "cognito" -> principal.getAttribute<String>("sub")
                ?: throw Exception("!!! cognito sub is not found. !!!")
            else -> principal.getAttribute<String>("sub")
                ?: throw Exception("!!! keycloak sub is not found. !!!")
        }
        val newAuthentication =
            OAuth2AuthenticationToken(
                OAuth2UserImpl(
                    principal.authorities,
                    userId = UUID.randomUUID(),
                    name = "cognito-user",
                    sub = sub,
                ),
                authentication.authorities,
                oAuth2AuthenticationToken.authorizedClientRegistrationId,
            )
        SecurityContextHolder.getContext().authentication = newAuthentication
        response?.sendRedirect(redirectUrl.url)
    }
}
