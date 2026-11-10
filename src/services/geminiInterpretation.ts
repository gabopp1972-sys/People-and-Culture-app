import { DimensionScore, Survey, SurveyInterpretationReport } from '../types';

export const GEMINI_DISCLAIMER =
  'Esta interpretación de resultados fue elaborada por la Inteligencia Artificial (Gemini) y tiene únicamente fines de referencia y orientación personal. No sustituye ni corresponde a la opinión, diagnóstico o dictamen de ningún experto médico, psicológico o profesional.';

export function interpretBpServiceSurvey(
  answers: Record<number, number | string>,
  survey: Survey
): {
  totalScore: number;
  levelText: string;
  dimensionScores: DimensionScore[];
  npsScore: number;
  aiReport: SurveyInterpretationReport;
} {
  let totalScore = 0;
  const dimensionScores: DimensionScore[] = [];

  // Dimensiones base
  if (survey.dimensions) {
    for (const dim of survey.dimensions) {
      let dimScore = 0;
      for (const qId of dim.questionIds) {
        const val = Number(answers[qId]) || 0;
        dimScore += val;
      }
      totalScore += dimScore;
      const percentage = Math.round((dimScore / dim.maxScore) * 100);
      let status: 'fortaleza' | 'mejorar' | 'critico' = 'mejorar';
      if (percentage >= 85) status = 'fortaleza';
      else if (percentage < 70) status = 'critico';

      dimensionScores.push({
        name: dim.name,
        score: dimScore,
        maxScore: dim.maxScore,
        percentage,
        status,
      });
    }
  }

  // Nivel global
  let levelText = '';
  if (totalScore >= 66) levelText = 'Excelencia percibida';
  else if (totalScore >= 57) levelText = 'Servicio sólido y confiable';
  else if (totalScore >= 48) levelText = 'Servicio aceptable con oportunidades de mejora';
  else if (totalScore >= 39) levelText = 'Percepción moderada, requiere atención';
  else levelText = 'Percepción crítica del servicio';

  // NPS
  const npsScore = Number(answers[16]) || 0;
  let npsCategory: 'Excelente' | 'Bueno' | 'Aceptable' | 'Bajo' = 'Aceptable';
  let promoters = 0;
  let passives = 0;
  let detractors = 0;

  if (npsScore >= 9) {
    promoters = 1;
    npsCategory = 'Excelente';
  } else if (npsScore >= 7) {
    passives = 1;
    npsCategory = 'Bueno';
  } else {
    detractors = 1;
    npsCategory = npsScore <= 4 ? 'Bajo' : 'Aceptable';
  }

  // Análisis inteligente de fortalezas y oportunidades por IA Gemini
  const fortalezasList = dimensionScores
    .filter((d) => d.status === 'fortaleza')
    .map((d) => `${d.name}: Logró un destacado cumplimiento del ${d.percentage}%, proyectando solidez y confianza en el equipo.`);

  const oportunidadesList = dimensionScores
    .filter((d) => d.status !== 'fortaleza')
    .map((d) => `${d.name}: Registra un ${d.percentage}% (${d.status === 'critico' ? 'prioridad alta de revisión' : 'área susceptible de optimización'}).`);

  if (fortalezasList.length === 0) {
    fortalezasList.push('Disposición para responder a la evaluación institucional de forma transparente y colaborativa.');
  }

  const aiReport: SurveyInterpretationReport = {
    generatedBy: 'Gemini AI',
    disclaimer: GEMINI_DISCLAIMER,
    overallDiagnosis: `La evaluación global arrojó un puntaje de ${totalScore}/75 (${levelText}). Los colaboradores perciben ${totalScore >= 57 ? 'una relación fluida con el BP, destacando la empatía y la generación de valor.' : 'fricciones en los tiempos o en la claridad de los argumentos que ameritan una intervención enfocada.'
      }`,
    strengths: fortalezasList,
    areasOfOpportunity: oportunidadesList.length > 0 ? oportunidadesList : ['Mantener la consistencia en los acuerdos y el seguimiento en épocas de alta demanda.'],
    recommendedActionPlan: [
      'Establecer acuerdos de nivel de servicio (SLAs) claros para solicitudes críticas de People Business Partner.',
      'Sostener reuniones quincenales de sincronización con líderes de área para alinear expectativas.',
      'Implementar minutas ejecutivas post-reunión para documentar acuerdos y próximas fechas de entrega.',
    ],
    calculatedNps: {
      score: npsScore,
      promoters,
      passives,
      detractors,
      category: npsCategory,
    },
  };

  return { totalScore, levelText, dimensionScores, npsScore, aiReport };
}

