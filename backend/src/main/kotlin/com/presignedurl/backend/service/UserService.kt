package com.presignedurl.backend.service

import com.presignedurl.backend.model.ResponseUserInfomation
import com.presignedurl.backend.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface UserService {
    fun getUserInformation(): List<ResponseUserInfomation>
}

@Service
class UserServiceImpl (
    @Autowired val userRepository: UserRepository): UserService
{
    override fun getUserInformation(): List<ResponseUserInfomation> {
        val res = userRepository.findAll()
        return res.map {
            ResponseUserInfomation(
                id = it.id,
                name = it.name,
                nickname = it.nickname,
                age = it.age,
            )
        }
    }
}