package com.futbolapp.futbolappbackend.repository;

import com.futbolapp.futbolappbackend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
