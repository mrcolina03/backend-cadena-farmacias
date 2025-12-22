package org.example;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

//JohanAlomia
public class SubscriberPaquetes implements Subscriber<Double> {
    private final int batchSize;
    private Subscription subscription;
    private int procesados = 0;

    public SubscriberPaquetes(int batchSize) {
        this.batchSize = batchSize;
    }

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        System.out.println("Johan Alomia -> onSubscribe: Suscripción iniciada");
        System.out.println("Johan Alomia -> Solicitando " + batchSize + " paquetes...");
        subscription.request(batchSize);
    }

    @Override
    public void onNext(Double costo) {
        procesados++;
        System.out.println(
                "Johan Alomia = onNext: Costo recibido $" + costo +
                        " | Total procesados: " + procesados
        );

        if (procesados % batchSize == 0) {
            System.out.println(
                    "Johan Alomia = Solicitando siguiente lote de "
                            + batchSize + " paquetes..."
            );
            subscription.request(batchSize);
        }
    }

    @Override
    public void onError(Throwable throwable) {
        System.err.println(
                "Johan Alomia = onError: Error -> " + throwable.getMessage()
        );
    }

    @Override
    public void onComplete() {
        System.out.println(
                "Johan Alomia = onComplete: Procesamiento finalizado correctamente."
        );
    }
}
