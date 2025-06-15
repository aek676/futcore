package com.futbolapp.futbolappbackend.service;

import com.futbolapp.futbolappbackend.model.Match;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;

@Service
public class ScraperService {
    private static final String SOCCER_URL = "https://www.marca.com/futbol/primera-division/calendario.html";

    public List<Match> scrapeLaLigaMatches() {
        Map<String, Match> matchesMap = new HashMap<>();
        try {
            Document doc = Jsoup.connect(SOCCER_URL)
                              .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36")
                              .timeout(30000)
                              .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                              .header("Accept-Language", "es-ES,es;q=0.8")
                              .get();

            // Primero procesamos los partidos del JSON-LD (partidos futuros)
            Elements scriptElements = doc.select("script[type=application/ld+json]");
            for (Element script : scriptElements) {
                try {
                    String jsonText = script.html();
                    if (jsonText.contains("SportsEvent")) {
                        if (jsonText.trim().startsWith("[")) {
                            JSONArray events = new JSONArray(jsonText);
                            for (int i = 0; i < events.length(); i++) {
                                addMatchFromJson(events.getJSONObject(i), matchesMap);
                            }
                        } else {
                            JSONObject event = new JSONObject(jsonText);
                            addMatchFromJson(event, matchesMap);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error procesando JSON-LD: " + e.getMessage());
                }
            }

            // Luego procesamos los resultados del HTML (partidos jugados)
            Elements matchRows = doc.select("tr:has(td.local)");
            for (Element row : matchRows) {
                try {
                    String homeTeam = row.select("td.local span[class^=equipo]").text();
                    String awayTeam = row.select("td.visitante span[class^=equipo]").text();
                    String result = row.select("td.resultado span.resultado-partido").text();
                    
                    String matchKey = homeTeam + " - " + awayTeam;
                    Match match = matchesMap.get(matchKey);
                    
                    if (match != null) {
                        // Actualizar partido existente con el resultado
                        match.setScore(result);
                    } else {
                        // Crear nuevo partido para resultado existente
                        match = new Match();
                        match.setHomeTeam(homeTeam);
                        match.setAwayTeam(awayTeam);
                        match.setScore(result);
                        matchesMap.put(matchKey, match);
                    }
                    
                    // Añadir URLs de los escudos
                    String homeTeamLogoUrl = row.select("td.local img").attr("src");
                    String awayTeamLogoUrl = row.select("td.visitante img").attr("src");
                    match.setHomeTeamLogoUrl(homeTeamLogoUrl);
                    match.setAwayTeamLogoUrl(awayTeamLogoUrl);
                    
                } catch (Exception e) {
                    System.out.println("Error procesando fila HTML: " + e.getMessage());
                }
            }

            if (matchesMap.isEmpty()) {
                System.out.println("No se encontraron partidos");
            } else {
                System.out.println("Se encontraron " + matchesMap.size() + " partidos");
            }
            
        } catch (IOException e) {
            System.err.println("Error de conexión: " + e.getMessage());
            e.printStackTrace();
        }
        
        return new ArrayList<>(matchesMap.values());
    }

    private void addMatchFromJson(JSONObject event, Map<String, Match> matchesMap) {
        if (event.getString("@type").equals("SportsEvent")) {
            try {
                Match match = new Match();
                
                // Equipos
                String homeTeam = event.getJSONObject("homeTeam").getString("name");
                String awayTeam = event.getJSONObject("awayTeam").getString("name");
                match.setHomeTeam(homeTeam);
                match.setAwayTeam(awayTeam);
                
                // Fecha y hora
                String startDate = event.getString("startDate");
                Instant instant = Instant.parse(startDate);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                    .withZone(ZoneId.of("Europe/Madrid"));
                match.setDate(formatter.format(instant));
                
                // Estadio
                if (event.has("location")) {
                    String stadium = event.getJSONObject("location").getString("name");
                    match.setStadium(stadium);
                }
                
                // Guardar en el mapa usando la combinación de equipos como clave
                String matchKey = homeTeam + " - " + awayTeam;
                matchesMap.put(matchKey, match);
                
            } catch (Exception e) {
                System.out.println("Error procesando partido del JSON-LD: " + e.getMessage());
            }
        }
    }
}
