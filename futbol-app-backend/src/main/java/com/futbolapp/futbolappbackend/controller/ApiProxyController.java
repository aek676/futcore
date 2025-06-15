package com.futbolapp.futbolappbackend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class ApiProxyController {

    private final RestTemplate restTemplate;
    
    @Value("${football.api.key:946e4451a38c26f1c53c8c6c966877e0}")
    private String apiKey;
    
    @Value("${football.api.url:https://v3.football.api-sports.io}")
    private String apiUrl;

    public ApiProxyController() {
        this.restTemplate = new RestTemplate();
    }    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/teams")
    public ResponseEntity<String> getTeams(
            @RequestParam String league,
            @RequestParam String season) {
            
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/teams")
                .queryParam("league", league)
                .queryParam("season", season);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);
            
            // Return only the body, let Spring handle CORS headers
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.out.println("Error getting teams: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/teams/statistics")
    public ResponseEntity<String> getTeamStatistics(
            @RequestParam String team,
            @RequestParam String league,
            @RequestParam String season) {
        
        System.out.println("Getting team statistics for team: " + team + ", league: " + league + ", season: " + season);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/teams/statistics")
                .queryParam("team", team)
                .queryParam("league", league)
                .queryParam("season", season);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.out.println("Error getting team statistics: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }    @GetMapping("/fixtures")
    public ResponseEntity<String> getFixtures(
            @RequestParam String team, 
            @RequestParam(required = false) String last) {
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/fixtures")
                .queryParam("team", team);
                
        if (last != null && !last.isEmpty()) {
            builder.queryParam("last", last);
        }

        HttpEntity<?> entity = new HttpEntity<>(headers);
          try {
            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);
            
            // Remove CORS headers from the external API response to avoid conflicts
            HttpHeaders cleanHeaders = new HttpHeaders();
            response.getHeaders().forEach((key, value) -> {
                String lowerKey = key.toLowerCase();
                if (!lowerKey.startsWith("access-control-") && !lowerKey.contains("cors")) {
                    cleanHeaders.put(key, value);
                }
            });
            
            return new ResponseEntity<>(response.getBody(), cleanHeaders, response.getStatusCode());
        } catch (Exception e) {
            System.out.println("Error getting fixtures: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/standings")
    public ResponseEntity<String> getStandings(
            @RequestParam String league,
            @RequestParam String season) {
            
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/standings")
                .queryParam("league", league)
                .queryParam("season", season);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class);
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.out.println("Error getting standings: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
