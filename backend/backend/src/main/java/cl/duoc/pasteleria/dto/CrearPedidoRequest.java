package cl.duoc.pasteleria.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CrearPedidoRequest(
        @NotEmpty(message = "El pedido debe incluir al menos un producto")
        @Size(max = 30, message = "El pedido no puede contener más de 30 productos distintos")
        List<@Valid Item> items,
        @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres")
        String observaciones
) {
    public record Item(
            @NotNull(message = "El producto es obligatorio")
            @Positive(message = "El identificador del producto no es válido")
            Long productoId,
            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad mínima es 1")
            @Max(value = 50, message = "La cantidad máxima por producto es 50")
            Integer cantidad
    ) {}
}
