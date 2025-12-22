package org.example;

import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;

// Alomia Johan
public class MainExamenReactivo {

    public static void main(String[] args) {

        System.out.println("========================================");
        System.out.println("EXAMEN - PESOS JOHAN ALOMIA");
        System.out.println("========================================");

        pesosPublisherJohanAlomia();

        // Mantener la app viva para flujo asíncrono
        try {
            Thread.sleep(15000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    // Johan Alomia
    private static void pesosPublisherJohanAlomia() {

        //Publisher (20 valores) NOMBRE: JOHAN ALOMIA
        List<Double> pesosJohanAlomia = List.of(1.0, 2.5, 3.0, 4.0, 5.5,6.0, 7.2, 8.0, 9.4, 10.0,
                11.8, 12.0, 13.6, 14.0, 55.3,
                16.7, 37.0, 18.5, 19.0, 22.0 // provoca error
        );

        Flux<Double> flujoPesos = Flux.fromIterable(pesosJohanAlomia)
                // 2) Flujo asíncrono NOMBRE: JOHAN ALOMIA
                .delayElements(Duration.ofMillis(300))

                // Filtrado de PESOS válidos NOMBRE: JOHAN ALOMIA
                .filter(peso -> {
                    if (peso < 3.0) {
                        System.out.println("JohanAlomia: Paquete descartado (<3kg): " + peso);
                    }
                    return peso >= 3.0;
                })

                // Error: paquete prohibido NOMBRE: JOHAN ALOMIA
                .map(peso -> {
                    if (peso > 20.0) {
                        throw new RuntimeException(
                                "JohanAlomia: Peso no válido (>20kg): " + peso
                        );
                    }
                    return peso;
                })

                // Transformación: cálculo de costo NOMBRE: JOHAN ALOMIA
                .map(peso -> {
                    double costo = peso * 1.25;
                    System.out.println(
                            "JohanAlomia: Transformación -> Peso: " + peso +
                                    " kg -> Costo: $" + costo
                    );
                    return costo;
                })

                // Recuperación del error NOMBRE: JOHAN ALOMIA
                .onErrorResume(err -> {
                    System.err.println("JohanAlomia: Error detectado: " + err.getMessage());
                    System.err.println("JohanAlomia: Recuperando con costos");
                    return Flux.just(10.0, 12.5, 15.0, 17.5);
                })

                .doOnComplete(() ->
                        System.out.println("JohanAlomia: onComplete - Flujo de pesos finalizado")
                );

        // 7) Subscriber personalizado con backpressure NOMBRE: JOHAN ALOMIA
        flujoPesos.subscribe(new SubscriberPaquetes(2));
    }
}
