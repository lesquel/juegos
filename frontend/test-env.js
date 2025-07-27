import { environment, API_URL } from '../src/config/environment.js';

console.log('🔧 Verificando configuración de entorno:');
console.log('📊 Environment:', environment);
console.log('🌐 API_URL:', API_URL);
console.log('🏠 BASE_URL:', environment.BASE_URL);
console.log('🎯 ENVIRONMENT:', environment.ENVIRONMENT);

// Verificar que las variables críticas estén definidas
const checks = [
  { name: 'API_URL', value: API_URL },
  { name: 'BASE_URL', value: environment.BASE_URL },
  { name: 'ENVIRONMENT', value: environment.ENVIRONMENT }
];

checks.forEach(check => {
  if (check.value) {
    console.log(`✅ ${check.name}: ${check.value}`);
  } else {
    console.log(`❌ ${check.name}: NO DEFINIDA`);
  }
});
