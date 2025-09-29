# 🗄️ Crear Tabla Users en Supabase

## ⚠️ PROBLEMA ACTUAL
El error indica que la tabla `users` no existe en tu base de datos de Supabase.

## 🚀 SOLUCIÓN PASO A PASO

### 1. Ir al SQL Editor de Supabase
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New query**

### 2. Ejecutar este SQL
Copia y pega este código SQL en el editor:

```sql
-- Crear tabla users
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Ejecutar el SQL
1. Haz clic en **Run** (o presiona Ctrl+Enter)
2. Deberías ver un mensaje de éxito

### 4. Verificar que se creó la tabla
1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla `users` en la lista
3. Haz clic en ella para ver su estructura

## ✅ DESPUÉS DE CREAR LA TABLA

1. **Reinicia tu aplicación:**
   ```bash
   npm run dev
   ```

2. **Prueba registrar un usuario:**
   - Ve a la pantalla de registro
   - Completa el formulario
   - Deberías ver en la consola:
     ```
     🔐 Iniciando registro de usuario: {email: "...", fullName: "..."}
     ✅ Usuario creado en auth.users: {id: "...", email: "..."}
     📝 Creando perfil en tabla users...
     ✅ Perfil de usuario creado exitosamente
     ```

3. **Verificar en Supabase:**
   - Ve a **Table Editor** > **users**
   - Deberías ver el nuevo usuario registrado

## 🔍 SI SIGUES TENIENDO PROBLEMAS

### Error: "Permission denied"
- Verifica que estés logueado en Supabase
- Asegúrate de tener permisos de administrador en el proyecto

### Error: "Table already exists"
- La tabla ya existe, puedes continuar con la prueba

### Error: "Syntax error"
- Verifica que copiaste todo el SQL correctamente
- Asegúrate de que no hay caracteres extra

## 📋 ESTRUCTURA DE LA TABLA CREADA

La tabla `users` tendrá estas columnas:
- `id`: UUID que referencia a `auth.users(id)`
- `email`: Email del usuario
- `full_name`: Nombre completo
- `avatar_url`: URL del avatar (opcional)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

## 🎯 PRÓXIMO PASO
Una vez creada la tabla, tu aplicación debería funcionar perfectamente para registrar usuarios.
