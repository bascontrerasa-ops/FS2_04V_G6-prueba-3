package cl.duoc.pasteleria.dto;

public record DetallePedidoResponse(
        Long id,
        Long productoId,
        String nombreProducto,
        Long precioUnitario,
        Integer cantidad,
        Long subtotal
) {}
