package cl.duoc.pasteleria.dto;

import cl.duoc.pasteleria.model.EstadoPedido;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        LocalDateTime fechaCreacion,
        EstadoPedido estado,
        Long total,
        String observaciones,
        String clienteNombre,
        String clienteEmail,
        List<DetallePedidoResponse> detalles
) {}
