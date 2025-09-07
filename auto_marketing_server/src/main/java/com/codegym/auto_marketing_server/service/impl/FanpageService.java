package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.FanpageDTO;
import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.repository.IFanpageRepository;
import com.codegym.auto_marketing_server.repository.ISocialAccountRepository;
import com.codegym.auto_marketing_server.service.IFanpageService;
import com.codegym.auto_marketing_server.service.impl.facebook.FacebookClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FanpageService implements IFanpageService {
    private final IFanpageRepository fanpageRepository;
    private final FacebookClient facebookClient;
    private final ISocialAccountRepository socialAccountRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public List<Fanpage> syncUserPages(Long userId) {
        SocialAccount socialAccount = socialAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa liên kết tài khoản Facebook"));

        // Gọi Graph API /me/accounts để lấy danh sách page và page access token
        var response = facebookClient.getUserPages(socialAccount.getAccessToken());

        log.info("Facebook /me/accounts response = {}", response.getBody());
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Không lấy được danh sách fanpage từ Facebook");
        }

        List<Fanpage> saved = new ArrayList<>();
        try {
            JsonNode root = mapper.readTree(response.getBody());

            // danh sách pageId được chọn hiện tại từ Facebook
            Set<String> currentPageIds = new HashSet<>();

            for (JsonNode node : root.path("data")) {
                String pageId = node.path("id").asText();
                String pageName = node.path("name").asText();
                String pageAccessToken = node.path("access_token").asText();

                currentPageIds.add(pageId);

                // upsert theo pageId + socialAccount
                Fanpage fanpage = fanpageRepository
                        .findByPageIdAndSocialAccountId(pageId, socialAccount.getId())
                        .orElse(new Fanpage());

                fanpage.setPageId(pageId);
                fanpage.setPageName(pageName);
                fanpage.setPageAccessNameToken(pageAccessToken);
                fanpage.setSocialAccount(socialAccount);
                fanpage.setTokenExpireAt(null);
                fanpage.setActive(true);
                saved.add(fanpageRepository.save(fanpage));
            }

            // set inactive cho các page không còn được chọn
            List<Fanpage> existingPages = fanpageRepository.findBySocialAccountId(socialAccount.getId());
            for (Fanpage fp : existingPages) {
                if (!currentPageIds.contains(fp.getPageId())) {
                    fp.setActive(false);
                    fanpageRepository.save(fp);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Parse danh sách fanpage thất bại: " + e.getMessage());
        }
        return saved;
    }

    public List<Fanpage> listByUser(Long userId) {
        SocialAccount socialAccount = socialAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa liên kết tài khoản facebook"));
        return fanpageRepository.findBySocialAccountId(socialAccount.getId());
    }

    @Override
    public List<FanpageDTO> getByUserId(Long userId) {
        List<Fanpage> fanpages = fanpageRepository.findByUserId(userId);
        return fanpages.stream()
                .map(f -> new FanpageDTO(
                        f.getId(),
                        f.getPageId(),
                        f.getPageName(),
                        f.getAvatarUrl()
                ))
                .toList();
    }
}
