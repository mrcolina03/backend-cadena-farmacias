FROM openjdk:17.0.2

WORKDIR /app

#Copia el archivo JAR de la aplicación al contenedor
COPY ./target/ms-inventario-0.0.1-SNAPSHOT.jar ./ms-inventario-0.0.1-SNAPSHOT.jar

#Expone el puerto 8001 para acceder a la aplicación
EXPOSE 8085

#Comando para ejecutar la aplicación
ENTRYPOINT ["java","-jar","ms-inventario-0.0.1-SNAPSHOT.jar"]

#docker build -t ms-inventario .
#docker run -d --name ms-inventario --network mi_red -p 8085:8085 ms-inventario