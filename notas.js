const http = require('http');

const PUERTO = process.env.PORT || 80;
const NOTA_MINIMA = 3.0;
const NOMBRE_EQUIPO = 'Equipo individual';
const INTEGRANTES = ['Juan Guille', 'Jimenez'];
const notasDelCurso = [4.5, 3.5, 2.5, 4.0];

function calcularPromedio(notas) {
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

function estaAprobado(promedio) {
  return promedio >= NOTA_MINIMA;
}

function responder(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos, null, 2));
}

const rutas = {
  '/salud': () => ({ estado: 'ok' }),
  '/equipo': () => ({ equipo: NOMBRE_EQUIPO, integrantes: INTEGRANTES }),
  '/notas': () => {
    const promedio = calcularPromedio(notasDelCurso);
    return { promedio, aprobado: estaAprobado(promedio) };
  },
};

const servidor = http.createServer((req, res) => {
  const obtenerDatos = rutas[req.url];
  if (obtenerDatos) {
    responder(res, 200, obtenerDatos());
  } else {
    responder(res, 404, { error: 'Ruta no encontrada' });
  }
});

servidor.listen(PUERTO);