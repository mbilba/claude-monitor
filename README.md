# Claude Monitor 📊

Una "maquinita de monitoreo" retro para visualizar tu consumo de Claude en tiempo real desde un iPhone viejo.

## 🚀 Features

- **Estilo CLI retro**: Fondo negro, tipografía naranja Claude Code
- **Tiempo real**: Auto-refresh cada 5 minutos
- **Mobile-first**: Optimizado para iPhone horizontal
- **Web App**: Funciona como app nativa con "Add to Home Screen"
- **Sin scroll**: Diseño que ocupa 100% del viewport

## 📱 Lo que muestra

- **5 Hour Limit**: Barra de progreso + tiempo hasta reset
- **7 Day Limit**: Barra de progreso + tiempo hasta reset  
- **Sonnet Usage**: Consumo del modelo Sonnet en ventana de 7 días

## 🛠 Deploy a Vercel

### 1. Crear repo en GitHub

```bash
cd claude-monitor
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/claude-monitor.git
git push -u origin main
```

### 2. Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com) y conecta tu GitHub
2. Importa el repositorio `claude-monitor`
3. En la configuración de deploy:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `echo "Static build"`
   - **Output Directory**: `./` (dejar por defecto)

### 3. Configurar Environment Variable

En Vercel Dashboard → Project Settings → Environment Variables:

- **Name**: `CLAUDE_SESSION_COOKIE`
- **Value**: Tu cookie de sesión de claude.ai
- **Environment**: Production, Preview, Development

#### Como obtener tu CLAUDE_SESSION_COOKIE:

1. Abre Chrome/Safari y ve a [claude.ai](https://claude.ai)
2. Abre DevTools (F12)
3. Ve a Application/Storage → Cookies → claude.ai
4. Busca `sessionKey` y copia su valor
5. Pega ese valor en Vercel (sin comillas)

### 4. Deploy

Vercel hace deploy automático. Tu monitor estará en:
```
https://claude-monitor-tu-usuario.vercel.app
```

## 📱 Setup iPhone "Modo Kiosco"

### Convertir en Web App

1. Abre Safari en tu iPhone
2. Ve a tu URL de Vercel
3. Toca el botón "Share" (cuadrado con flecha)
4. Scroll down → "Add to Home Screen"
5. Cambia el nombre a "Claude Monitor"
6. Toca "Add"

### Configuración de Display

1. **Settings → Display & Brightness**:
   - Brightness: 50-70% (para que no se caliente)
   - Auto-Lock: Never (o 5 minutes max)

2. **Settings → Battery**:
   - Low Power Mode: OFF (puede limitar refresh)

3. **Posición**: Coloca el iPhone horizontal (landscape)

### Modo Kiosco Avanzado (Opcional)

Para que sea más "kiosco-like":

1. **Settings → Screen Time → App Limits**:
   - Limita otras apps a 1 minuto
   - Deja Safari/Chrome sin límite

2. **Settings → Control Center**:
   - Desactiva controles innecesarios

3. **Settings → Notifications**:
   - Apaga notificaciones para que no interrumpan

## 🔧 Estructura del Proyecto

```
claude-monitor/
├── index.html          # Frontend dashboard
├── api/
│   └── usage.js        # Serverless function
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── README.md           # Este archivo
```

## 🐛 Troubleshooting

### "Authentication failed"
- Tu CLAUDE_SESSION_COOKIE expiró
- Ve a claude.ai, actualiza la cookie en Vercel
- Redeploy si es necesario

### "Request timeout"
- Claude API está lenta
- La función tiene timeout de 30s max
- Normalmente se resuelve solo

### "No data showing"
- Revisa la consola del navegador (F12)
- Verifica que /api/usage responda correctamente
- Prueba abrir directamente: `tu-url.vercel.app/api/usage`

### iPhone no actualiza
- Revisa que no esté en Low Power Mode  
- Safari puede pausar timers en background
- Toca la pantalla cada tanto para "despertarlo"

## 🎨 Personalización

Para cambiar colores, fuentes o layout:
- Edita `index.html` → sección `<style>`
- Variables CSS principales:
  - `background-color: #000000` (fondo)
  - `color: #ff8c00` (texto naranja Claude)
  - `font-family: 'JetBrains Mono'` (tipografía)

## 📈 Performance

- **Frontend**: Estático, carga instantánea
- **API**: Cache 2min, max 30s execution
- **iPhone**: Refresh cada 5min (balanceado battery/data)

---

¡Listo! Ahora tienes tu maquinita de monitoreo Claude funcionando 24/7 🚀