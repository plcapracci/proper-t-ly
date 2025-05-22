# Proper(t)ly

Portal de gestión de propiedades para propietarios de viviendas. Esta aplicación permite gestionar la rentabilidad, gastos, e informes fiscales de sus propiedades en alquiler.

## Funcionalidades principales

- Dashboard de rentabilidad (ganancias y gastos)
- Sección para cargar gastos mediante archivos
- Reconciliación de gastos bancarios
- Generación de informes para Hacienda
- Conexión con cuenta bancaria vía Open Banking
- Extracción de información de gastos mediante OCR y GPT
- Calendario de ocupación para propiedades en Airbnb y Booking
- Sincronización con iCal de Airbnb y Booking
- Sistema de autenticación y login

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (Base de datos)
- NextAuth.js (Autenticación)
- Chart.js (Gráficos)
- API para OCR y procesamiento de documentos

## Requisitos previos

- Node.js 18.0 o superior
- PostgreSQL
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/propertly.git
cd propertly
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```
Edita el archivo `.env.local` con tus credenciales.

4. Configura la base de datos:
```bash
npx prisma migrate dev
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Configuración de la base de datos

La aplicación utiliza Prisma ORM con PostgreSQL. Para configurar la base de datos:

```bash
# Crea las migraciones de la base de datos
npx prisma migrate dev

# Genera el cliente Prisma
npx prisma generate

# Visualiza tu base de datos (opcional)
npx prisma studio
```

## Despliegue

Esta aplicación está configurada para ser desplegada en Vercel.

1. Crear una cuenta en [Vercel](https://vercel.com)
2. Instala la CLI de Vercel: `npm i -g vercel`
3. Despliega: `vercel`

## Contribuir

1. Crea un fork del repositorio
2. Crea una rama para tu característica: `git checkout -b feature/nueva-caracteristica`
3. Haz commit de tus cambios: `git commit -m 'Añade nueva característica'`
4. Envía tus cambios: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. 