package ec.edu.espe.oauthserver.oauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();

        // ✅ Permitir tu frontend
        cors.setAllowedOrigins(List.of("http://localhost:5173"));

        // ✅ Métodos necesarios (incluye OPTIONS)
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Headers
        cors.setAllowedHeaders(List.of("*"));

        // ✅ Si hay cookies/sesión (en login) puede ser útil
        cors.setAllowCredentials(true);

        // ✅ Cache preflight
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
