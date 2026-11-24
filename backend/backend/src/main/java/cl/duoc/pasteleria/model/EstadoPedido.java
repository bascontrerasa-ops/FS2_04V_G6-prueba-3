package cl.duoc.pasteleria.model;

/** Estados que puede tomar un pedido durante su preparación y entrega. */
public enum EstadoPedido {
    PENDIENTE,
    CONFIRMADO,
    EN_PREPARACION,
    LISTO,
    ENTREGADO,
    CANCELADO
}
