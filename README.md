# Frontend Next.js Seed — Tailwind

Seed Next.js 16 App Router + TypeScript + Tailwind, espejo del `backend-nestjs-seed`. Consume el backend NestJS vía `NEXT_PUBLIC_API_URL`.

> **Env local:** `NEXT_PUBLIC_API_URL=http://localhost:3000` (ver `.env.example`). Para Vercel cambia a tu EC2/RDS o backend desplegado.

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4
- `fetch` nativo (sin librerías raras) — didáctico

## Estructura

```
src/app/
  layout.tsx              # header glass + navegación a los módulos
  page.tsx                # home con links y API_URL
  users/page.tsx          # estado y acciones del módulo Users
  users/[id]/page.tsx     # detalle dinámico de un usuario
  products/page.tsx       # estado y acciones del módulo Products
  products/[id]/page.tsx  # detalle dinámico de un producto
  orders/page.tsx         # órdenes de tienda
  orders/[id]/page.tsx    # detalle dinámico de una orden de tienda
  restaurantes/           # CRUD de restaurantes y detalle por ID
  repartidores/           # CRUD de repartidores y detalle por ID
  pedidos/                # CRUD de pedidos relacionados y detalle por ID
src/components/
  ui/                     # piezas visuales reutilizables: tarjetas, estados y controles
  users/                  # UserCard y UserCreateForm
  products/               # ProductCard, ProductCreateForm y ProductFilters
  orders/                 # OrderCard, OrderCreateForm y OrderFilters
  restaurantes/           # formulario de restaurantes
  repartidores/           # formulario de repartidores
  pedidos/                # formulario de pedidos con relaciones
src/hooks/
  useEntityDetail.ts      # carga reutilizable de una entidad por ID
src/lib/api.ts            # fetch wrappers con API_URL + params
```

## Guía para estudiantes: por qué ahora usamos componentes

Antes, una página podía contener el formulario, los inputs, las tarjetas de la lista y el manejo de estados en el mismo archivo. Eso hace que el archivo crezca rápidamente y obliga a copiar JSX cuando una pantalla necesita una estructura parecida.

Ahora cada página tiene una sola responsabilidad: **guardar el estado y conectar las acciones con el backend**. Las partes visuales viven en componentes que reciben los datos que necesitan mediante *props*.

Por ejemplo, `src/app/products/page.tsx` guarda el producto que se está escribiendo en `form`, pero no dibuja los cuatro inputs. Esa tarea la hace `ProductCreateForm`:

```tsx
<ProductCreateForm
  value={form}
  onChange={setForm}
  onSubmit={create}
/>
```

En este ejemplo:

- `value` lleva el estado actual desde la página hasta el formulario.
- `onChange` permite al formulario informar que el estudiante escribió un dato. El componente no modifica el estado por su cuenta; llama a `onChange(nuevoValor)`.
- `onSubmit` entrega la acción de crear. La página decide qué servicio usar y qué debe ocurrir después de guardar.

Este flujo es unidireccional: **la página entrega datos por props y el componente devuelve eventos con callbacks**. Por eso los componentes son reutilizables y más fáciles de probar o cambiar.

### Formularios controlados

`ProductCreateForm`, `UserCreateForm` y `OrderCreateForm` son formularios controlados. Un input controlado obtiene su valor de React y avisa cada cambio:

```tsx
<FormInput
  value={value.name}
  onChange={(event) => onChange({ ...value, name: event.target.value })}
/>
```

`value.name` muestra el estado actual. Al escribir, se crea una copia del objeto con el nombre actualizado y se la envía a la página. Usamos copias (`{ ...value, campo: nuevoValor }`) porque el estado de React no debe mutarse directamente.

`FormPanel` es el componente base que contiene la etiqueta `<form>`. Evita el comportamiento normal del navegador con `event.preventDefault()` y luego ejecuta el `onSubmit` recibido. `FormInput` y `FormSelect` centralizan las clases visuales comunes de los controles.

### Tarjetas y acciones

