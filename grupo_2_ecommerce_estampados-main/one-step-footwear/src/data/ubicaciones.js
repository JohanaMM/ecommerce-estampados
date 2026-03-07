/** Provincias para selects de envío (Argentina) */
export const PROVINCIAS = [
  "Ciudad Autónoma de Buenos Aires",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  "Tucumán",
];

/**
 * Ciudades principales (primer nivel).
 * Al elegir ciudad se muestran sus localidades.
 */
export const CIUDADES = [
  "CABA",
  "La Plata",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "San Miguel de Tucumán",
  "Mar del Plata",
  "Salta",
  "Santa Fe",
  "San Juan",
  "Resistencia",
  "Neuquén",
  "Corrientes",
  "Posadas",
  "San Salvador de Jujuy",
  "Bahía Blanca",
  "Paraná",
  "Formosa",
  "San Luis",
  "Otra",
];

/**
 * Por ciudad: listado de localidades (barrios o partidos).
 * Al elegir localidad se muestran los barrios de esa localidad.
 */
export const LOCALIDADES_POR_CIUDAD = {
  CABA: [
    "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boca", "Boedo", "Caballito",
    "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Paternal",
    "Liniers", "Mataderos", "Monte Castro", "Montserrat", "Nueva Pompeya", "Núñez", "Palermo",
    "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero",
    "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sársfield",
    "Versalles", "Villa Crespo", "Villa del Parque", "Villa Devoto", "Villa Gral. Mitre", "Villa Lugano",
    "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita",
  ],
  "La Plata": ["Centro", "Gonnet", "Tolosa", "Los Hornos", "Ensenada", "City Bell", "Villa Elisa", "Ringuelet", "Melchor Romero", "Otra"],
  "Córdoba": ["Centro", "Nueva Córdoba", "Alberdi", "Alta Córdoba", "General Paz", "Güemes", "Cerro de las Rosas", "Alta Gracia", "Otra"],
  "Rosario": ["Centro", "Norte", "Sur", "Fisherton", "Pichincha", "Echesortu", "Otra"],
  "Mendoza": ["Centro", "Godoy Cruz", "Guaymallén", "Las Heras", "Luján de Cuyo", "Maipú", "Otra"],
  "San Miguel de Tucumán": ["Centro", "Yerba Buena", "Tafí Viejo", "Banda del Río Salí", "Otra"],
  "Mar del Plata": ["Centro", "La Perla", "Playa Grande", "Batán", "Otra"],
  "Salta": ["Centro", "Cerrito", "Limache", "Villa San Lorenzo", "Otra"],
  "Santa Fe": ["Centro", "Norte", "Sur", "Otra"],
  "San Juan": ["Centro", "Rawson", "Santa Lucía", "Rivadavia", "Otra"],
  "Resistencia": ["Centro", "Barranqueras", "Fontana", "Otra"],
  "Neuquén": ["Centro", "Cipolletti", "Centenario", "Otra"],
  "Corrientes": ["Centro", "Camba Cuá", "Otra"],
  "Posadas": ["Centro", "Villa Urquiza", "Otra"],
  "San Salvador de Jujuy": ["Centro", "Alto Comedero", "Otra"],
  "Bahía Blanca": ["Centro", "Ingeniero White", "Villa Mitre", "Otra"],
  "Paraná": ["Centro", "Otra"],
  "Formosa": ["Centro", "Otra"],
  "San Luis": ["Centro", "Otra"],
  Otra: ["Otra"],
};

/**
 * Por ciudad y localidad: listado de barrios.
 * Si no hay barrios definidos se usa la misma localidad como opción.
 */
export const BARRIOS_POR_LOCALIDAD = {
  CABA: {
    Flores: ["Flores Centro", "Parque Chacabuco", "Carasa", "Villa Santa Rita (límite)", "Otra"],
    Caballito: ["Caballito Norte", "Caballito Sur", "Otra"],
    Palermo: ["Palermo Soho", "Palermo Hollywood", "Palermo Viejo", "Las Cañitas", "Otra"],
    Belgrano: ["Belgrano R", "Belgrano C", "Bajo Belgrano", "Otra"],
    Recoleta: ["Recoleta", "Barrio Norte", "Otra"],
    Almagro: ["Almagro", "Otra"],
    "Villa Crespo": ["Villa Crespo", "Otra"],
    Constitución: ["Constitución", "Otra"],
    "San Telmo": ["San Telmo", "Otra"],
    "La Paternal": ["La Paternal", "Otra"],
    Agronomía: ["Agronomía", "Otra"],
    Balvanera: ["Balvanera", "Otra"],
    Barracas: ["Barracas", "Otra"],
    Boca: ["La Boca", "Otra"],
    Boedo: ["Boedo", "Otra"],
    Chacarita: ["Chacarita", "Otra"],
    Coghlan: ["Coghlan", "Otra"],
    Colegiales: ["Colegiales", "Otra"],
    Floresta: ["Floresta", "Otra"],
    Liniers: ["Liniers", "Otra"],
    Mataderos: ["Mataderos", "Otra"],
    "Monte Castro": ["Monte Castro", "Otra"],
    Montserrat: ["Montserrat", "Otra"],
    "Nueva Pompeya": ["Nueva Pompeya", "Otra"],
    Núñez: ["Núñez", "Otra"],
    "Parque Avellaneda": ["Parque Avellaneda", "Otra"],
    "Parque Chacabuco": ["Parque Chacabuco", "Otra"],
    "Parque Chas": ["Parque Chas", "Otra"],
    "Parque Patricios": ["Parque Patricios", "Otra"],
    "Puerto Madero": ["Puerto Madero", "Otra"],
    Retiro: ["Retiro", "Otra"],
    Saavedra: ["Saavedra", "Otra"],
    "San Cristóbal": ["San Cristóbal", "Otra"],
    "San Nicolás": ["San Nicolás", "Otra"],
    "Vélez Sársfield": ["Vélez Sársfield", "Otra"],
    Versalles: ["Versalles", "Otra"],
    "Villa del Parque": ["Villa del Parque", "Otra"],
    "Villa Devoto": ["Villa Devoto", "Otra"],
    "Villa Gral. Mitre": ["Villa Gral. Mitre", "Otra"],
    "Villa Lugano": ["Villa Lugano", "Otra"],
    "Villa Luro": ["Villa Luro", "Otra"],
    "Villa Ortúzar": ["Villa Ortúzar", "Otra"],
    "Villa Pueyrredón": ["Villa Pueyrredón", "Otra"],
    "Villa Real": ["Villa Real", "Otra"],
    "Villa Riachuelo": ["Villa Riachuelo", "Otra"],
  },
};

/** Barrios por defecto cuando no hay datos específicos (ciudad + localidad) */
export function getBarrios(ciudad, localidad) {
  const porCiudad = BARRIOS_POR_LOCALIDAD[ciudad];
  if (!porCiudad || !localidad) return ["Otra"];
  return porCiudad[localidad] || [localidad, "Otra"];
}
