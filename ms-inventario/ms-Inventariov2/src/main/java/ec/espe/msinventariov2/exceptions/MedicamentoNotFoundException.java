package ec.espe.msinventariov2.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MedicamentoNotFoundException extends RuntimeException {
    public MedicamentoNotFoundException(String message) {
        super(message);
    }
}

