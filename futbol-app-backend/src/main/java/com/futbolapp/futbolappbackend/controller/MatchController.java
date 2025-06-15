package com.futbolapp.futbolappbackend.controller;

import com.futbolapp.futbolappbackend.model.Match;
import com.futbolapp.futbolappbackend.service.ScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchController {private final ScraperService scraperService;

    public MatchController(ScraperService scraperService) {
        this.scraperService = scraperService;
    }

    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = scraperService.scrapeLaLigaMatches();
        return ResponseEntity.ok(matches);
    }
}
