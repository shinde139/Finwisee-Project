package com.example.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class MailConfigTest implements CommandLineRunner {

    @Autowired
    private Environment env;

    @Override
    public void run(String... args) {

        System.out.println("MAIL USER : " + env.getProperty("spring.mail.username"));
        System.out.println("MAIL PASS : " + env.getProperty("spring.mail.password"));
    }
}