# 📸 Instrucciones para Agregar tu Imagen

## 🎯 Ubicación del Archivo
Coloca tu imagen en la siguiente ruta:
```
my-react-app/src/assets/images/hero-image.jpg
```

## 🔧 Cómo Reemplazar el Placeholder

### Opción 1: Reemplazar directamente en el CSS
1. Abre el archivo: `src/assets/components/hero/hero.css`
2. Busca la clase `.hero-image-placeholder`
3. Reemplaza el `background` con tu imagen:

```css
.hero-image-placeholder {
  background: url('../../images/hero-image.jpg') center/cover;
  /* Elimina o comenta la línea del gradiente */
  /* background: linear-gradient(135deg, #1a0033 0%, #2d0066 50%, #4d0099 100%); */
}
```

### Opción 2: Usar la clase para imagen real
1. Abre el archivo: `src/assets/components/hero/hero.tsx`
2. Reemplaza el div placeholder con una imagen:

```tsx
<div className="hero-image-container">
  <img 
    src="../../images/hero-image.jpg" 
    alt="Hero background" 
    className="hero-image-real"
  />
</div>
```

## 📐 Especificaciones Recomendadas
- **Formato:** JPG, PNG o WebP
- **Resolución:** Mínimo 1920x1080px
- **Aspecto:** 16:9 o similar
- **Tamaño:** Máximo 2MB para mejor rendimiento

## 🎨 Efectos Aplicados
- **Object-fit:** cover (la imagen se ajusta manteniendo proporción)
- **Object-position:** center (centrada)
- **Gradientes laterales:** Se mantienen para el efecto visual
- **Overlay de texto:** Se superpone sobre la imagen

## 📱 Responsive
La imagen se adapta automáticamente a:
- Desktop: 70vh de altura
- Tablet: 60vh de altura  
- Móvil: 40vh de altura

¡Listo! Tu imagen se verá perfecta con todos los efectos aplicados.
