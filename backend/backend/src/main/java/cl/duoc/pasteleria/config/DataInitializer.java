package cl.duoc.pasteleria.config;

import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.ProductoRepository;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.admin.email:admin@tienda.cl}") private String adminEmail;
    @Value("${app.admin.password:123456}") private String adminPassword;

    public DataInitializer(ProductoRepository productoRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario(
                "Administrador", adminEmail, passwordEncoder.encode(adminPassword), "admin"
            ));
            usuarioRepository.save(new Usuario(
                "Cliente Prueba", "cliente@tienda.cl", passwordEncoder.encode("123456"), "cliente"
            ));
        }

        if (productoRepository.count() == 0) {
            productoRepository.saveAll(List.of(
                new Producto("Torta Selva Negra", 22990, "Tortas Tradicionales",
                    "Bizcocho de chocolate embebido en almíbar, relleno de mermelada de cereza, crema chantilly y trozos de cereza.",
                    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop"),
                new Producto("Torta Tres Leches", 19990, "Tortas Tradicionales",
                    "Bizcocho esponjoso remojado en mezcla de tres leches y cubierto con merengue italiano flameado.",
                    "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop"),
                new Producto("Pie de Limón", 14990, "Postres",
                    "Masa sableé crocante, rellenada con suave crema ácida de limón natural y coronada con merengue.",
                    "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop"),
                new Producto("Caja Dulces Surtidos", 12990, "Dulces Finos",
                    "Selección artesanal de 12 empolvados, chilenitos y alfajores de manjar.",
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop")
            ));
        }
    }
}