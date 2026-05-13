package com.qcmplatform.controller;

import com.qcmplatform.dto.request.EvaluationRequest;
import com.qcmplatform.dto.request.PromptUpdateRequest;
import com.qcmplatform.dto.response.EvaluationResponse;
import com.qcmplatform.entity.User;
import com.qcmplatform.service.interfaces.EvaluationServiceI;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationServiceI evaluationService;

    // Liste des evaluations publiees (etudiants + enseignants)
    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> getAllPubliees() {
        return ResponseEntity.ok(evaluationService.findAllPubliees());
    }

    // Evaluations de l'enseignant connecte
    @GetMapping("/mes-evaluations")
    public ResponseEntity<List<EvaluationResponse>> getMesEvaluations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(evaluationService.findByEnseignant(user.getFirebaseUid()));
    }

    // Detail d'une evaluation
    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.findById(id));
    }

    // Creer une evaluation avec generation IA
    @PostMapping
    public ResponseEntity<EvaluationResponse> creer(
            @Valid @RequestBody EvaluationRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluationService.creer(request, user.getFirebaseUid()));
    }

    // Modifier le prompt avant publication
    @PutMapping("/{id}/prompt")
    public ResponseEntity<EvaluationResponse> updatePrompt(
            @PathVariable Long id,
            @Valid @RequestBody PromptUpdateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(evaluationService.updatePrompt(id, request, user.getFirebaseUid()));
    }

    // Publier une evaluation
    @PostMapping("/{id}/publier")
    public ResponseEntity<EvaluationResponse> publier(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(evaluationService.publier(id, user.getFirebaseUid()));
    }
}
