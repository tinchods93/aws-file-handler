# AWS File Handler

**Microservicio especializado en gestión de archivos e imágenes** para el ecosistema Formularia. Maneja upload, descarga y eliminación de archivos en S3 e imágenes optimizadas en Cloudinary.

## 🎯 **Propósito**

Este microservicio proporciona **servicios de almacenamiento de archivos** para toda la plataforma Formularia, incluyendo:
- **Archivos generales** (PDFs, documentos) → **AWS S3**
- **Imágenes optimizadas** (fotos, gráficos) → **Cloudinary**
- **Metadatos de archivos** → **DynamoDB**

## 🏗️ **Arquitectura**

```
Frontend → API Gateway → File Handler → S3/Cloudinary
                              ↓
                          DynamoDB (metadatos)
```

### **Flujo de Archivos:**

1. **Upload**: Frontend envía archivo → Validación → Almacenamiento → Metadatos en DB
2. **Download**: Request de archivo → Generación de URL firmada → Entrega
3. **Delete**: Request de eliminación → Borrado de storage → Limpieza de metadatos

## 🔧 **Funcionalidades**

### ✅ **Gestión de Archivos S3**
- Upload de archivos en base64 a S3
- Descarga mediante URLs firmadas (1 hora de validez)
- Eliminación segura de archivos
- Soporte para múltiples tipos MIME

### ✅ **Gestión de Imágenes Cloudinary**
- Upload automático con optimización (calidad auto, formato auto)
- Transformaciones automáticas (máx 2000x4000px)
- URLs optimizadas con CDN global
- Eliminación por publicId

### ✅ **Sistema de Metadatos**
- Almacenamiento de metadatos en DynamoDB
- Tracking de archivos por usuario
- Información de timestamps y tipos
- Índices optimizados para consultas

### ✅ **Validación Robusta**
- Validación de schemas con Zod
- Manejo de errores centralizado
- Logging detallado para debugging

## 📁 **Estructura del Proyecto**

```
src/
├── application/                          # Lógica de negocio
│   ├── actions/
│   │   ├── files/                       # Acciones para archivos
│   │   │   ├── upload.ts
│   │   │   ├── get.ts
│   │   │   └── remove.ts
│   │   └── images/                      # Acciones para imágenes
│   │       ├── upload.ts
│   │       └── remove.ts
│   ├── entities/
│   │   └── actionResponse.ts            # Respuestas estandarizadas
│   └── services/
│       ├── fileService/                 # Servicio de archivos
│       ├── imageService/                # Servicio de imágenes
│       └── errors/                      # Excepciones personalizadas
├── infrastructure/
│   ├── primary/                         # Handlers y validaciones
│   │   ├── handlers/
│   │   │   ├── files/                   # Handlers de archivos
│   │   │   └── images/                  # Handlers de imágenes
│   │   ├── schemas/                     # Validaciones Zod
│   │   └── types/                       # Tipos de handlers
│   └── secondary/                       # Servicios externos
│       ├── services/
│       │   ├── s3Service.ts             # Integración S3
│       │   ├── cloudinaryService.ts     # Integración Cloudinary
│       │   └── tableService.ts          # Servicio DynamoDB
│       ├── repository/                  # Repositorios de datos
│       └── schemas/                     # Esquemas DynamoDB
├── domain/                              # Entidades de dominio
│   └── entities/metadata/               # Entidad de metadatos
├── commons/                             # Utilidades compartidas
│   ├── errors/                          # Sistema de errores
│   ├── enums/                           # Enumeraciones
│   └── utils/                           # Utilidades generales
└── depsContainer.ts                     # Inyección de dependencias
```

## ⚙️ **Configuración**

### **Variables de Entorno:**

```bash
# AWS Configuration
FILE_BUCKET_NAME=aws-file-handler-develop-files-storage
REGION=us-east-1
ACCOUNT_ID=123456789012

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Service Info
SERVICE=aws-file-handler
STAGE=develop
LOG_LEVEL=DEBUG
OWNER_PROJECT_NAME=Protoprime
```

### **Dependencias Principales:**

```json
{
  "cloudinary": "^2.2.0",           // Gestión de imágenes
  "dynamoose": "^3.2.0",            // ORM para DynamoDB
  "zod": "^3.23.8",                 // Validación de schemas
  "rebased": "^1.1.2",              // Framework de handlers
  "http-status-codes": "^2.3.0",    // Códigos HTTP
  "dayjs": "^1.11.11"               // Manejo de fechas
}
```

## 🚀 **Endpoints Disponibles**

### **📁 Gestión de Archivos:**

#### **POST** `/files/upload`
```json
{
  "file": "data:application/pdf;base64,JVBERi0xLjQ...",
  "fileName": "documento.pdf",
  "userId": "user123"
}
```

#### **GET** `/files/{fileName}`
- Descarga archivo mediante URL firmada
- Válida por 1 hora

#### **DELETE** `/files/{fileName}`
- Elimina archivo de S3
- Limpia metadatos de DynamoDB

### **🖼️ Gestión de Imágenes:**

#### **POST** `/images/upload`
```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "publicId": "template-bg-123",
  "userId": "user123"
}
```

#### **DELETE** `/images/{publicId}`
- Elimina imagen de Cloudinary
- Limpia metadatos de DynamoDB

## 🔍 **Cómo Funciona**

### **1. Upload de Archivo:**

