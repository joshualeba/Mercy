CREATE TABLE Tipo_Preguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Dificultades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL
);

CREATE TABLE Categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE DatosP (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellidoP VARCHAR(50),
    apellidoM VARCHAR(50),
    fecha_nacimiento DATETIME NOT NULL,
    telefono BIGINT
);

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_datosP INTEGER NOT NULL UNIQUE,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL,
    ultima_sesion DATETIME,
    test_completado BOOLEAN NOT NULL DEFAULT 0,
    provider VARCHAR(20) DEFAULT 'local',
    FOREIGN KEY (id_datosP) REFERENCES DatosP(id) ON DELETE CASCADE
);

CREATE TABLE preguntas_test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta TEXT NOT NULL,
    id_tipoPregunta INTEGER NOT NULL,
    id_dificultad INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    respuesta_texto_correcta VARCHAR(255),
    FOREIGN KEY (id_tipoPregunta) REFERENCES Tipo_Preguntas(id),
    FOREIGN KEY (id_dificultad) REFERENCES Dificultades(id),
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id)
);

CREATE TABLE opciones_respuesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta_id INTEGER NOT NULL,
    texto_opcion TEXT NOT NULL,
    es_correcta BOOLEAN NOT NULL,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas_test(id) ON DELETE CASCADE
);

CREATE TABLE resultados_test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    puntuacion INTEGER NOT NULL,
    total_preguntas INTEGER NOT NULL,
    puntuacion_total INTEGER NOT NULL DEFAULT 0,
    tiempo_resolucion_segundos DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    fecha_realizacion DATETIME NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE sofipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tasa_anual DECIMAL(5, 2) NOT NULL,
    plazo_dias INTEGER NOT NULL,
    nicap INTEGER NOT NULL,
    logo_url VARCHAR(255),
    url_web VARCHAR(255)
);

CREATE TABLE diagnosticos_financieros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    ingresos_mensuales DECIMAL(12, 2),
    gastos_mensuales DECIMAL(12, 2),
    deuda_total DECIMAL(12, 2),
    ahorro_actual DECIMAL(12, 2),
    puntaje_salud INTEGER,
    nivel_endeudamiento DECIMAL(5, 2),
    recomendacion_clave VARCHAR(255),
    fecha_diagnostico DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO Tipo_Preguntas (id, nombre) VALUES (1, 'multiple_choice');
INSERT INTO Tipo_Preguntas (id, nombre) VALUES (2, 'true_false');
INSERT INTO Tipo_Preguntas (id, nombre) VALUES (3, 'fill_in_the_blank');

INSERT INTO Dificultades (id, nombre) VALUES (1, 'facil');
INSERT INTO Dificultades (id, nombre) VALUES (2, 'medio');
INSERT INTO Dificultades (id, nombre) VALUES (3, 'dificil');

INSERT INTO Categorias (id, nombre) VALUES (1, 'ahorro');
INSERT INTO Categorias (id, nombre) VALUES (2, 'seguros');
INSERT INTO Categorias (id, nombre) VALUES (3, 'presupuesto');
INSERT INTO Categorias (id, nombre) VALUES (4, 'economía');
INSERT INTO Categorias (id, nombre) VALUES (5, 'inversiones');
INSERT INTO Categorias (id, nombre) VALUES (6, 'deuda');
INSERT INTO Categorias (id, nombre) VALUES (7, 'ingresos');

INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (1, '¿Qué es el interés simple?', 1, 1, 1, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (2, 'El seguro de vida es una forma de inversión.', 2, 1, 2, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (3, 'El ______ compuesto permite que tus intereses generen más intereses con el tiempo.', 3, 1, 1, 'Interés');
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (4, 'El ______ es la cantidad de dinero que ganas antes de que se deduzcan los impuestos.', 3, 1, 7, 'Salario bruto');
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (5, '¿Cuál de los siguientes es un gasto fijo?', 1, 2, 3, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (6, 'Los fondos de emergencia deben ser fáciles de acceder.', 2, 2, 1, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (7, 'La inflación reduce el ______ de tu dinero con el tiempo.', 3, 2, 4, 'Poder adquisitivo');
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (8, '¿Qué es un fondo mutuo?', 1, 2, 5, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (9, 'Pagar solo el mínimo de tu tarjeta de crédito te ayudará a salir de la deuda rápidamente.', 2, 3, 6, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (10, '¿Cuál es un beneficio clave de diversificar tus inversiones?', 1, 3, 5, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (11, 'En el contexto de inversiones, ¿qué representa el término ''beta''?', 1, 3, 5, NULL);
INSERT INTO preguntas_test (id, pregunta, id_tipoPregunta, id_dificultad, id_categoria, respuesta_texto_correcta) VALUES (12, 'Si una inversión ofrece capitalización mensual, ¿cuál es la tasa que refleja el rendimiento real anual?', 1, 3, 1, NULL);

INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (1, 1, 'Intereses calculados solo sobre el capital inicial.', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (2, 1, 'Intereses calculados sobre el capital y los intereses acumulados.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (3, 1, 'Un porcentaje fijo aplicado mensualmente.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (4, 1, 'La ganancia de capital en una inversión.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (5, 2, 'Verdadero', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (6, 2, 'Falso', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (7, 5, 'Comidas en restaurantes.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (8, 5, 'Alquiler.', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (9, 5, 'Entretenimiento.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (10, 5, 'Ropa nueva.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (11, 6, 'Verdadero', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (12, 6, 'Falso', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (13, 8, 'Un tipo de préstamo bancario.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (14, 8, 'Una cuenta de ahorro de alto rendimiento.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (15, 8, 'Un vehículo de inversión que agrupa dinero de múltiples inversores.', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (16, 8, 'Una tarjeta de crédito con beneficios.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (17, 9, 'Verdadero', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (18, 9, 'Falso', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (19, 10, 'Garantiza mayores rendimientos.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (20, 10, 'Reduce el riesgo general de la cartera.', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (21, 10, 'Aumenta la liquidez de tus activos.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (22, 10, 'Elimina la necesidad de investigación de mercado.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (23, 11, 'La volatilidad de un activo en relación al mercado.', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (24, 11, 'El rendimiento garantizado de una cuenta.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (25, 11, 'El costo de administración de un fondo.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (26, 11, 'La tasa de interés interbancaria.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (27, 12, 'Tasa efectiva anual (TEA).', 1);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (28, 12, 'Tasa nominal anual (TNA).', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (29, 12, 'Tasa de interés simple.', 0);
INSERT INTO opciones_respuesta (id, pregunta_id, texto_opcion, es_correcta) VALUES (30, 12, 'Tasa de inflación anual.', 0);

INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (1, 'Nu México', 14.75, 1, 1, NULL, 'https://nu.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (2, 'Finsus', 15.01, 365, 1, NULL, 'https://finsus.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (3, 'SuperTasas', 13.50, 364, 1, NULL, 'https://supertasas.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (4, 'Klar', 16.00, 30, 1, NULL, 'https://www.klar.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (5, 'Kubo Financiero', 13.80, 365, 1, NULL, 'https://www.kubofinanciero.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (6, 'CAME', 10.50, 360, 1, NULL, 'https://www.came.org.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (7, 'Financiera Monte de Piedad', 11.00, 365, 1, NULL, 'https://www.montepiedad.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (8, 'Libertad Soluciones', 9.50, 365, 1, NULL, 'https://www.libertad.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (9, 'Unagra', 8.00, 365, 1, NULL, 'https://www.unagra.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (10, 'Ualá', 15.00, 1, 1, NULL, 'https://www.uala.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (11, 'Stori Cuenta', 15.00, 1, 1, NULL, 'https://www.storicard.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (12, 'Hey Banco (Banregio)', 13.00, 7, 1, NULL, 'https://heybanco.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (13, 'Cetesdirecto (Cetes)', 11.00, 28, 1, NULL, 'https://www.cetesdirecto.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (14, 'BBVA México', 3.00, 365, 1, NULL, 'https://www.bbva.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (15, 'Citibanamex', 3.50, 365, 1, NULL, 'https://www.banamex.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (16, 'Banorte', 4.00, 365, 1, NULL, 'https://www.banorte.com');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (17, 'Santander', 3.50, 365, 1, NULL, 'https://www.santander.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (18, 'HSBC México', 3.00, 365, 1, NULL, 'https://www.hsbc.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (19, 'Scotiabank', 3.20, 365, 1, NULL, 'https://www.scotiabank.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (20, 'Banco Azteca', 5.00, 365, 1, NULL, 'https://www.bancoazteca.com.mx');
INSERT INTO sofipos (id, nombre, tasa_anual, plazo_dias, nicap, logo_url, url_web) VALUES (21, 'Bancoppel', 4.50, 365, 1, NULL, 'https://www.bancoppel.com');

CREATE TABLE glosario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    termino VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

INSERT INTO glosario (termino, descripcion, categoria) VALUES 
('Activo', 'Cualquier recurso que posee valor económico y se espera que genere beneficios futuros (dinero, propiedades, inversiones).', 'economia'),
('Pasivo', 'Obligaciones financieras o deudas que tienes que pagar en el futuro. Dinero que sale de tu bolsillo.', 'economia'),
('Patrimonio neto', 'Es el valor real de tu riqueza. Se calcula restando tus pasivos (lo que debes) de tus activos (lo que tienes).', 'economia'),
('Inflación', 'El aumento generalizado de los precios. Significa que con el mismo dinero puedes comprar menos cosas hoy que ayer.', 'economia'),
('Deflación', 'Lo opuesto a la inflación. Es una caída generalizada de los precios de bienes y servicios; puede ser peligrosa para la economía.', 'economia'),
('PIB', 'Producto interno bruto: la suma de todos los bienes y servicios producidos por un país. Indica si una economía está creciendo.', 'economia'),
('Recesión', 'Cuando la actividad económica disminuye durante varios meses seguidos. Hay menos empleos, menos ventas y la gente gasta menos.', 'economia'),
('Gasto hormiga', 'Pequeños gastos diarios (café, propinas, snacks) que parecen inofensivos, pero al sumarse representan una gran fuga de dinero.', 'economia'),
('Presupuesto', 'Es un plan para decidir cómo vas a gastar tu dinero antes de tenerlo. Te ayuda a asegurarte de que tus gastos no superen tus ingresos.', 'economia'),
('Liquidez', 'La facilidad para convertir algo en dinero rápido. El efectivo es lo más líquido; una casa es poco líquida porque tardas en venderla.', 'economia'),
('Solvencia', 'Tu capacidad a largo plazo para pagar todas tus deudas vendiendo tus activos si fuera necesario. Es tener más de lo que debes.', 'economia'),
('Tipo de cambio', 'Es el precio de una moneda extranjera (como el dólar) en términos de tu moneda local. Afecta importaciones y viajes.', 'economia'),
('Remesa', 'Dinero que envían las personas que viven en otro país a sus familiares en su país de origen.', 'economia'),
('Interés compuesto', 'Ganar intereses sobre tus intereses. Es el efecto "bola de nieve" que hace crecer tu dinero más rápido con el tiempo.', 'inversion'),
('Diversificación', 'La regla de "no poner todos los huevos en la misma canasta". Invertir en diferentes activos para reducir riesgos.', 'inversion'),
('Renta fija', 'Inversiones donde conoces la ganancia aproximada desde el inicio (ej. Bonos, Cetes). Son más seguras pero dan menos rendimientos.', 'inversion'),
('Renta variable', 'Inversiones donde la ganancia no está garantizada y puede subir o bajar (ej. Acciones). Mayor riesgo, mayor potencial de ganancia.', 'inversion'),
('Cetes', 'Certificados de la tesorería. Préstamo que le haces al gobierno a cambio de una tasa de interés fija. Es una inversión de bajo riesgo.', 'inversion'),
('Acción', 'Una pequeña parte de propiedad de una empresa. Si a la empresa le va bien, tu acción sube de valor.', 'inversion'),
('Dividendo', 'La parte de las ganancias que una empresa reparte entre sus dueños (accionistas) periódicamente.', 'inversion'),
('Fibra', 'Fideicomiso para invertir en bienes raíces (hoteles, oficinas, plazas) sin necesidad de comprar un inmueble completo.', 'inversion'),
('ETF', 'Fondo de inversión que cotiza en bolsa como una acción. Te permite comprar una "canasta" de muchas empresas a la vez.', 'inversion'),
('Sofipo', 'Sociedades financieras populares. Entidades reguladas que ofrecen servicios de ahorro e inversión, a menudo con tasas atractivas.', 'inversion'),
('Portafolio', 'El conjunto de todas tus inversiones. Un buen portafolio debe estar diversificado para equilibrar riesgo y ganancia.', 'inversion'),
('Plusvalía', 'El aumento del valor de un bien o activo con el paso del tiempo. Ganas plusvalía si tu casa vale más hoy que cuando la compraste.', 'inversion'),
('Minusvalía', 'Cuando un activo vale menos de lo que lo compraste. Se convierte en pérdida real solo si decides vender en ese momento.', 'inversion'),
('Horizonte de inversión', 'El tiempo que planeas dejar tu dinero invertido. A mayor horizonte (ej. jubilación), puedes tomar más riesgos.', 'inversion'),
('CAT', 'Costo anual total. Es el porcentaje real que te cuesta un crédito al año, incluyendo intereses, comisiones y seguros. ¡Siempre compáralo!', 'credito'),
('Buró de crédito', 'Empresa privada que recopila información sobre el historial crediticio de las personas. Todos los que han tenido crédito están ahí (buenos y malos).', 'credito'),
('Historial crediticio', 'Tu "boleta de calificaciones" financiera. Muestra tus préstamos pasados y qué tan puntual fuiste pagándolos.', 'credito'),
('Score crediticio', 'Una calificación numérica que resume tu historial. Un puntaje alto facilita que te presten dinero a mejores tasas.', 'credito'),
('Tasa de interés', 'El precio del dinero. Lo que cobras por prestar o lo que pagas por pedir prestado.', 'credito'),
('Hipoteca', 'Un préstamo a largo plazo para comprar una casa, donde la casa misma sirve como garantía de pago.', 'credito'),
('Fecha de corte', 'El día del mes en que el banco "cierra la cuenta" de tu tarjeta y suma todo lo que compraste en los últimos 30 días.', 'credito'),
('Fecha límite de pago', 'El último día que tienes para pagar tu tarjeta sin que te cobren intereses moratorios o recargos. ¡Anótala en tu calendario!', 'credito'),
('Pago mínimo', 'La cantidad más pequeña que pide el banco para mantener tu crédito al día. Si solo pagas esto, pagarás muchos intereses.', 'credito'),
('Anualidad', 'Comisión anual que cobran algunas tarjetas de crédito por el derecho a usarla y acceder a sus beneficios.', 'credito'),
('Amortización', 'El proceso de pagar una deuda gradualmente mediante pagos periódicos (generalmente mensuales) de capital e intereses.', 'credito'),
('Fintech', 'Finance + Technology. Empresas que usan tecnología para ofrecer servicios financieros (apps de banco, pagos, inversiones) de forma más ágil.', 'digital'),
('Neobanco', 'Un banco 100% digital, sin sucursales físicas. Todo se maneja desde una app y suelen tener costos más bajos.', 'digital'),
('Criptomoneda', 'Dinero 100% digital que usa criptografía para seguridad. Bitcoin y Ethereum son las más famosas. Son descentralizadas y volátiles.', 'digital'),
('Blockchain', 'Cadena de bloques. Es la tecnología detrás de las criptomonedas; un libro de registro digital seguro e inalterable.', 'digital'),
('Wallet', 'Billetera digital. Una aplicación o dispositivo donde almacenas las claves para acceder a tus criptomonedas.', 'digital'),
('Exchange', 'Casa de cambio digital. Plataformas donde puedes comprar y vender criptomonedas usando dinero tradicional u otras criptos.', 'digital'),
('SPEI', 'Sistema de pagos electrónicos interbancarios. La "carretera" digital para enviar transferencias bancarias en México en segundos.', 'digital'),
('Crowdfunding', 'Financiamiento colectivo. Muchas personas aportan pequeñas cantidades de dinero para financiar un proyecto o empresa.', 'digital'),
('Token', 'Un activo digital emitido en una blockchain. Puede representar dinero, arte (NFT) o derechos de voto en un proyecto.', 'digital'),
('Open banking', 'Banca abierta. Sistema que permite compartir tu información financiera de forma segura con otras apps para obtener mejores servicios.', 'digital'),
('Cashback', 'Reembolso temporal de un porcentaje del dinero que gastas usando una tarjeta o servicio, devolviéndolo a tu cuenta.', 'digital'),
('Regulado CNBV', 'Entidad financiera supervisada legalmente por la Comisión Nacional Bancaria y de Valores, garantizando que tu dinero esté en un ecosistema regulado y seguro.', 'digital'),
('GAT Nominal', 'Ganancia anual total nominal, que es el rendimiento total de un instrumento de inversión o ahorro en un año, expresado en porcentaje antes del cobro de impuestos.', 'inversion'),
('GAT Real', 'Ganancia anual total real, que es la ganancia por inversión de fondos, una vez que se descuenta la inflación.', 'inversion'),
('Disponibilidad 24/7', 'Capacidad de acceder y retirar tus fondos o gestionar tus cuentas a cualquier hora y en cualquier día sin restricciones de horarios bancarios.', 'digital'),
('Sin monto mínimo', 'Beneficio que indica que no se requiere mantener una cantidad mínima de dinero en tu cuenta o inversión para evitar comisiones o penalizaciones.', 'inversion'),
('Pago diario', 'Beneficio en el cual una entidad financiera te transfiere el dinero producto de los rendimientos día con día a tu cuenta principal de ahorro e inversión.', 'inversion'),
('Tarjeta de crédito', 'Instrumento financiero que te permite pedir dinero prestado hasta cierto límite para hacer compras, comprometiéndote a pagar la deuda en futuras fechas.', 'credito'),
('NICAP', 'Nivel de Capitalización. Indica la fortaleza financiera de una SOFIPO; un porcentaje alto significa que tienen solidez para respaldar los depósitos de los clientes.', 'inversion'),
('Tarjeta de débito', 'Instrumento financiero diseñado para realizar compras directas con el saldo guardado en una cuenta bancaria sin generar deuda a futuro.', 'digital'),
('Rendimiento fijo', 'Porcentaje constante de utilidades prometido por una inversión de deuda, sin importar cómo se mueva el panorama económico o el mercado de valores.', 'inversion');
