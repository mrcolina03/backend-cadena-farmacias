package ec.espe.msinventariov2.models.entities;


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

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 0;

    @Column(name = "fecha_actualizacion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaActualizacion;

    @Column(nullable = false, length = 20)
    private String estado = "ACTIVO"; // ACTIVO o INACTIVO

    @PrePersist
    protected void onCreate() {
        fechaActualizacion = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = new Date();
    }
}
