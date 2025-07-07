# 📲 Instalación del Framework de Automatización Mobile

Guía paso a paso para configurar el entorno de automatización móvil usando WebdriverIO, Appium, Cucumber y TypeScript. Este entorno permite automatizar pruebas en apps Android e iOS.

---

## ✅ Requisitos Previos

### 1. Instalar Java

* Descargar Java JDK (recomendado JDK 17 o superior): [https://www.oracle.com/java/technologies/javase-downloads.html](https://www.oracle.com/java/technologies/javase-downloads.html)
* Verifica instalación:

```bash
java -version
```

### 2. Instalar Node.js

* Descargar desde: [https://nodejs.org](https://nodejs.org)
* Verifica instalación:

```bash
node -v
npm -v
```

### 3. Instalar Appium

```bash
npm install -g appium
```

* Verifica:

```bash
appium -v
```

### 4. Instalar Appium Doctor

```bash
npm install -g appium-doctor
appium-doctor
```

### 5. Instalar Android Studio

* Descargar: [https://developer.android.com/studio](https://developer.android.com/studio)
* Asegúrate de instalar SDK Tools y configurar variables de entorno `ANDROID_HOME`

### 6. Instalar Xcode (para macOS y pruebas en iOS)

* Desde App Store

### 7. Configurar Emuladores

* Android Studio > AVD Manager > Crear un emulador

---

## 🚀 Clonar el Proyecto y Configurar

```bash
git clone https://github.com/tuusuario/tu-repo-automacion.git
cd tu-repo-automacion
npm install
```

---

## ⚙️ Instalar Allure Reporter

```bash
npm install -D @wdio/allure-reporter allure-commandline
```

* Agrega en `wdio.conf.ts`:

```ts
reporters: ['spec', ['allure', {
  outputDir: 'allure-results',
  disableWebdriverStepsReporting: true,
  disableWebdriverScreenshotsReporting: false,
}]],
```

* Agrega script a `package.json`:

```json
"scripts": {
  "allure:generate": "allure generate allure-results --clean -o allure-report",
  "allure:open": "allure open allure-report"
}
```

---

## 🏗️ Ejecutar Proyecto por Tags

```bash
npx wdio run wdio.conf.ts --cucumberOpts.tagExpression '@login'
```

---

## 📦 Descargar APK para pruebas

* Guarda tu APK en la ruta `/app` del proyecto
* Ejemplo:

```
app/app-debug.apk
```

---

## 🔍 Ejecutar pruebas en emulador Android

1. Abre Android Studio > ejecuta el emulador
2. Ejecuta el comando:

```bash
npm run start-mobile
```

---

## ☁️ Integración con Jenkins y AWS Device Farm

* Jenkins: configurar job con ejecución de `npm run start-mobile`
* AWS Device Farm: subir APK y script de pruebas para ejecución remota

---

## 📊 Ver Reporte Allure

```bash
npm run allure:generate
npm run allure:open
```

---

## 🧪 Estructura del Proyecto

```
|-- features
|-- step-definitions
|-- pageobjects
|-- wdio.conf.ts
|-- app
|-- allure-results
|-- package.json
```

---

Para soporte o dudas, contacta conmigo en [LinkedIn](https://www.linkedin.com/in/steven-medina-batista/)

---

🎯 ¡Listo para automatizar apps móviles como un profesional!
