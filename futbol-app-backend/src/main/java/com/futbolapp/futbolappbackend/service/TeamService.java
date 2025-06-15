package com.futbolapp.futbolappbackend.service;

import com.futbolapp.futbolappbackend.model.Team;
import com.futbolapp.futbolappbackend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    
    private final TeamRepository teamRepository;

    @Autowired
    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<Team> getAllFavorites() {
        return teamRepository.findAll();
    }

    public Team addToFavorites(Team team) {
        return teamRepository.save(team);
    }

    public void removeFromFavorites(Long teamId) {
        teamRepository.deleteById(teamId);
    }    public Team updateTeam(Long teamId, Team updates) {
        return teamRepository.findById(teamId)
            .map(team -> {
                if (updates.getName() != null) team.setName(updates.getName());
                if (updates.getVenueName() != null) team.setVenueName(updates.getVenueName());
                if (updates.getPersonalNote() != null) team.setPersonalNote(updates.getPersonalNote());
                return teamRepository.save(team);
            })
            .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
    }
}

