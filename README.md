# 🛒 Lista de la Compra Compartida

Aplicación web que permite crear y gestionar listas de la compra de forma colaborativa y en tiempo real, pensada para grupos de personas que comparten la responsabilidad de hacer la compra: compañeros de piso, parejas, familias o amigos.

## 🌐 Tecnologías utilizadas

### Backend
- **Laravel 9**
- **Laravel Sanctum** (autenticación con tokens Bearer)
- **MySQL** (contenedor Docker)
- **GuzzleHTTP**

### Frontend
- **Angular 19**
- **Angular Material**
- **Transloco** (internacionalización)
- **SCSS + Responsive design**

### Infraestructura
- **Docker** (para base de datos)
- **Apache** (para despliegue del frontend en producción)
- **GitHub** (repositorio y control de versiones)

---

## 🚀 Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/ffervaz2604/TFG-Lista.git
cd TFG-Lista

### 2. Backend – Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

### 3. Base de datos – Docker

```bash
docker-compose up -d

### 4. Frontend – Angular

```bash
cd frontend
npm install
ng serve
---
