# Java 17
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar el JAR desde la etapa de construcción
COPY ./target/ms-catalogo-0.0.1-SNAPSHOT.jar ./app.jar

# Exponer el puerto
EXPOSE 8081

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
