package com.codegym.auto_marketing_server.security.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendResetPasswordEmail(String to, String name, String resetLink)
            throws MessagingException { // chỉ giữ MessagingException
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("resetLink", resetLink);

            String htmlContent = templateEngine.process("reset-password", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Auto Marketing System");
            helper.setTo(to);
            helper.setSubject("Yêu cầu đặt lại mật khẩu");
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (UnsupportedEncodingException e) {
            throw new MessagingException("Lỗi encoding khi gửi email", e);
        }
    }
}
