package com.codegym.auto_marketing_server.security.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

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

    public void sendSubscriptionExpiryEmail(String to, String name, String planName, LocalDate endDate) throws MessagingException, UnsupportedEncodingException {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("planName", planName);
        context.setVariable("endDate", endDate);
        context.setVariable("planPage", frontendUrl + "/pricing");

        String htmlContent = templateEngine.process("subscription-expiry", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, "Auto Marketing System");
        helper.setTo(to);
        helper.setSubject("Gói " + planName + " của bạn đã hết hạn");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendPostPublishedEmail(String to, String name, String pageId,String pageName, String postTitle, LocalDateTime publishedDate)
            throws MessagingException, UnsupportedEncodingException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedDate = publishedDate.format(formatter);
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("postTitle", postTitle);
        context.setVariable("publishedDate", formattedDate);
        context.setVariable("dashboardUrl", "https://www.facebook.com/profile.php?id=" + pageId);
        context.setVariable("pageName", pageName);
        String htmlContent = templateEngine.process("post-published", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, "Auto Marketing System");
        helper.setTo(to);
        helper.setSubject("Bài viết \"" + postTitle + "\" đã được đăng thành công");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendPostFailedEmail(String to, String name, String pageName, String postTitle, LocalDateTime publishedDate)
            throws MessagingException, UnsupportedEncodingException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedDate = publishedDate.format(formatter);
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("postTitle", postTitle);
        context.setVariable("failedDate", formattedDate);
        context.setVariable("pageName", pageName);
        String htmlContent = templateEngine.process("post-failed", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, "Auto Marketing System");
        helper.setTo(to);
        helper.setSubject("Thất bại khi đăng bài viết \"" + postTitle + "\" do lỗi");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendUserVerificationEmail(String to, String name, String token) throws MessagingException{
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("verificationUrl",frontendUrl + "/verification?token=" +  token);

            String htmlContent = templateEngine.process("email-verification", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Auto Marketing System");
            helper.setTo(to);
            helper.setSubject("Yêu cầu xác nhận đăng ký tài khoản");
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (UnsupportedEncodingException e) {
            throw new MessagingException("Lỗi encoding khi gửi email", e);
        }
    }
}
