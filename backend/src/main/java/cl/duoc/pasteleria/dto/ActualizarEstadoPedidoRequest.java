package cl.duoc.pasteleria.dto;

import cl.duoc.pasteleria.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record ActualizarEstadoPedidoRequest(
        @NotNull(message = "Debes indicar el nuevo estado del pedido")
        EstadoPedido estado
) {}
