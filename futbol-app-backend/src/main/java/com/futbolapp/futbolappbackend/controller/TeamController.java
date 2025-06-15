package com.futbolapp.futbolappbackend.controller;

import com.futbolapp.futbolappbackend.model.Team;
import com.futbolapp.futbolappbackend.service.TeamService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    
    private final TeamService teamService;    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/favorites")
    public List<Team> getAllFavorites() {
        return teamService.getAllFavorites();
    }

    @PostMapping("/favorites")
    public Team addToFavorites(@RequestBody Team team) {
        return teamService.addToFavorites(team);
    }    @DeleteMapping("/favorites/{id}")
    public void removeFromFavorites(@PathVariable Long id) {
        teamService.removeFromFavorites(id);
    }
    
    @PatchMapping("/favorites/{id}")
    public Team updateTeam(@PathVariable Long id, @RequestBody Team updates) {
        return teamService.updateTeam(id, updates);
    }
}
