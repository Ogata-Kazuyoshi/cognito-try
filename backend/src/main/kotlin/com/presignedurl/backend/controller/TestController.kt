package com.presignedurl.backend.controller

import com.presignedurl.backend.model.ResponseDemo
import com.presignedurl.backend.model.ResponseUserInfomation
import com.presignedurl.backend.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class TestController (
    val userService: UserService
) {
    @GetMapping("demo")
    fun getAllImages ():ResponseDemo {
        return ResponseDemo(
            message = "Kotlinのバックエンドサーバーからのレスポンス"
        )
    }

    @GetMapping("users")
    fun getUserInformation(): List<ResponseUserInfomation> {
        return userService.getUserInformation()
    }
}