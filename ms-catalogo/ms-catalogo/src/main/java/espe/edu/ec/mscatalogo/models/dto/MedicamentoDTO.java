package espe.edu.ec.mscatalogo.models.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentoDTO {

    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Size(min = 3, max = 50, message = "El código debe tener entre 3 y 50 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 200, message = "El nombre debe tener entre 3 y 200 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no debe exceder 500 caracteres")
    private String descripcion;

    @NotBlank(message = "El laboratorio es obligatorio")
    @Size(min = 2, max = 100, message = "El laboratorio debe tener entre 2 y 100 caracteres")
    private String laboratorio;

    @Size(max = 200, message = "El principio activo no debe exceder 200 caracteres")
    private String principioActivo;

    @NotBlank(message = "La presentación es obligatoria")
    @Size(min = 2, max = 50, message = "La presentación debe tener entre 2 y 50 caracteres")
    private String presentacion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener máximo 8 dígitos enteros y 2 decimales")
    private BigDecimal precio;

    @NotNull(message = "Debe indicar si requiere receta")
    private Boolean requiereReceta;

    @Future(message = "La fecha de vencimiento debe ser futura")
    private LocalDate fechaVencimiento;

    private Boolean activo;

}