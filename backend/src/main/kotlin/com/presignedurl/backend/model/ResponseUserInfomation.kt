package com.presignedurl.backend.model

import java.util.UUID

data class ResponseUserInfomation(
    val id: UUID,
    val name: String,
    val nickname: String,
    val age: Int
)
