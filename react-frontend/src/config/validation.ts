import { environment } from './environment'

/**
 * Validar configuración de variables de entorno
 */
export function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Variables requeridas
  const requiredVars = [
    'VITE_API_URL_DEV',
    'VITE_API_URL_PROD', 
    'VITE_BASE_URL',
    'VITE_ENVIRONMENT'
  ] as const;

  // Verificar variables requeridas
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Verificar formato de URLs
  try {
    new URL(environment.API_URL);
  } catch {
    errors.push(`Invalid API_URL format: ${environment.API_URL}`);
  }

  try {
    new URL(environment.BASE_URL);
  } catch {
    errors.push(`Invalid BASE_URL format: ${environment.BASE_URL}`);
  }

  // Verificar que ENVIRONMENT sea válido
  if (!['development', 'production', 'staging'].includes(environment.ENVIRONMENT)) {
    warnings.push(`Unexpected ENVIRONMENT value: ${environment.ENVIRONMENT}`);
  }

  // Log resultados en desarrollo
  if (environment.isDevelopment) {
    if (errors.length > 0) {
      console.error('❌ Environment validation errors:', errors);
    }
    if (warnings.length > 0) {
      console.warn('⚠️ Environment validation warnings:', warnings);
    }
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Environment validation passed');
      console.log('🔧 Environment config:', {
        API_URL: environment.API_URL,
        BASE_URL: environment.BASE_URL,
        ENVIRONMENT: environment.ENVIRONMENT,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Auto-validar en desarrollo
if (environment.isDevelopment) {
  validateEnvironment();
}
