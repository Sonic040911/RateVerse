package com.rateverse.controller;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @PostConstruct
    public void init() {
        logger.info("TestController initialized");
    }

    @GetMapping("/test")
    public String test() {
        return "Spring MVC is working!";
    }
}