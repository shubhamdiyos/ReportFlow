package com.reportflow.service;

import com.reportflow.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubApiService {
    
    @Value("${github.api.base-url}")
    private String githubApiBaseUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Fetch user's organizations from GitHub API
     */
    public List<Map<String, Object>> fetchUserOrganizations(String accessToken) {
        try {
            String url = githubApiBaseUrl + "/user/orgs";
            HttpHeaders headers = createGitHubHeaders(accessToken);
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            
            log.warn("Failed to fetch organizations: {}", response.getStatusCode());
            return new ArrayList<>();
            
        } catch (Exception e) {
            log.error("Error fetching user organizations: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch repositories for a specific organization
     */
    public List<Map<String, Object>> fetchOrganizationRepositories(String accessToken, String orgName) {
        try {
            String url = githubApiBaseUrl + "/orgs/" + orgName + "/repos";
            return fetchRepositoriesFromUrl(accessToken, url);
        } catch (Exception e) {
            log.error("Error fetching organization repositories for {}: {}", orgName, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch user's personal repositories
     */
    public List<Map<String, Object>> fetchUserRepositories(String accessToken) {
        try {
            String url = githubApiBaseUrl + "/user/repos";
            return fetchRepositoriesFromUrl(accessToken, url);
        } catch (Exception e) {
            log.error("Error fetching user repositories: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch repositories from a specific URL with pagination support
     */
    private List<Map<String, Object>> fetchRepositoriesFromUrl(String accessToken, String url) {
        List<Map<String, Object>> allRepos = new ArrayList<>();
        String nextUrl = url + "?per_page=100"; // GitHub max per page
        
        while (nextUrl != null && allRepos.size() < 1000) { // Safety limit
            try {
                HttpHeaders headers = createGitHubHeaders(accessToken);
                HttpEntity<String> request = new HttpEntity<>(headers);
                
                ResponseEntity<List> response = restTemplate.exchange(nextUrl, HttpMethod.GET, request, List.class);
                
                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    allRepos.addAll(response.getBody());
                    
                    // Check for pagination
                    nextUrl = extractNextPageUrl(response.getHeaders());
                } else {
                    break;
                }
                
            } catch (Exception e) {
                log.error("Error fetching repositories from {}: {}", nextUrl, e.getMessage());
                break;
            }
        }
        
        return allRepos;
    }
    
    /**
     * Fetch pull requests for a specific repository
     */
    public List<Map<String, Object>> fetchRepositoryPullRequests(String accessToken, String owner, String repo) {
        try {
            String url = githubApiBaseUrl + "/repos/" + owner + "/" + repo + "/pulls";
            return fetchPaginatedData(accessToken, url, "state=all&per_page=100");
        } catch (Exception e) {
            log.error("Error fetching pull requests for {}/{}: {}", owner, repo, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch commits for a specific repository
     */
    public List<Map<String, Object>> fetchRepositoryCommits(String accessToken, String owner, String repo, String since) {
        try {
            String url = githubApiBaseUrl + "/repos/" + owner + "/" + repo + "/commits";
            String params = "per_page=100";
            if (since != null && !since.isEmpty()) {
                params += "&since=" + since;
            }
            return fetchPaginatedData(accessToken, url, params);
        } catch (Exception e) {
            log.error("Error fetching commits for {}/{}: {}", owner, repo, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch contributors for a specific repository
     */
    public List<Map<String, Object>> fetchRepositoryContributors(String accessToken, String owner, String repo) {
        try {
            String url = githubApiBaseUrl + "/repos/" + owner + "/" + repo + "/contributors";
            return fetchPaginatedData(accessToken, url, "per_page=100");
        } catch (Exception e) {
            log.error("Error fetching contributors for {}/{}: {}", owner, repo, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Fetch repository statistics
     */
    public Map<String, Object> fetchRepositoryStats(String accessToken, String owner, String repo) {
        try {
            String url = githubApiBaseUrl + "/repos/" + owner + "/" + repo;
            HttpHeaders headers = createGitHubHeaders(accessToken);
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            
            return new HashMap<>();
            
        } catch (Exception e) {
            log.error("Error fetching repository stats for {}/{}: {}", owner, repo, e.getMessage());
            return new HashMap<>();
        }
    }
    
    /**
     * Fetch user's GitHub profile information
     */
    public Map<String, Object> fetchUserProfile(String accessToken) {
        try {
            String url = githubApiBaseUrl + "/user";
            HttpHeaders headers = createGitHubHeaders(accessToken);
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            
            return new HashMap<>();
            
        } catch (Exception e) {
            log.error("Error fetching user profile: {}", e.getMessage());
            return new HashMap<>();
        }
    }
    
    /**
     * Check if user has access to a specific repository
     */
    public boolean hasRepositoryAccess(String accessToken, String owner, String repo) {
        try {
            String url = githubApiBaseUrl + "/repos/" + owner + "/" + repo;
            HttpHeaders headers = createGitHubHeaders(accessToken);
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
            
        } catch (Exception e) {
            log.debug("No access to repository {}/{}: {}", owner, repo, e.getMessage());
            return false;
        }
    }
    
    /**
     * Generic method to fetch paginated data from GitHub API
     */
    private List<Map<String, Object>> fetchPaginatedData(String accessToken, String baseUrl, String params) {
        List<Map<String, Object>> allData = new ArrayList<>();
        String nextUrl = baseUrl + "?" + params;
        
        while (nextUrl != null && allData.size() < 1000) { // Safety limit
            try {
                HttpHeaders headers = createGitHubHeaders(accessToken);
                HttpEntity<String> request = new HttpEntity<>(headers);
                
                ResponseEntity<List> response = restTemplate.exchange(nextUrl, HttpMethod.GET, request, List.class);
                
                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    allData.addAll(response.getBody());
                    nextUrl = extractNextPageUrl(response.getHeaders());
                } else {
                    break;
                }
                
            } catch (Exception e) {
                log.error("Error fetching paginated data from {}: {}", nextUrl, e.getMessage());
                break;
            }
        }
        
        return allData;
    }
    
    /**
     * Create HTTP headers for GitHub API requests
     */
    private HttpHeaders createGitHubHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        headers.set("User-Agent", "ReportFlow-App");
        return headers;
    }
    
    /**
     * Extract next page URL from GitHub API response headers
     */
    private String extractNextPageUrl(HttpHeaders headers) {
        List<String> linkHeaders = headers.get("Link");
        if (linkHeaders != null && !linkHeaders.isEmpty()) {
            String linkHeader = linkHeaders.get(0);
            // Parse Link header to find "next" relation
            String[] links = linkHeader.split(",");
            for (String link : links) {
                if (link.contains("rel=\"next\"")) {
                    // Extract URL from <URL>
                    int start = link.indexOf('<') + 1;
                    int end = link.indexOf('>');
                    if (start > 0 && end > start) {
                        return link.substring(start, end);
                    }
                }
            }
        }
        return null;
    }
    
    /**
     * Get rate limit information
     */
    public Map<String, Object> getRateLimitInfo(String accessToken) {
        try {
            String url = githubApiBaseUrl + "/rate_limit";
            HttpHeaders headers = createGitHubHeaders(accessToken);
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            
            return new HashMap<>();
            
        } catch (Exception e) {
            log.error("Error fetching rate limit info: {}", e.getMessage());
            return new HashMap<>();
        }
    }
}
