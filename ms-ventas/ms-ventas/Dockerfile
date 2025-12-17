# Java 17
FROM eclipse-temurin:21

WORKDIR /app

# Copiar el JAR generado
COPY ./target/ms-ventas-0.0.1-SNAPSHOT.jar ./app.jar

# Exponer el puerto del microservicio
EXPOSE 8083

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
