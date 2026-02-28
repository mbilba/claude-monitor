# 📱 Tips para iPhone Kiosco

Configuraciones avanzadas para convertir tu iPhone viejo en una maquinita de monitoreo profesional.

## 🔋 Optimización de Batería

### Para uso con cargador permanente:
1. **Settings → Battery → Battery Health & Charging**:
   - Desactiva "Optimized Battery Charging" 
   - Esto evita que iOS "aprenda" patrones de carga

2. **Temperatura**: Mantén el iPhone fresco
   - Evita luz solar directa
   - Considera un pequeño ventilador USB si se calienta

### Para uso sin cargador (batería):
1. **Reduce el brillo al mínimo funcional (30-40%)**
2. **Settings → General → Background App Refresh**: OFF
3. **Settings → Privacy & Security → Location Services**: OFF
4. **Settings → General → AirDrop**: OFF

## 📺 Display y Visual

### Evitar burn-in en pantalla:
```css
/* En index.html, puedes agregar animaciones sutiles */
.container {
    animation: subtle-shift 300s infinite;
}

@keyframes subtle-shift {
    0%, 100% { transform: translate(0px, 0px); }
    25% { transform: translate(1px, 0px); }
    50% { transform: translate(0px, 1px); }
    75% { transform: translate(-1px, 0px); }
}
```

### Orientación forzada:
- El CSS ya incluye optimizaciones para landscape
- Si quieres forzar orientación, puedes agregar:
```html
<meta name="apple-mobile-web-app-orientation-lock" content="landscape">
```

## 🔒 Modo Kiosco "Profesional"

### Usando Guided Access (iOS Built-in):
1. **Settings → Accessibility → Guided Access**: ON
2. **Set Passcode**: Usa algo simple que recuerdes
3. **En Claude Monitor app**: Triple-click home button
4. **Start Guided Access**: Bloquea touch en áreas específicas
5. **Para salir**: Triple-click home button + passcode

### Shortcuts Automation:
1. **Shortcuts app → Create Personal Automation**
2. **Trigger**: "App Opened" → Safari/Chrome
3. **Action**: "Open URL" → tu claude monitor
4. **Run automatically**: ON

## 📊 Monitoring del Monitor

### Crear alertas si el monitor falla:
```javascript
// Agregar al final del script en index.html
let failCount = 0;
const originalFetchUsage = fetchUsage;

fetchUsage = async function() {
    try {
        await originalFetchUsage();
        failCount = 0;
    } catch (error) {
        failCount++;
        if (failCount >= 3) {
            // Vibra si falla 3 veces seguidas
            navigator.vibrate && navigator.vibrate([200, 100, 200]);
        }
        throw error;
    }
};
```

## 🎨 Variantes de Color

### Tema Verde Matrix:
```css
body { color: #00ff00; }
.usage-fill { background: linear-gradient(90deg, #00ff00, #00cc00); }
.title { text-shadow: 0 0 10px #00ff00; }
```

### Tema Azul Cyberpunk:
```css
body { color: #00bfff; }
.usage-fill { background: linear-gradient(90deg, #00bfff, #0080ff); }
.title { text-shadow: 0 0 10px #00bfff; }
```

### Tema Rojo Alerta:
```css
body { color: #ff4444; }
.usage-fill { background: linear-gradient(90deg, #ff4444, #ff6666); }
.title { text-shadow: 0 0 10px #ff4444; }
```

## 📱 Soporte Multi-Device

### Para iPad:
```css
@media screen and (min-width: 768px) {
    .container { padding: 40px; }
    .title { font-size: 32px; }
    .usage-bar { width: 200px; height: 12px; }
}
```

### Para Apple Watch (experimental):
- Crea una versión ultra-minimalista
- Solo mostrar el porcentaje más crítico
- Usar complications si tienes Apple Watch dev

## 🔊 Audio Alerts

### Agregar sonidos de alerta:
```javascript
// Alerta cuando usage > 80%
function checkAlerts(data) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (data.five_hour?.utilization > 80) {
        // Crea un beep simple
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}
```

## 💡 Ideas Avanzadas

### Dashboard Multi-Servicio:
- Agregar otros APIs (GitHub usage, Vercel bandwidth, etc.)
- Usar tabs o carousel para alternar vistas

### Historical Tracking:
- Guardar datos en localStorage
- Mostrar gráficos simples con Canvas API
- Export CSV de historical data

### Remote Control:
- Agregar endpoints para cambiar colores/temas remotamente
- WebSockets para updates instantáneos
- Control parental (pause/resume monitoring)

---

## 🛠 Hardware Recommendations

### Accesorios útiles:
- **Stand ajustable**: Para ángulo perfecto de visión
- **Cable largo**: Lightning/USB-C de 2+ metros  
- **Hub USB**: Si quieres agregar ventilador o luz
- **Protector pantalla**: Anti-glare para mejor visión

### iPhone models recomendados:
- **iPhone 7+**: Ideal balance tamaño/performance
- **iPhone X/XS**: Si quieres pantalla OLED
- **iPhone SE**: Compact pero funcional
- **Evitar**: iPhone 6 y menor (muy lento para JS)

¡Tu maquinita de monitoreo será épica! 🚀