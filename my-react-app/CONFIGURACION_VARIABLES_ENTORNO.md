# 🔧 Configuración de Variables de Entorno

## ⚠️ PROBLEMA IDENTIFICADO
Tu aplicación no puede conectarse a Supabase porque **faltan las variables de entorno**.

## 🚀 SOLUCIÓN INMEDIATA

### 1. Crear archivo `.env` en la raíz del proyecto

Crea un archivo llamado `.env` en la carpeta `my-react-app/` con el siguiente contenido:

```env
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

### 2. Obtener las credenciales de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. En el dashboard, ve a **Settings** > **API**
3. Copia la **Project URL** (algo como: `https://xxxxx.supabase.co`)
4. Copia la **anon public** key (algo como: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Reemplazar los valores en `.env`

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## 🔍 Verificar que funciona

1. Abre las **Developer Tools** del navegador (F12)
2. Ve a la pestaña **Console**
3. Intenta registrar un usuario
4. Deberías ver logs como:
   - `🔐 Iniciando registro de usuario:`
   - `✅ Usuario creado en auth.users:`
   - `✅ Perfil de usuario creado exitosamente`

## ❌ Si sigues viendo errores

### Error: "Variables de entorno de Supabase no configuradas"
- Verifica que el archivo `.env` esté en la carpeta correcta
- Verifica que las variables tengan el nombre exacto: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Reinicia el servidor de desarrollo

### Error: "Invalid API key" o "Invalid URL"
- Verifica que las credenciales sean correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Error: "Table 'users' doesn't exist"
- Ejecuta el SQL del archivo `SUPABASE_AUTH_CONFIG.md` en tu proyecto de Supabase

## 📝 Estructura del archivo .env

```
my-react-app/
├── .env                 ← CREAR ESTE ARCHIVO
├── src/
├── package.json
└── ...
```

**IMPORTANTE**: El archivo `.env` debe estar en la raíz del proyecto, al mismo nivel que `package.json`.
