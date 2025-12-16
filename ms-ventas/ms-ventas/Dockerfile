# Java 17
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copiar el JAR desde la etapa de construcción
COPY ./target/ms-ventas-0.0.1-SNAPSHOT.jar ./app.jar

# Exponer el puerto
EXPOSE 8083

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]