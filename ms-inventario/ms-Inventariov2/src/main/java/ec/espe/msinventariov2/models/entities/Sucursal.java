package ec.espe.msinventariov2.models.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sucursal")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 250)
    private String direccion;

    @Column(length = 250)
    private String ciudad;

    @Column(nullable = false, length = 20)
    private String estado = "ACTIVO"; // ACTIVO o INACTIVO
}
