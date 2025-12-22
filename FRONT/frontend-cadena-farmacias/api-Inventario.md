# Documentación de la API - Microservicio de Inventario

Este documento detalla los endpoints disponibles en el microservicio de inventario (`ms-inventario`).

base de url
http://localhost:8082
---

## 1. Sucursal Controller (`/api/inventario/sucursales`)

### 1.1 Listar Todas las Sucursales
- **Endpoint:** `GET /todas`
- **Descripción:** Devuelve una lista de todas las sucursales, sin importar su estado (activas o inactivas).
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Sucursal Norte",
      "direccion": "Av. Principal 123",
      "ciudad": "Quito",
      "estado": "ACTIVO"
    },
    {
      "id": 2,
      "nombre": "Sucursal Sur (Cerrada)",
      "direccion": "Calle Secundaria 456",
      "ciudad": "Guayaquil",
      "estado": "INACTIVO"
    }
  ]
  ```

### 1.2 Listar Sucursales Inactivas
- **Endpoint:** `GET /inactivas`
- **Descripción:** Devuelve una lista de las sucursales que han sido desactivadas (eliminación lógica).
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 2,
      "nombre": "Sucursal Sur (Cerrada)",
      "direccion": "Calle Secundaria 456",
      "ciudad": "Guayaquil",
      "estado": "INACTIVO"
    }
  ]
  ```

### 1.3 Obtener Sucursal por ID
- **Endpoint:** `GET /{id}`
- **Descripción:** Busca y devuelve una sucursal específica por su ID.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "nombre": "Sucursal Norte",
    "direccion": "Av. Principal 123",
    "ciudad": "Quito",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `404 Not Found`: Si no se encuentra una sucursal con el ID proporcionado.

### 1.4 Crear Nueva Sucursal
- **Endpoint:** `POST /`
- **Descripción:** Crea una nueva sucursal.
- **Cuerpo de la Petición:**
  ```json
  {
    "nombre": "Sucursal Cumbayá",
    "direccion": "Av. Interoceánica",
    "ciudad": "Quito"
  }
  ```
- **Validaciones:**
  - `nombre`: No puede estar vacío y debe tener un máximo de 100 caracteres.
  - `direccion`, `ciudad`: Máximo 250 caracteres.
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "id": 3,
    "nombre": "Sucursal Cumbayá",
    "direccion": "Av. Interoceánica",
    "ciudad": "Quito",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si los datos enviados no pasan las validaciones.

### 1.5 Actualizar Sucursal
- **Endpoint:** `PUT /{id}`
- **Descripción:** Actualiza los datos de una sucursal existente.
- **Cuerpo de la Petición:**
  ```json
  {
    "nombre": "Sucursal Norte (Renovada)",
    "direccion": "Avenida Principal 123",
    "ciudad": "Quito"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "nombre": "Sucursal Norte (Renovada)",
    "direccion": "Avenida Principal 123",
    "ciudad": "Quito",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `404 Not Found`: Si la sucursal no existe.
  - `400 Bad Request`: Si los datos no son válidos.

### 1.6 Eliminar Sucursal (Lógica)
- **Endpoint:** `DELETE /{id}`
- **Descripción:** Realiza una eliminación lógica de la sucursal, cambiando su estado a `INACTIVO`. También desactiva todo el inventario asociado a ella.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (204 No Content):** Cuerpo vacío.
- **Respuestas de Error:**
  - `404 Not Found`: Si la sucursal no existe.

### 1.7 Activar Sucursal
- **Endpoint:** `PATCH /{id}/activar`
- **Descripción:** Reactiva una sucursal que estaba inactiva. Cambia su estado a `ACTIVO` y reactiva su inventario.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 2,
    "nombre": "Sucursal Sur (Cerrada)",
    "direccion": "Calle Secundaria 456",
    "ciudad": "Guayaquil",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `404 Not Found`: Si la sucursal no existe.

---

## 2. Inventario Sucursal Controller (`/api/inventario/inventario-sucursal`)

### 2.1 Listar Todo el Inventario
- **Endpoint:** `GET /`
- **Descripción:** Devuelve una lista de todos los registros de inventario de todas las sucursales.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "idSucursal": 1,
      "idMedicamento": 101,
      "cantidad": 50,
      "stockMinimo": 10,
      "fechaActualizacion": "2025-12-14T21:00:00.000+00:00",
      "estado": "ACTIVO"
    }
  ]
  ```

