package ec.espe.msinventario.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "inventario_sucursal")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventarioSucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

    @Column(name = "id_medicamento", nullable = false)
    private Long idMedicamento;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "fecha_actualizacion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaActualizacion = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = new Date();
    }
}