```typescript
// 1. Validación del schema
const validatedData = schema.parse(uploadDTO);

// 2. Procesamiento del archivo
const [mediaType, base64Data] = file.split(',');
const fileBuffer = Buffer.from(base64Data, 'base64');

// 3. Upload a S3
const s3Response = await s3Service.upload({
  file: fileBuffer,
  id: fileName
});

// 4. Guardado de metadatos
const metadata = await metadataRepository.create({
  id: fileName,
  userId,
  type: 'file',
  s3Key: fileName,
  createdAt: new Date()
});
```

### **2. Upload de Imagen:**

```typescript
// 1. Upload a Cloudinary con optimización
const cloudinaryResponse = await cloudinaryService.upload({
  file: base64Image,
  id: publicId
});

// 2. Transformaciones automáticas aplicadas:
// - Máximo 2000x4000px
// - Calidad automática
// - Formato automático (WebP si soporta)
// - CDN global

// 3. URL optimizada generada
const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
```

### **3. Descarga de Archivo:**

```typescript
// 1. Validación de permisos (usuario propietario)
const metadata = await metadataRepository.get(fileName);
if (metadata.userId !== userId) {
  throw new Error('Unauthorized');
}

// 2. Generación de URL firmada S3
const signedUrl = await s3Service.getSignedUrl(fileName);
// URL válida por 1 hora
```

## 🗄️ **Estructura de Datos**

### **DynamoDB - Tabla de Metadatos:**

```json
{
  "id": "documento.pdf",           // PK - Nombre del archivo
  "userId": "user123",             // GSI - Usuario propietario
  "type": "file|image",            // Tipo de archivo
  "s3Key": "documento.pdf",        // Clave en S3
  "cloudinaryPublicId": "img123",  // ID público en Cloudinary
  "fileName": "documento.pdf",     // Nombre original
  "fileSize": 1024000,             // Tamaño en bytes
  "mimeType": "application/pdf",   // Tipo MIME
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### **S3 - Estructura de Bucket:**

```
bucket-name/
├── user123/
│   ├── documentos/
│   │   └── documento.pdf
│   └── plantillas/
│       └── template.docx
└── shared/
    └── public-files/
```

### **Cloudinary - Transformaciones:**

```javascript
// Transformaciones automáticas aplicadas
{
  transformation: [
    { width: 2000, height: 4000, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
}
```

## 🔒 **Seguridad y Permisos**

### **Autorización:**
- **Custom Authorizer** valida tokens JWT
- **Validación de propiedad** por userId
- **URLs firmadas** con expiración automática

### **IAM Permissions:**
```yaml
# S3 Permissions
- Effect: Allow
  Action:
    - s3:GetObject
    - s3:PutObject
    - s3:DeleteObject
  Resource: "arn:aws:s3:::bucket-name/*"

# DynamoDB Permissions
- Effect: Allow
  Action:
    - dynamodb:GetItem
    - dynamodb:PutItem
    - dynamodb:DeleteItem
    - dynamodb:Query
  Resource: "arn:aws:dynamodb:region:account:table/metadata"
```

## 🧪 **Testing**

### **Ejecutar Tests:**
```bash
npm test                    # Tests unitarios
npm run test:integration    # Tests de integración
```

### **Tests Disponibles:**
- Validación de schemas Zod
- Servicios S3 y Cloudinary
- Repositorios DynamoDB
- Handlers de endpoints

## 📊 **Monitoreo**

### **CloudWatch Logs:**
- **Prefijo**: `MARTIN_LOG=>` para filtrado
- **Métricas**: Uploads, downloads, errores
- **Retención**: 14 días

### **Métricas Importantes:**
- Tiempo de upload/download
- Tasa de éxito de operaciones
- Uso de almacenamiento S3
- Requests a Cloudinary

## 🚀 **Deployment**

### **Desarrollo:**
```bash
npm run deploy-dev
```

### **Producción:**
```bash
npm run deploy-prod
```

### **Scripts Disponibles:**
```bash
npm run lint              # ESLint
npm run test              # Tests
npm run package           # Empaquetar
npm run remove-dev        # Eliminar stack dev
```

## 🔧 **Troubleshooting**

### **Problemas Comunes:**

1. **Error de Upload:**
   ```bash
   # Verificar permisos S3
   # Revisar tamaño de archivo (límite Lambda)
   # Validar formato base64
   ```

2. **Error Cloudinary:**
   ```bash
   # Verificar credenciales
   # Revisar límites de cuenta
   # Validar formato de imagen
   ```

3. **Error de Descarga:**
   ```bash
   # Verificar URL firmada (1 hora)
   # Revisar permisos de archivo
   # Validar existencia en S3
   ```

## 📈 **Optimizaciones Implementadas**

### **Cloudinary:**
- **CDN global** para entrega rápida
- **Optimización automática** de calidad y formato
- **Transformaciones on-the-fly** para diferentes dispositivos

### **S3:**
- **URLs firmadas** para acceso seguro temporal
- **Content-Type** correcto para navegadores
- **Estructura organizada** por usuario

### **DynamoDB:**
- **Índices GSI** optimizados para consultas
- **TTL** para limpieza automática de metadatos
- **Queries eficientes** por usuario

## 🔮 **Roadmap**

### **Próximas Funcionalidades:**
- [ ] **Compresión automática** de archivos
- [ ] **Virus scanning** en uploads
- [ ] **Watermarking** automático en imágenes
- [ ] **CDN personalizado** para archivos
- [ ] **Backup automático** a Glacier

### **Mejoras Técnicas:**
- [ ] **Streaming uploads** para archivos grandes
- [ ] **Parallel uploads** para múltiples archivos
- [ ] **Cache inteligente** de metadatos
- [ ] **Métricas detalladas** de uso

---

**Desarrollado con ❤️ para el ecosistema Formularia**

*Gestión eficiente y segura de archivos e imágenes para aplicaciones modernas.*
