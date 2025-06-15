package com.futbolapp.futbolappbackend.controller;

import com.futbolapp.futbolappbackend.model.Match;
import com.futbolapp.futbolappbackend.service.ScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scraper")
public class ScraperController {private final ScraperService scraperService;

    public ScraperController(ScraperService scraperService) {
        this.scraperService = scraperService;
    }

    @GetMapping("/laliga")
    public ResponseEntity<List<Match>> getLaLigaMatches() {
        List<Match> matches = scraperService.scrapeLaLigaMatches();
        return ResponseEntity.ok(matches);
    }
}
