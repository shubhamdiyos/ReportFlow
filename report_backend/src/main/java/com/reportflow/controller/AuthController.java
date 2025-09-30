package com.reportflow.controller;

import com.reportflow.dto.AuthResponse;
import com.reportflow.dto.CreateUserRequest;
import com.reportflow.dto.GitHubCallbackRequest;
import com.reportflow.entity.User;
import com.reportflow.entity.UserRole;
import com.reportflow.service.GitHubOAuthService;
import com.reportflow.service.UserService;
import com.reportflow.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://localhost:8080", "http://localhost:9000", "http://127.0.0.1:*"})
@RequiredArgsConstructor
public class AuthController {
    
    private final GitHubOAuthService gitHubOAuthService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/github/url")
    public ResponseEntity<Map<String, String>> getGitHubAuthUrl() {
        String authUrl = gitHubOAuthService.generateAuthUrl();
        return ResponseEntity.ok(Map.of("url", authUrl));
    }
    
    @GetMapping("/github/callback")
    public void githubCallbackGet(@RequestParam("code") String code, 
                                   @RequestParam(value = "state", required = false) String state,
                                   jakarta.servlet.http.HttpServletResponse httpResponse) throws java.io.IOException {
        Map<String, Object> response = gitHubOAuthService.handleCallback(code);
        
        // Redirect to frontend with token
        String frontendUrl = "http://localhost:5173/auth/callback";
        
        if (response.get("success") == Boolean.TRUE) {
            String token = (String) response.get("token");
            // Redirect to frontend with token
            httpResponse.sendRedirect(frontendUrl + "?token=" + token + "&success=true");
        } else {
            // Redirect to frontend with error
            String error = (String) response.get("error");
            String message = (String) response.get("message");
            httpResponse.sendRedirect(frontendUrl + "?error=" + error + "&message=" + java.net.URLEncoder.encode(message, "UTF-8"));
        }
    }
    
    @PostMapping("/github/callback")
    public ResponseEntity<Map<String, Object>> githubCallback(@Valid @RequestBody GitHubCallbackRequest request) {
        Map<String, Object> response = gitHubOAuthService.handleCallback(request.getCode());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/demo-login")
    public ResponseEntity<Map<String, Object>> demoLogin() {
        // Create or get demo user
        User demoUser = userService.findByUsername("demo_user")
                .orElseGet(() -> userService.createUser("demo_user", "Demo User", "demo@reportflow.com"));
        
        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", demoUser.getId());
        claims.put("role", demoUser.getRole().name());
        String jwtToken = jwtUtil.generateToken(demoUser.getUsername(), claims);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("user", demoUser);
        response.put("message", "Demo login successful");
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "ReportFlow API"));
    }
}
