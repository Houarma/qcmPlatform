package com.qcmplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class QcmPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(QcmPlatformApplication.class, args);
    }
}