Las tarjetas de la lista también reciben props. Por ejemplo:

```tsx
<ProductCard
  product={product}
  onDelete={deleteProduct}
/>
```

`ProductCard` solo muestra un producto y emite la intención de eliminarlo. No conoce `productsService`. La página sí conoce el servicio y decide cómo borrar, recargar la lista o mostrar un error. El mismo principio se usa en `UserCard` y `OrderCard`.

Los componentes de `src/components/ui/` (`EntityCard`, `EntityPageHeader`, `LoadingState`, `ErrorState` y `EmptyState`) evitan repetir contenedores, bordes, colores y estados visuales entre módulos.

### Rutas dinámicas y consulta por ID

La carpeta entre corchetes, por ejemplo `src/app/products/[id]/page.tsx`, crea una ruta dinámica en Next.js:

| Archivo | URL de ejemplo | Parámetro recibido |
| --- | --- | --- |
| `products/[id]/page.tsx` | `/products/eaf671c9-...` | `id` |
| `users/[id]/page.tsx` | `/users/1000000002` | `id` |
| `orders/[id]/page.tsx` | `/orders/a0a7287b-...` | `id` |

La página de detalle recibe `params`, obtiene `id` y se lo pasa a `useEntityDetail`. Este hook llama al servicio apropiado (`getById`) y devuelve un objeto con `entity`, `loading`, `error` y `reload`. Así se reutiliza la misma lógica de carga en los tres detalles, mientras cada pantalla decide cómo presentar su entidad.

Cada tarjeta incluye el enlace `Ver detalle`. En una orden, los productos y el cliente también enlazan a sus propios detalles. Esto muestra cómo se combinan relaciones del backend con rutas dinámicas del frontend.

### Dónde añadir una nueva entidad

Para agregar, por ejemplo, `categories`, sigue este orden:

1. Crea el servicio `categoriesService` con `getAll`, `getById`, `create` y las demás operaciones necesarias.
2. Crea `CategoryCard` y `CategoryCreateForm` en `src/components/categories/`; define explícitamente sus props.
3. Crea `src/app/categories/page.tsx` para mantener estado, llamar al servicio y componer los componentes.
4. Crea `src/app/categories/[id]/page.tsx` y usa `useEntityDetail(id, categoriesService.getById)`.
5. Añade el enlace a la navegación y valida los estados de carga, error y lista vacía.

## Env

```bash
cp .env.example .env
# .env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

En Vercel: Project → Settings → Environment Variables → `NEXT_PUBLIC_API_URL=https://tu-backend.com`

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000 (frontend)
# en otra terminal, backend
cd ../backend-nestjs-seed && npm run start:dev # http://localhost:3000 (backend) → si coinciden puertos, cambia frontend a 3001: PORT=3001 npm run dev
```

Asegúrate de tener el backend corriendo en `NEXT_PUBLIC_API_URL`.

## Páginas

- `/` — home con links
- `/users` — crear/listar/desactivar
- `/users/[id]` — consultar el detalle de un usuario
- `/products` — crear/listar/filtrar por nombre/precio/stock
- `/products/[id]` — consultar el detalle de un producto
- `/orders` — órdenes de tienda (elige cliente/producto), filtros y acciones de pago/cancelación
- `/orders/[id]` — consultar una orden y navegar a su cliente o productos
- `/restaurantes` y `/restaurantes/[id]` — crear, consultar, editar y eliminar restaurantes
- `/repartidores` y `/repartidores/[id]` — crear, consultar, editar y desactivar repartidores
- `/pedidos` y `/pedidos/[id]` — CRUD de pedidos relacionados con cliente, repartidor y restaurante

Todo usa `src/lib/api.ts` con `fetch` y `cache: no-store`.

## Deploy Vercel (1 click)

1. Push a GitHub (ver abajo)
2. Vercel → New Project → Import `frontend-nextjs-seed` → añade `NEXT_PUBLIC_API_URL` → Deploy

## GitHub

```bash
git remote -v
# si es el seed, cámbialo a tu repo:
git remote set-url origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```
