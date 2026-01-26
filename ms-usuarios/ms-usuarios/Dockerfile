# Usa una imagen base ligera y confiable con OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR compilado de la aplicación al contenedor
COPY ./target/ms-usuarios-0.0.1-SNAPSHOT.jar ./app.jar

# Expone el puerto 8084 para acceder a la aplicación
EXPOSE 8084

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
