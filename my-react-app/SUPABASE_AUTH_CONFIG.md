# Configuración de Autenticación en Supabase

## 1. Crear tabla `users`

Ejecuta este SQL en el SQL Editor de Supabase:

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

## 2. Configurar Authentication en Supabase Dashboard

1. Ve a **Authentication > Settings** en tu dashboard de Supabase
2. Configura las siguientes opciones:
   - **Site URL**: `http://localhost:3000` (para desarrollo)
   - **Redirect URLs**: `http://localhost:3000/**`
   - **Email Templates**: Personaliza si es necesario

## 3. Configurar Email Templates (Opcional)

En **Authentication > Email Templates**, puedes personalizar:
- **Confirm signup**: Template para confirmar registro
- **Reset password**: Template para resetear contraseña
- **Magic link**: Template para login con magic link

## 4. Configurar Providers (Opcional)

En **Authentication > Providers**, puedes habilitar:
- **Email**: Ya habilitado por defecto
- **Google**: Para login con Google
- **GitHub**: Para login con GitHub
- **Discord**: Para login con Discord

## 5. Configurar Policies para Posts

Si quieres que los posts estén relacionados con usuarios:

```sql
-- Agregar columna user_id a la tabla posts
ALTER TABLE posts ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Política para que los usuarios solo puedan ver posts públicos
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Política para que los usuarios solo puedan crear posts como ellos mismos
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan actualizar sus propios posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan eliminar sus propios posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

## 6. Testing

Una vez configurado, puedes probar:

1. **Registro**: Usa el formulario de registro
2. **Login**: Usa el formulario de login
3. **Logout**: Usa la función signOut
4. **Perfil**: Verifica que se crea el perfil en la tabla users

## 7. Variables de Entorno

Asegúrate de que tu archivo `.env` tenga:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

Y actualiza `supabaseClient.ts` para usar estas variables:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```
