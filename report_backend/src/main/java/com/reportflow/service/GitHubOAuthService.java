package com.reportflow.service;

import com.reportflow.entity.User;
import com.reportflow.entity.UserRole;
import com.reportflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GitHubOAuthService {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String clientSecret;
    
    @Value("${github.oauth.base-url}")
    private String githubOAuthBaseUrl;
    
    @Value("${github.api.base-url}")
    private String githubApiBaseUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public String generateAuthUrl() {
        String scope = "read:user user:email read:org repo";
        // Frontend callback URL (Spring Boot serves frontend on same port)
        String redirectUri = "http://localhost:8080/auth/callback";
        
        return String.format("%s/authorize?client_id=%s&redirect_uri=%s&scope=%s&state=random_state",
                githubOAuthBaseUrl, clientId, redirectUri, scope);
    }
    
    public Map<String, Object> handleCallback(String code) {
        try {
            // Check if client secret is properly configured
            if ("dummy-secret".equals(clientSecret) || clientSecret == null || clientSecret.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "configuration_error");
                errorResponse.put("message", "GitHub Client Secret not properly configured");
                errorResponse.put("details", "Please set the GITHUB_CLIENT_SECRET environment variable with your actual GitHub OAuth app secret");
                return errorResponse;
            }
            
            // Exchange code for access token
            String accessToken = exchangeCodeForToken(code);
            
            // Fetch user profile from GitHub
            Map<String, Object> githubUser = fetchGitHubUser(accessToken);
            
            // Create or update user record
            User user = createOrUpdateUser(githubUser, accessToken);
            
            // Generate JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());
            String jwtToken = jwtUtil.generateToken(user.getUsername(), claims);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", user);
            response.put("message", "Authentication successful");
            response.put("success", true);
            
            return response;
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "authentication_failed");
            errorResponse.put("message", "GitHub OAuth authentication failed");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("success", false);
            
            // Check for specific error types
            if (e.getMessage().contains("bad_verification_code") || e.getMessage().contains("expired")) {
                errorResponse.put("error", "code_expired");
                errorResponse.put("message", "OAuth code has expired");
                errorResponse.put("details", "Please retry the OAuth flow to get a fresh authorization code");
            } else if (e.getMessage().contains("bad_client_credentials")) {
                errorResponse.put("error", "invalid_credentials");
                errorResponse.put("message", "Invalid GitHub Client credentials");
                errorResponse.put("details", "Please check your GitHub Client ID and Secret configuration");
            }
            
            return errorResponse;
        }
    }
    
    private String exchangeCodeForToken(String code) {
        String tokenUrl = githubOAuthBaseUrl + "/access_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");
        
        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                
                // Check for GitHub error response
                if (responseBody.containsKey("error")) {
                    String error = (String) responseBody.get("error");
                    String errorDescription = (String) responseBody.get("error_description");
                    throw new RuntimeException("GitHub OAuth error: " + error + " - " + errorDescription);
                }
                
                String accessToken = (String) responseBody.get("access_token");
                if (accessToken != null && !accessToken.trim().isEmpty()) {
                    return accessToken;
                }
            }
            
            throw new RuntimeException("Failed to exchange code for token: Invalid response from GitHub");
            
        } catch (Exception e) {
            if (e.getMessage().contains("GitHub OAuth error")) {
                throw e; // Re-throw GitHub specific errors
            }
            throw new RuntimeException("Failed to exchange code for token: " + e.getMessage());
        }
    }
    
    private Map<String, Object> fetchGitHubUser(String accessToken) {
        String userUrl = githubApiBaseUrl + "/user";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(userUrl, HttpMethod.GET, request, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        }
        
        throw new RuntimeException("Failed to fetch GitHub user profile");
    }
    
    private User createOrUpdateUser(Map<String, Object> githubUser, String accessToken) {
        String githubId = String.valueOf(githubUser.get("id"));
        String username = (String) githubUser.get("login");
        String name = (String) githubUser.get("name");
        String email = (String) githubUser.get("email");
        String avatar = (String) githubUser.get("avatar_url");
        
        // Check if user exists by GitHub ID
        Optional<User> existingUser = userService.findByGithubId(githubId);
        
        if (existingUser.isPresent()) {
            // Update existing user
            User user = existingUser.get();
            user.setName(name != null ? name : user.getName());
            user.setEmail(email != null ? email : user.getEmail());
            user.setAvatar(avatar);
            return userService.save(user);
        } else {
            // Create new user
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setName(name != null ? name : username);
            newUser.setEmail(email != null ? email : username + "@github.local");
            newUser.setAvatar(avatar);
            newUser.setGithubId(githubId);
            newUser.setRole(UserRole.DEVELOPER);
            newUser.setIsOnboarded(false);
            
            return userService.save(newUser);
        }
    }
}
