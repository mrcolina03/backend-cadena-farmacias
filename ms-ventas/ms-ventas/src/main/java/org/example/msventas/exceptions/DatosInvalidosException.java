package org.example.msventas.exceptions;

public class DatosInvalidosException extends RuntimeException {
    public DatosInvalidosException(String mensaje) {
        super(mensaje);
    }
}
