# 📊 Claude Monitor - Resumen del Proyecto

**Estado**: ✅ COMPLETO - Listo para deploy

## 🎯 Lo que tienes

Una **"maquinita de monitoreo"** completa que transforma tu iPhone viejo en un dashboard retro para monitorear tu uso de Claude en tiempo real.

### Archivos creados:
```
claude-monitor/
├── index.html              # 📱 Frontend dashboard (13.7KB)
├── api/usage.js            # ⚡ Serverless API function (4.1KB)  
├── package.json            # 📦 Dependencies config
├── vercel.json             # 🚀 Vercel deploy config
├── .gitignore              # 🙈 Git ignore rules
├── README.md               # 📖 Instrucciones completas
├── KIOSK-TIPS.md           # 📱 Tips avanzados iPhone
├── test-local.html         # 🧪 Test suite local
└── PROJECT-SUMMARY.md      # 📋 Este resumen
```

## 🎨 Visual Preview

```
┌─────────────────────────────────────────────┐
│          ⚡ CLAUDE MONITOR                   │
│         Real-time usage tracking            │
│                                             │
│     Claude Max • user@example.com        │
│                                             │
│  5 Hour Limit                         67%   │
│  ████████░░ resets in 2h15m                 │
│                                             │
│  7 Day Limit                          34%   │
│  ███░░░░░░░ resets in 4d8h                  │
│                                             │
│  Sonnet Usage                         22%   │
│  ██░░░░░░░░ 7-day window                    │
│                                             │
│  Last updated: 14:23:45                     │
│  Next refresh: 4:57                         │
└─────────────────────────────────────────────┘
```

## 🚀 Next Steps (en orden)

### 1. Deploy a Vercel (5 mins)
```bash
cd claude-monitor
git init && git add . && git commit -m "Claude monitor ready"
git remote add origin https://github.com/TU-USER/claude-monitor.git
git push -u origin main
```

→ Ve a [vercel.com](https://vercel.com), importa el repo

### 2. Configurar Cookie (2 mins)
1. Ve a [claude.ai](https://claude.ai) 
2. F12 → Application → Cookies → `sessionKey`
3. Copia el valor
4. Vercel → Project Settings → Environment Variables
   - `CLAUDE_SESSION_COOKIE` = (pegar valor)

### 3. Setup iPhone (3 mins)
1. Abre Safari → tu-url.vercel.app
2. Share button → "Add to Home Screen"  
3. Settings → Display → Auto-Lock: Never
4. Pon horizontal, ¡listo!

## ✨ Features Destacados

### 🎯 **Funcionalidad Core**
- ✅ Muestra 5h, 7d y Sonnet usage en tiempo real
- ✅ Auto-refresh cada 5 minutos
- ✅ Tiempo hasta reset de cada límite
- ✅ Responsive perfecto para iPhone horizontal

### 🎨 **Visual/UX** 
- ✅ Estilo retro CLI (fondo negro, texto naranja Claude)
- ✅ Tipografía JetBrains Mono (profesional)
- ✅ Animaciones suaves en barras de progreso
- ✅ Web App capabilities (home screen icon)
- ✅ Sin scroll, viewport 100%

### ⚡ **Performance**
- ✅ Frontend estático (carga instantánea)
- ✅ API con cache 2min (eficiente)
- ✅ Error handling robusto
- ✅ Timeout 30s max en serverless

### 📱 **Mobile-First**
- ✅ Optimizado iPhone 6+ en adelante
- ✅ Media queries para diferentes tamaños  
- ✅ Prevención sleep de pantalla
- ✅ Touch-friendly (sin zooms accidentales)

## 🔧 Arquitectura Técnica

### Frontend (index.html)
- **Framework**: Vanilla JS (cero dependencies)
- **Styling**: CSS puro con variables y animations
- **Data**: Fetch a `/api/usage` cada 5min
- **Storage**: LocalStorage para preferences (futuro)

### Backend (api/usage.js) 
- **Runtime**: Node.js 18.x en Vercel
- **Method**: Fetch directo a claude.ai API
- **Auth**: Session cookie via env var
- **Response**: JSON limpio con usage data
- **Cache**: 2min public cache + stale-while-revalidate

### Deployment (vercel.json)
- **Static**: index.html servido desde root
- **Serverless**: api/ folder auto-detectado
- **Config**: Max duration 30s, headers security

## 📊 Data Flow

```
iPhone Safari
    ↓ (cada 5min)
tu-url.vercel.app
    ↓ (fetch /api/usage)
Vercel Serverless Function  
    ↓ (con cookie)
claude.ai/api/organizations/{uuid}/usage
    ↓ (JSON response)
Frontend Dashboard
    ↓ (update UI)
Barras de progreso actualizadas ✨
```

## 🛠 Customización Rápida

### Cambiar colores:
```css
/* En index.html, buscar: */
color: #ff8c00;           /* Texto naranja → cambiar */
background: #000000;      /* Fondo negro → cambiar */
```

### Cambiar refresh interval:
```javascript  
/* En index.html, buscar: */
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5min → cambiar
```

### Agregar más métricas:
```javascript
/* En api/usage.js, agregar al response: */
if (usage.seven_day_opus) {
    response.seven_day_opus = {
        utilization: Math.round(usage.seven_day_opus.utilization || 0)
    };
}
```

## 🐛 Troubleshooting Quick Fix

| Error | Causa | Fix |
|-------|-------|-----|
| "Authentication failed" | Cookie expiró | Actualizar `CLAUDE_SESSION_COOKIE` en Vercel |
| "Request timeout" | Claude API lenta | Normal, retry automático en 5min |
| iPhone no actualiza | Low Power Mode | Settings → Battery → Low Power Mode OFF |
| Texto muy pequeño | iPhone muy viejo | Media queries responsive ya incluidas |

## 📈 Roadmap (Opcional)

### Versión 1.1 - Histórico
- [ ] Guardar datos en LocalStorage
- [ ] Gráfico simple con Canvas API
- [ ] Export CSV mensual

### Versión 1.2 - Multi-Service  
- [ ] GitHub API limits
- [ ] Vercel bandwidth
- [ ] Tabs para alternar vistas

### Versión 1.3 - Smart Alerts
- [ ] Push notifications cuando >80%
- [ ] Vibración en crítico
- [ ] Email digest semanal

## 🎉 ¡Está listo!

Tienes todo lo necesario para tu maquinita de monitoreo:

✅ **Código completo** (funcional y optimizado)  
✅ **Instrucciones step-by-step** (README.md)  
✅ **Tips de optimización** (KIOSK-TIPS.md)  
✅ **Test suite** (test-local.html)  
✅ **Deploy config** (vercel.json, package.json)

**Tiempo total de setup**: ~10 minutos  
**Resultado**: iPhone convertido en monitor retro 24/7 🚀

---

**Pro tip**: Abre `test-local.html` en tu navegador primero para testear que todo funciona antes del deploy a Vercel.

¡Tu maquinita va a ser épica! 💅✨