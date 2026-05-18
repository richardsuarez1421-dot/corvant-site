# Sitio web de Corvant — versión 5.2

## Cómo abrirlo

1. **Extrae el ZIP completo** a una carpeta (Escritorio, Documentos…)
2. Doble click en `index.html`
3. Ábrelo en **Chrome o Firefox**

---

## Cambios en esta versión (5.2)

### Nuevas funcionalidades
- **Botón flotante de WhatsApp** en la esquina inferior derecha de todas las páginas. Animación de pulso sutil, tooltip "Hablemos" al hover, abre WhatsApp en `+593 978 675 210` con mensaje pre-cargado.
- **Menú móvil funcional** — al tocar el hamburger se abre un overlay full-screen con fondo blur. El hamburger se anima a "X". Al tocar un link, se cierra. Funciona también con tecla Esc.

### Nuevas páginas (6 adicionales)
- `404.html` — Página no encontrada
- `error.html` — Error general (500)
- `gracias.html` — Confirmación post-formulario (los forms ahora apuntan aquí)
- `mantenimiento.html` — Mantenimiento programado
- `politica-privacidad.html` — Política completa LOPDP con ARCO+
- `terminos-condiciones.html` — Términos legales de uso y servicios

Todas mantienen identidad visual (Denton + NN Grotesk + wordmark + warm orange glow).

### Cambios visuales en páginas existentes
- "Cuatro principios" → **"Seis principios"** en Nosotros
- Comillas eliminadas de la sección "Lo que escuchamos casi siempre"
- Las **3 tarjetas de servicio ahora son oscuras** con badge "El más popular" arriba
- **Imagen nueva** en la sección "Cómo trabajamos" (diferenciador) — la imagen oficial que enviaste
- Footer ahora enlaza a las páginas legales reales

### Mejoras de legibilidad
- Fuente del menú superior ligeramente más grande (0.875rem → 0.95rem)
- `line-height` del body de 1.6 → 1.65
- `letter-spacing` sutil de 0.005em en el body para mejor lectura en pantalla

---

## Estructura final

```
corvant-site/
├── index.html
├── servicios.html
├── servicios-programa-esencial.html
├── servicios-programa-integral-salud.html
├── servicios-dpo-externo.html
├── nosotros.html
├── auditoria-gratuita.html
├── contacto.html
├── 404.html                              ← nuevo
├── error.html                            ← nuevo
├── gracias.html                          ← nuevo
├── mantenimiento.html                    ← nuevo
├── politica-privacidad.html              ← nuevo
├── terminos-condiciones.html             ← nuevo
├── styles.css
├── scripts.js                            (con WhatsApp + mobile menu)
├── fonts/                                10 OTFs oficiales
└── images/                               + diff-section.jpg
```

## Probar el menú móvil

En Chrome: abrir DevTools (F12) → activar vista responsive (Ctrl+Shift+M) → seleccionar un dispositivo móvil → tocar el hamburger.
