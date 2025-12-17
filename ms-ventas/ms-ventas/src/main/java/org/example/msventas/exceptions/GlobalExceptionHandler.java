package org.example.msventas.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Object> buildResponse(
            HttpStatus status, String mensaje) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", mensaje);

        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Object> handleNotFound(RecursoNoEncontradoException ex) {
        logger.warn("Recurso no encontrado: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DatosInvalidosException.class)
    public ResponseEntity<Object> handleBadRequest(DatosInvalidosException ex) {
        logger.warn("Datos inválidos: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<String> manejarStock(StockInsuficienteException ex) {
        logger.warn("Stock insuficiente: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ServicioExternoException.class)
    public ResponseEntity<Object> handleExternal(ServicioExternoException ex) {
        logger.error("Servicio externo falló: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        // Log completo del stacktrace para diagnóstico
        logger.error("Error interno del servidor: {}", ex.getMessage(), ex);
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno del servidor: " + ex.getMessage()
        );
    }
}
