# PRD — Nodo
### Tracker de ideas para desarrolladores

**Versión:** 1.0
**Fecha:** Julio 2026
**Autor:** Cristhian
**Estado del documento:** Consolidado para desarrollo

---

## 1. Resumen ejecutivo

**Nodo** es una aplicación web minimalista para capturar ideas de forma instantánea (texto o voz) y llevarlas a través de un pipeline simple hasta convertirlas en un MVP en desarrollo. Está pensada para desarrolladores y personas con flujo constante de ideas que necesitan un lugar sin fricción para anotarlas, sin que la herramienta compita con sus procesos reales de planificación (PRDs, Notion, etc.).

Nodo no pretende ser un gestor de proyectos ni un segundo cerebro completo. Su única función es resolver un problema puntual: **capturar rápido, decidir después.**

---

## 2. Problema

Las ideas surgen en momentos inconvenientes (mientras se camina, se conduce, se está en otra tarea) y se pierden si no hay una forma inmediata de anotarlas. Las herramientas existentes (notas, Notion, apps de tareas) suelen tener demasiada fricción para una captura de 5 segundos, o están sobrecargadas de funciones que no aportan al momento de simplemente "anotar y seguir".

## 3. Objetivo del producto

Ofrecer una herramienta de captura de ideas ultra-minimalista que:
- Permita anotar una idea en segundos (texto o voz).
- Visualice el estado de todas las ideas en un pipeline simple.
- No imponga estructura innecesaria mientras la idea sigue siendo solo una idea.
- Marque visualmente cuándo una idea pasó a ser un MVP activo.

## 4. Usuario objetivo

- Desarrolladores independientes o en equipos pequeños con alto volumen de ideación.
- Personas con un patrón de "muchas ideas, pocas ejecutadas" que buscan un filtro simple de priorización.
- Usuarios que valoran el minimalismo visual y la velocidad de captura por sobre la funcionalidad extensa.

## 5. Alcance del MVP

### Incluido
- Captura de ideas por texto y por voz (Web Speech API).
- Pipeline de 4 estados: **Lluvia de ideas → Validación → MVP → Descartada**.
- Transición libre entre estados (no lineal, sin restricciones de orden).
- Vista Dashboard (listado/tablero de ideas).
- Vista de Estadísticas (stats básicas del pipeline).
- Vista de Settings (tema, gestión de datos).
- Toggle de tema claro/oscuro.
- Persistencia 100% en localStorage (sin backend, sin cuentas, sin sync).

### Fuera de alcance (explícito)
- Sincronización entre dispositivos o navegadores.
- Autenticación / cuentas de usuario.
- Colaboración multiusuario.
- Backend, API o base de datos remota.
- Campos estructurados adicionales al mover una idea a estado MVP (la consolidación es solo un cambio de estado; el trabajo real de planificación del MVP ocurre fuera de la app).
- Transcripción de voz vía servicio externo (se usa exclusivamente la API nativa del navegador).

---

## 6. Modelo de datos

Entidad única: `Idea`. Todos los campos son opcionales excepto `id`, `estado` y `fechaCreacion`, que se generan automáticamente.

```typescript
interface Idea {
  id: string;              // UUID generado automáticamente
  titulo?: string;         // Opcional. Si no existe, la UI usa un extracto del campo "idea"
  idea?: string;            // Texto libre: la idea como tal
  problema?: string;        // Qué problema resuelve
  lugar?: string;           // Campo referencial, texto libre (no geolocalización)
  estado: EstadoIdea;       // Ver enum abajo
  fechaCreacion: string;    // ISO string, automático
  fechaActualizacion: string; // ISO string, se actualiza en cada cambio de estado
}

enum EstadoIdea {
  LLUVIA_DE_IDEAS = "lluvia_de_ideas",
  VALIDACION = "validacion",
  MVP = "mvp",
  DESCARTADA = "descartada"
}
```

**Nota de diseño:** se optó deliberadamente por una entidad plana sin sub-objetos condicionales por estado. Esto mantiene el modelo simple y evita que la app compita con herramientas de planificación más completas que el usuario ya usa fuera de Nodo.

---

## 7. Funcionalidades

### 7.1 Captura de idea
- Botón de acción rápida (siempre visible, tipo FAB o barra fija) para abrir el formulario de captura.
- Formulario con 4 campos, todos opcionales: título, idea, problema, lugar.
- Botón de dictado por voz junto al campo "idea" (y opcionalmente "problema"), usando `SpeechRecognition` / `webkitSpeechRecognition`.
  - Idioma de reconocimiento configurable (default: `es-ES` o `es-419`, ajustable en Settings).
  - Feedback visual mientras escucha (ej. indicador pulsante).
  - **Limitación conocida y aceptada:** soporte nativo sólido en Chrome/Edge; limitado o inexistente en Firefox y Safari desktop. Se debe mostrar un aviso no intrusivo si el navegador no soporta la API, degradando a solo texto sin romper el flujo.