### 2.2 Listar Inventario por Sucursal (Detallado)
- **Endpoint:** `GET /sucursal/{sucursalId}/detallado`
- **Descripción:** Devuelve una lista de medicamentos para una sucursal específica, incluyendo los detalles completos del medicamento (obtenidos del microservicio de catálogo) y la información del inventario.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "idMedicamento": 101,
      "codigo": "MED-001",
      "nombre": "Paracetamol 500mg",
      "descripcion": "Analgésico y antipirético.",
      "laboratorio": "Genfar",
      "principioActivo": "Paracetamol",
      "presentacion": "Caja x 20 tabletas",
      "precio": 2.50,
      "requiereReceta": false,
      "fechaVencimiento": "2026-12-31",
      "idInventario": 1,
      "cantidad": 50,
      "stockMinimo": 10,
      "estadoInventario": "ACTIVO",
      "fechaActualizacion": "2025-12-14T21:00:00.000+00:00"
    }
  ]
  ```
- **Respuestas de Error:**
  - `404 Not Found`: Si la sucursal no existe.

### 2.3 Agregar Stock a Sucursal
- **Endpoint:** `POST /`
- **Descripción:** Agrega un nuevo medicamento al inventario de una sucursal.
- **Cuerpo de la Petición:**
  ```json
  {
    "idSucursal": 1,
    "idMedicamento": 102,
    "cantidad": 30,
    "stockMinimo": 5
  }
  ```
- **Validaciones:**
  - `idSucursal`, `idMedicamento`, `cantidad`, `stockMinimo`: No pueden ser nulos.
  - La `cantidad` no puede ser menor que el `stockMinimo`.
  - El `idMedicamento` debe existir en el microservicio de catálogo.
  - El medicamento no debe existir previamente en el inventario de esa sucursal.
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "id": 2,
    "idSucursal": 1,
    "idMedicamento": 102,
    "cantidad": 30,
    "stockMinimo": 5,
    "fechaActualizacion": "2025-12-14T21:05:00.000+00:00",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si los datos no pasan las validaciones (`cantidad < stockMinimo`).
  - `404 Not Found`: Si el `idMedicamento` no se encuentra en el catálogo.
  - `409 Conflict`: Si el medicamento ya existe en el inventario de esa sucursal.

### 2.4 Actualizar Stock
- **Endpoint:** `PUT /{inventarioId}`
- **Descripción:** Actualiza la cantidad de un medicamento en el inventario.
- **Parámetros de la Petición:** `?cantidad=45`
- **Cuerpo de la Petición:** Ninguno.
- **Validaciones:**
  - La nueva `cantidad` no puede ser menor que el `stockMinimo` del registro.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "idSucursal": 1,
    "idMedicamento": 101,
    "cantidad": 45,
    "stockMinimo": 10,
    "fechaActualizacion": "2025-12-14T21:10:00.000+00:00",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si `cantidad < stockMinimo`.
  - `404 Not Found`: Si el registro de inventario no existe.

### 2.5 Eliminar Inventario (Lógica)
- **Endpoint:** `DELETE /logico/{id}`
- **Descripción:** Realiza una eliminación lógica del registro de inventario, cambiando su estado a `INACTIVO`.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (204 No Content):** Cuerpo vacío.
- **Respuestas de Error:**
  - `404 Not Found`: Si el registro de inventario no existe.

### 2.6 Eliminar Inventario (Física)
- **Endpoint:** `DELETE /fisico/{id}`
- **Descripción:** Elimina permanentemente el registro de inventario de la base de datos. **¡Usar con precaución!**
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (204 No Content):** Cuerpo vacío.
- **Respuestas de Error:**
  - `404 Not Found`: Si el registro de inventario no existe.

### 2.7 Activar Inventario
- **Endpoint:** `PATCH /activar/{id}`
- **Descripción:** Reactiva un registro de inventario que estaba inactivo.
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "idSucursal": 1,
    "idMedicamento": 101,
    "cantidad": 45,
    "stockMinimo": 10,
    "fechaActualizacion": "2025-12-14T21:15:00.000+00:00",
    "estado": "ACTIVO"
  }
  ```
- **Respuestas de Error:**
  - `404 Not Found`: Si el registro de inventario no existe.