export function interpretGriefSurvey(
  answers: Record<number, number | string>
): {
  totalScore: number;
  levelText: string;
  aiReport: SurveyInterpretationReport;
} {
  const trueItems = [1, 2, 3, 4, 5, 10, 12, 14, 15];
  const falseItems = [6, 7, 8, 9, 11, 13];

  let score = 0;
  for (const qId of trueItems) {
    if (answers[qId] === 'V' || String(answers[qId]) === 'true') score += 1;
  }
  for (const qId of falseItems) {
    if (answers[qId] === 'F' || String(answers[qId]) === 'false') score += 1;
  }

  let levelText = '';
  let diagnosis = '';
  let alertNotice: string | undefined = undefined;

  if (score >= 13) {
    levelText = 'Excelente adaptación';
    diagnosis = 'El duelo sigue presente de forma natural, pero estás logrando integrarlo a tu día a día con resiliencia y recursos afectivos sólidos.';
  } else if (score >= 10) {
    levelText = 'Adaptación favorable';
    diagnosis = 'Existen momentos y áreas de dolor o nostalgia, pero cuentas con fortalezas personales y redes de apoyo que te permiten seguir adelante.';
  } else if (score >= 7) {
    levelText = 'Adaptación intermedia';
    diagnosis = 'El proceso de duelo aún influye significativamente en tu energía y bienestar diario. Se sugiere monitorear tus emociones y apoyarte en espacios seguros.';
  } else if (score >= 4) {
    levelText = 'Señales de dificultad importante';
    diagnosis = 'Se aprecian señales evidentes de dificultad para asimilar la pérdida. Tu cuerpo y mente están sobrecargados.';
    alertNotice = 'Puede ser sumamente beneficioso acceder a acompañamiento tanatológico o al soporte de nuestro equipo de People & Wellness.';
  } else {
    levelText = 'Alto nivel de sufrimiento o bloqueo emocional';
    diagnosis = 'La intensidad del dolor está limitando tus actividades y tu paz cotidiana. Es momento de recibir apoyo y no cargar con esto en soledad.';
    alertNotice = 'Se recomienda activar apoyo profesional especializado en duelo y tanatología. Cuentas con el botón de Ayuda para canalización confidencial.';
  }

  // Alertas específicas
  if (answers[13] === 'V' || answers[11] === 'V') {
    alertNotice = 'Identificamos un impacto importante en tu sueño, vitalidad o sensación de estancamiento. Recuerda que no tienes que enfrentar esto a solas.';
  }

  const aiReport: SurveyInterpretationReport = {
    generatedBy: 'Gemini AI',
    disclaimer: GEMINI_DISCLAIMER,
    overallDiagnosis: diagnosis,
    strengths: [
      score >= 8 ? 'Capacidad para reconocer el valor de la vida y mantener rutinas protectoras.' : 'Valentía para hacer una pausa, autoexaminarte y reconocer tu estado emocional.',
      'Apertura para identificar tus emociones sin juzgarlas severamente.',
    ],
    areasOfOpportunity: [
      'Proteger horas regulares de descanso nocturno y alimentación balanceada.',
      'Permitirte expresar el dolor mediante escritura, diálogo con personas de confianza o ejercicio suave.',
      'Evitar el aislamiento y no sobrecargarte con compromisos laborales no esenciales.',
    ],
    recommendedActionPlan: [
      'Practica pausas de respiración y desconexión consciente (disponibles en la sección de Feed de Wellbeing).',
      'Habla con una persona de confianza o solicita una sesión orientativa con nuestro equipo de People & Coaching.',
      'Sé paciente contigo mismo(a): el proceso de duelo no es lineal y merece respeto a tus propios ritmos.',
    ],
    alertNotice,
  };

  return { totalScore: score, levelText, aiReport };
}