- Al guardar, la idea nace en estado `LLUVIA_DE_IDEAS` por defecto.
- Guardado instantáneo en localStorage, sin pasos de confirmación adicionales.

### 7.2 Pipeline de estados
- Vista tipo Kanban o lista agrupada por estado (a definir en diseño de UI, ambas son válidas para el MVP).
- Cuatro columnas/grupos: Lluvia de ideas, Validación, MVP, Descartada.
- Transición de estado libre: cualquier idea puede moverse a cualquier estado, sin restricciones de secuencia (drag & drop o selector de estado).
- Cada estado tiene un acento de color distintivo (ver sección de diseño) para escaneo visual rápido.

### 7.3 Dashboard
- Vista principal al entrar a la app.
- Muestra el pipeline completo con conteo de ideas por estado.
- Acceso directo a captura rápida.
- Búsqueda/filtro simple por texto (opcional para MVP, deseable si el tiempo lo permite).

### 7.4 Estadísticas
- Total de ideas capturadas.
- Distribución por estado (cantidad y/o porcentaje).
- Ideas creadas por período (últimos 7/30 días) — gráfico simple de barras o línea.
- Tasa de conversión: % de ideas que llegaron a estado MVP vs. total.
- Tasa de descarte: % de ideas descartadas vs. total.

### 7.5 Settings
- Toggle de tema claro/oscuro (persistido en localStorage).
- Idioma del reconocimiento de voz.
- Exportar datos (JSON) — recomendado incluir aunque no se pidió explícitamente, dado que localStorage es volátil y no hay backup. *(Sugerencia a validar contigo, no es un requisito confirmado.)*
- Importar datos (JSON) — mismo motivo.
- Botón de reseteo/borrado total de datos, con confirmación.

---

## 8. Diseño y experiencia visual

- **Paleta base:** blanco y negro, minimalista.
- **Acentos de color:** permitidos, usados específicamente para diferenciar los 4 estados del pipeline visualmente (ej. un color por estado, manteniendo el resto de la UI en escala de grises).
- **Toggle de tema:** claro/oscuro, con persistencia de preferencia en localStorage.
- **Tipografía:** limpia, sans-serif, jerarquía tipográfica simple (sin exceso de pesos o tamaños).
- **Principio rector:** cada pantalla debe priorizar velocidad de captura y claridad de escaneo por sobre densidad de información.

---

## 9. Arquitectura técnica

| Capa | Tecnología |
|---|---|
| Frontend | React (Vite recomendado para setup rápido) |
| Estado | React Context o Zustand (evaluar según complejidad final) |
| Persistencia | localStorage (capa de abstracción tipo `storageService` para no acoplar componentes directamente a la API de localStorage) |
| Voz | Web Speech API (`SpeechRecognition` nativo del navegador) |
| Estilos | CSS Modules / Tailwind (a definir), variables CSS para theming claro/oscuro |
| Enrutamiento | React Router (3 vistas: Dashboard, Stats, Settings) |
| Hosting sugerido | Vercel / Netlify (estático, sin backend) |

**Decisión de arquitectura clave:** toda la persistencia vive en el cliente. No existe capa de red para datos de la aplicación. Esto es una limitación consciente y aceptada, no un descuido — prioriza simplicidad y velocidad de desarrollo sobre continuidad multi-dispositivo.

---

## 10. Métricas de éxito (para uso personal del producto)

- Tiempo de captura de una idea desde apertura del formulario: objetivo < 10 segundos.
- % de ideas que avanzan de "Lluvia de ideas" a algún otro estado (mide si el pipeline se usa realmente o se convierte en una lista muerta).
- Uso recurrente semanal (¿vuelves a abrir la app para anotar, o se abandona como muchas herramientas de productividad?).

---

## 11. Riesgos y consideraciones abiertas

- **Volatilidad de localStorage:** limpiar caché del navegador borra todos los datos. Se recomienda fuertemente implementar export/import JSON aunque no estaba en el alcance original — quedará marcado como sugerido, no confirmado, hasta que lo valides.
- **Soporte de voz inconsistente:** aceptado como limitación de v1; Chrome/Edge como navegadores objetivo principales.
- **Escalabilidad de datos:** localStorage tiene límite práctico (~5-10MB según navegador). Para el volumen esperado de un tracker personal de ideas esto no debería ser un problema, pero se documenta como límite conocido.

---

## 12. Fuera de alcance para versiones futuras (no v1)

- Sync multi-dispositivo (requeriría backend).
- Colaboración en equipo.
- Integración con herramientas externas (Notion, GitHub, etc.).
- Campos estructurados para la fase MVP (mini-PRD embebido) — evaluar solo si el uso real de la app lo demanda.

---

*Documento sujeto a revisión tras las primeras iteraciones de uso real.*