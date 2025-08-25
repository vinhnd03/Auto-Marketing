package com.codegym.auto_marketing_server.security.oauth2;

import java.time.Instant;

public record FacebookTokenData(String token, Instant expiry) {
}
