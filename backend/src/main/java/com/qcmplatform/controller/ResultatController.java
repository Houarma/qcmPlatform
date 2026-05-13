package com.qcmplatform.controller;

import com.qcmplatform.dto.request.ResultatRequest;
import com.qcmplatform.dto.response.ResultatResponse;
import com.qcmplatform.entity.User;
import com.qcmplatform.service.interfaces.ResultatServiceI;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultats")
@RequiredArgsConstructor
public class ResultatController {

    private final ResultatServiceI resultatService;

    // Soumettre un test (etudiant)
    @PostMapping
    public ResponseEntity<ResultatResponse> soumettre(
            @Valid @RequestBody ResultatRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resultatService.soumettre(request, user.getFirebaseUid()));
    }

    // Historique de l'etudiant connecte
    @GetMapping("/mes-resultats")
    public ResponseEntity<List<ResultatResponse>> getMesResultats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(resultatService.findByEtudiant(user.getFirebaseUid()));
    }

    // Resultats d'une evaluation (enseignant)
    @GetMapping("/evaluation/{evaluationId}")
    public ResponseEntity<List<ResultatResponse>> getByEvaluation(@PathVariable Long evaluationId) {
        return ResponseEntity.ok(resultatService.findByEvaluation(evaluationId));
    }
}
