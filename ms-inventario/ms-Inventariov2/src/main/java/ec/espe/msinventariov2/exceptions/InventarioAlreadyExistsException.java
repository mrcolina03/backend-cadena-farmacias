package ec.espe.msinventariov2.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InventarioAlreadyExistsException extends RuntimeException {
    public InventarioAlreadyExistsException(String message) {
        super(message);
    }
}

