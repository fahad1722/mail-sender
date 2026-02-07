package com.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MailSenderBulkApplication {

	public static void main(String[] args) {
		SpringApplication.run(MailSenderBulkApplication.class, args);
	}
}
