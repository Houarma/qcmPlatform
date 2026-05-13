package com.qcmplatform.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseResponse {
    private Long evaluationId;
    private double scoreMoyen;
    private int nbEtudiants;
    private Map<String, Double> tauxEchecParQuestion;
    private List<GroupeEtudiant> groupes;
    private List<DifficulteQuestion> difficultes;
    private List<LacuneInfo> lacunes;

    @Data
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroupeEtudiant {
        private String niveau;
        private List<String> etudiants;
        private double scoreMoyenGroupe;
    }

    @Data
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DifficulteQuestion {
        private Long questionId;
        private double tauxEchec;
        private String classification;
    }

    @Data
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LacuneInfo {
        private Long questionId;
        private double tauxEchec;
        private String description;
    }
}
