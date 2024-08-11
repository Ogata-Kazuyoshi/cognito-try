package com.presignedurl.backend.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class RouteController {
    @GetMapping("/notfound")
    fun notFound(): String {
        return "redirect:/notfound-page"
    }

    @RequestMapping(
        value = [
            "/",
            "/{path0:[^\\.]*}",
            "/{path0:[^\\.]*}/{path1:[^\\.]*}",
            "/{path0:[^\\.]*}/{path1:[^\\.]*}/{path2:[^\\.]*}",
            "/{path0:[^\\.]*}/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}",
        ],
    )
    fun index(): String {
        return "forward:/index.html"
    }
}
