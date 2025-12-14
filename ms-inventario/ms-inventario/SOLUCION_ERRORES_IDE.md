# Solución a los Errores "Cannot access/resolve" en IntelliJ IDEA

## Diagnóstico
El proyecto **compila correctamente con Maven** (`mvn clean install` funciona sin errores), pero IntelliJ IDEA muestra errores de "Cannot access" y "Cannot resolve symbol" para todas las clases que usan Lombok (`@Data`).

## Causa
El problema es que **Lombok no está configurado correctamente en IntelliJ IDEA**. Lombok genera código en tiempo de compilación (getters, setters, constructores, etc.), y el IDE necesita soporte especial para "ver" ese código generado.

## Solución Paso a Paso

### 1. Instalar el Plugin de Lombok en IntelliJ
1. Ve a **File → Settings** (o **IntelliJ IDEA → Preferences** en Mac)
2. En el panel izquierdo, selecciona **Plugins**
3. Busca "**Lombok**" en el campo de búsqueda
4. Si no está instalado, haz clic en **Install** para el plugin "Lombok"
5. Reinicia IntelliJ IDEA cuando te lo pida

### 2. Habilitar el Procesamiento de Anotaciones
1. Ve a **File → Settings** (Ctrl+Alt+S)
2. Navega a **Build, Execution, Deployment → Compiler → Annotation Processors**
3. **Marca la casilla**: ✅ **Enable annotation processing**
4. Asegúrate de que esté seleccionado: **Obtain processors from project classpath**
5. Haz clic en **Apply** y luego **OK**

### 3. Reimportar el Proyecto Maven
1. Haz clic derecho en el archivo `pom.xml` en el explorador de proyectos
2. Selecciona **Maven → Reload Project** (o **Reimport**)
3. Espera a que IntelliJ termine de indexar el proyecto

### 4. Invalidar Cachés y Reiniciar (Si aún hay errores)
1. Ve a **File → Invalidate Caches...**
2. En el diálogo, marca las opciones:
   - ✅ Invalidate and Restart
   - ✅ Clear file system cache and Local History
   - ✅ Clear downloaded shared indexes
3. Haz clic en **Invalidate and Restart**
4. IntelliJ se reiniciará automáticamente

### 5. Reconstruir el Proyecto
Después de reiniciar:
1. Ve a **Build → Rebuild Project**
2. Espera a que termine la compilación

## Verificación
Después de seguir todos los pasos, los errores deberían desaparecer. Verifica que:
- ✅ Los imports de `InventarioSucursalDTO` y `SucursalDTO` se resuelven correctamente
- ✅ Los imports de `InventarioSucursalService` y `SucursalService` se resuelven correctamente
- ✅ No hay errores rojos en los controladores

## Notas Adicionales
- El proyecto **ya está configurado correctamente** en el `pom.xml` con:
  - Dependencia de Lombok
  - Configuración del procesador de anotaciones en maven-compiler-plugin
- Maven compila sin errores, confirmando que el código es correcto
- El problema es **solo del IDE** (IntelliJ IDEA)

## Si el Problema Persiste
Si después de seguir todos los pasos aún hay errores:

1. Verifica que la versión de Lombok en el `pom.xml` sea compatible con tu versión de IntelliJ
2. Asegúrate de que estás usando Java 17 (configurado en el `pom.xml`)
3. Verifica que el JDK configurado en IntelliJ sea Java 17
4. Intenta ejecutar `mvn clean install` desde la terminal de IntelliJ y verifica que compile sin errores

## Comando de Verificación Maven
Para verificar que el proyecto compila correctamente:
```bash
mvn clean install -DskipTests
```

Si este comando termina con **BUILD SUCCESS**, el código está bien y el problema es solo del IDE.

