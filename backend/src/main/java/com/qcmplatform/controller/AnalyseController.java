package com.qcmplatform.controller;

import com.qcmplatform.dto.response.AnalyseResponse;
import com.qcmplatform.service.interfaces.MlClientServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class AnalyseController {

    private final MlClientServiceI mlClientService;

    // Analyse ML des lacunes pour une evaluation (enseignant)
    @GetMapping("/{evaluationId}")
    public ResponseEntity<AnalyseResponse> analyser(@PathVariable Long evaluationId) {
        return ResponseEntity.ok(mlClientService.analyser(evaluationId));
    }
}
