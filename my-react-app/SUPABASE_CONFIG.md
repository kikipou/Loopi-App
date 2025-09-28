# 🔧 Configuración de Supabase

## 📋 Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Elige una región cercana a tu ubicación

### 2. Obtener las credenciales
1. En tu dashboard de Supabase, ve a **Settings** > **API**
2. Copia la **Project URL** (algo como: `https://xxxxx.supabase.co`)
3. Copia la **anon public** key (algo como: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configurar el archivo de Supabase
1. Abre `src/lib/supabase.ts`
2. Reemplaza `YOUR_SUPABASE_URL` con tu Project URL
3. Reemplaza `YOUR_SUPABASE_ANON_KEY` con tu anon public key

```typescript
const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = 'tu-clave-anonima-aqui'
```

### 4. Crear la tabla de posts
Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla de posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_name TEXT NOT NULL,
  post_description TEXT,
  post_professions TEXT,
  post_skills TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT USING (true);

-- Crear política para permitir inserción (opcional)
CREATE POLICY "Allow public insert" ON posts
  FOR INSERT WITH CHECK (true);

-- Crear política para permitir actualización (opcional)
CREATE POLICY "Allow public update" ON posts
  FOR UPDATE USING (true);

-- Crear política para permitir eliminación (opcional)
CREATE POLICY "Allow public delete" ON posts
  FOR DELETE USING (true);
```

### 5. Insertar datos de ejemplo (opcional)
```sql
INSERT INTO posts (post_name, post_description, post_professions, post_skills, image_url) VALUES
('Proyecto de Diseño UI/UX', 'Buscamos diseñador para crear interfaz moderna', 'Design, UI/UX', 'Figma, Adobe XD, Sketch', 'https://example.com/image1.jpg'),
('Desarrollo Web Full Stack', 'Proyecto de e-commerce con React y Node.js', 'Development', 'React, Node.js, PostgreSQL', 'https://example.com/image2.jpg'),
('Análisis de Datos', 'Proyecto de machine learning para predicción', 'Data Science', 'Python, TensorFlow, Pandas', 'https://example.com/image3.jpg');
```

## 🚀 ¡Listo!
Una vez configurado, tu aplicación debería poder:
- ✅ Conectarse a Supabase
- ✅ Mostrar posts desde la base de datos
- ✅ Manejar estados de carga y error
- ✅ Permitir CRUD operations (si las políticas lo permiten)

## 🔍 Verificar conexión
Abre las **Developer Tools** del navegador y ve a la consola. Deberías ver los posts cargándose o mensajes de error si hay problemas de configuración.
