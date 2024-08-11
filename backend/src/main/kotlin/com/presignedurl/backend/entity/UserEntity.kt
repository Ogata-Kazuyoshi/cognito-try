package com.presignedurl.backend.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "UserTable")
data class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),
    val name: String = "",
    val nickname: String = "",
    val age: Int = 0
)
