package com.qcmplatform.dto.ml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class QuestionGeneree {
    private String contenu;
    private List<OptionGeneree> options;

    @JsonProperty("bonne_reponse")
    private String bonneReponse;

    @Data
    public static class OptionGeneree {
        private String label;
        private String contenu;

        @JsonProperty("est_correcte")
        private boolean estCorrecte;
    }
}
