package com.reportflow.controller;

import com.reportflow.dto.CreateUserRequest;
import com.reportflow.dto.UpdateUserProfileRequest;
import com.reportflow.dto.UserOrganizationMembership;
import com.reportflow.entity.User;
import com.reportflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/users/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        Optional<User> user = userService.getCurrentUser(authentication.getName());
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/users/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateCurrentUserProfile(
            @Valid @RequestBody UpdateUserProfileRequest request,
            Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User updatedUser = userService.updateUserProfile(
                currentUser.get().getId(),
                request.getName(),
                request.getEmail(),
                request.getAvatar(),
                request.getIsOnboarded()
            );
            
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/users/{id}")
    @PreAuthorize("@userService.isSelfOrManager(#id, authentication.name)")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User user = userService.createUser(request.getUsername(), request.getName(), request.getEmail());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
