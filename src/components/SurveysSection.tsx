import React, { useState } from 'react';
import {
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bot,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  BarChart3,
  Share2,
  MessageSquare,
  Mail,
  Printer,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Survey, SurveyResult } from '../types';
import {
  interpretBpServiceSurvey,
  interpretGriefSurvey,
} from '../services/geminiInterpretation';

export const SurveysSection: React.FC = () => {
  const {
    surveys,
    saveSurveyResult,
    surveyResults,
    userProfile,
    setIsHelpModalOpen,
    setIsShareModalOpen,
    setSurveyToShare,
  } = useApp();

  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeResult, setActiveResult] = useState<SurveyResult | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  const startSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setActiveResult(null);
  };

  const currentQuestion = selectedSurvey ? selectedSurvey.questions[currentQuestionIndex] : null;
  const totalQuestions = selectedSurvey ? selectedSurvey.questions.length : 0;
  const progressPercent = totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

  const handleSelectOption = (value: number | string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!selectedSurvey) return;
    if (currentQuestionIndex < selectedSurvey.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishSurvey();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishSurvey = () => {
    if (!selectedSurvey) return;
    setIsAnalyzingAi(true);

    setTimeout(() => {
      let resultData: SurveyResult;

      if (selectedSurvey.category === 'servicio_bp') {
        const { totalScore, levelText, dimensionScores, npsScore, aiReport } =
          interpretBpServiceSurvey(answers, selectedSurvey);

        resultData = {
          id: `res-${Date.now()}`,
          surveyId: selectedSurvey.id,
          surveyTitle: selectedSurvey.title,
          userName: userProfile.name,
          completedAt: new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          answers,
          totalScore,
          maxPossibleScore: 75,
          levelInterpretation: levelText,
          dimensionScores,
          npsScore,
          aiReport,
        };
      } else {
        const { totalScore, levelText, aiReport } = interpretGriefSurvey(answers);

        resultData = {
          id: `res-${Date.now()}`,
          surveyId: selectedSurvey.id,
          surveyTitle: selectedSurvey.title,
          userName: userProfile.name,
          completedAt: new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          answers,
          totalScore,
          maxPossibleScore: 15,
          levelInterpretation: levelText,
          aiReport,
        };
      }

      saveSurveyResult(resultData);
      setActiveResult(resultData);
      setIsCompleted(true);
      setIsAnalyzingAi(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  // VISTA 1: Catálogo de Encuestas Precargadas
  if (!selectedSurvey) {
    return (
      <div className="max-w-2xl mx-auto pb-28 space-y-5 px-1">
        {/* Banner principal */}
        <div className="bg-gradient-to-r from-teal-900/60 via-slate-900 to-indigo-900/60 border border-teal-500/30 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-500/30 shrink-0">
              <ClipboardCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Encuestas de Salud, Emociones & Servicio</h2>
              <p className="text-xs text-slate-300">
                Diagnósticos con reporte analítico inteligente impulsado por IA Gemini
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Puedes responder las encuestas y además compartirlas por WhatsApp o Correo con otros miembros de tu equipo.
          </p>
        </div>

        {/* Lista de Encuestas */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Encuestas Disponibles ({surveys.length})
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 sm:p-5 text-white transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        survey.category === 'servicio_bp'
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {survey.category === 'servicio_bp'
                        ? 'Servicio & Alianzas'
                        : 'Adaptación Emocional'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ⏱️ {survey.estimatedMinutes} min
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {survey.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {survey.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                    <span>📋 {survey.questions.length} reactivos</span>
                    <span>🤖 Análisis Gemini AI</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                  {/* Botón Compartir Encuesta */}
                  <button
                    type="button"
                    onClick={() => {
                      setSurveyToShare(survey);
                      setIsShareModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold transition-all border border-slate-700 active:scale-95"
                    title="Compartir por WhatsApp o Correo"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startSurvey(survey)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>Iniciar Encuesta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Encuestas Completadas */}
        {surveyResults.length > 0 && (
          <div className="pt-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Historial de Resultados ({surveyResults.length})
            </h3>
            <div className="space-y-2.5">
              {surveyResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    setActiveResult(res);
                    const s = surveys.find((s) => s.id === res.surveyId);
                    if (s) setSelectedSurvey(s);
                    setIsCompleted(true);
                  }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="text-xs font-bold text-white truncate">{res.surveyTitle}</h5>
                    <p className="text-[11px] text-teal-400 truncate">
                      Puntaje: {res.totalScore}/{res.maxPossibleScore} ({res.levelInterpretation})
                    </p>
                    <span className="text-[10px] text-slate-400">Fecha: {res.completedAt}</span>
                  </div>
                  <span className="text-xs text-slate-400 underline flex items-center gap-1 shrink-0">
                    Ver reporte <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VISTA 2: Procesamiento con IA
  if (isAnalyzingAi) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-5 px-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl animate-spin">
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Gemini está analizando tus respuestas...</h3>
          <p className="text-xs text-slate-400 mt-2">
            Procesando dimensiones, calculando NPS y generando diagnóstico analítico personalizado.
          </p>
        </div>
      </div>
    );
  }

  // VISTA 3: Resultados e Interpretación por Gemini
  if (isCompleted && activeResult) {
    const report = activeResult.aiReport;
    const isBp = activeResult.surveyId === 'encuesta-servicio-bp';

    const handleShareResultWhatsApp = () => {
      const text = `📊 *Resultado de Encuesta Wellbeing:* ${activeResult.surveyTitle}\n• Puntuación: ${activeResult.totalScore}/${activeResult.maxPossibleScore}\n• Diagnóstico: ${activeResult.levelInterpretation}\n\nRevisa la interpretación completa en la app Wellbeing.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleShareResultEmail = () => {
      const subject = encodeURIComponent(`[Wellbeing] Diagnóstico: ${activeResult.surveyTitle}`);
      const body = encodeURIComponent(
        `Hola,\n\nTe comparto el resultado de mi encuesta en Wellbeing:\n• Encuesta: ${activeResult.surveyTitle}\n• Puntuación: ${activeResult.totalScore}/${activeResult.maxPossibleScore}\n• Diagnóstico: ${activeResult.levelInterpretation}\n• Fecha: ${activeResult.completedAt}\n\nSíntesis Gemini AI:\n${report?.overallDiagnosis || ''}\n\nSaludos.`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
      <div className="max-w-2xl mx-auto pb-28 space-y-5 px-1 animate-fade-in text-white">
        {/* Header de Resultados */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/40">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
              Evaluación Completada
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1.5 text-white">{activeResult.surveyTitle}</h2>
            <p className="text-xs text-slate-400">Colaborador: {activeResult.userName}</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 inline-block">
            <div className="text-3xl font-black text-teal-400">
              {activeResult.totalScore} / {activeResult.maxPossibleScore}
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">
              Diagnóstico: <span className="text-white font-bold">{activeResult.levelInterpretation}</span>
            </div>
          </div>

          {/* Botones para compartir el resultado */}
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={handleShareResultWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Compartir vía WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleShareResultEmail}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Compartir por Correo</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Guardar PDF / Imprimir</span>
            </button>
          </div>
        </div>

        {/* Desglose por Dimensiones si es Servicio BP */}
        {isBp && activeResult.dimensionScores && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Semáforo y Puntuación por Dimensión
              </h3>
              <span className="text-[10px] text-slate-400">Meta: ≥85%</span>
            </div>

            <div className="space-y-2.5">
              {activeResult.dimensionScores.map((dim, idx) => {
                let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                let dot = '🟢 Fortaleza';
                if (dim.status === 'mejorar') {
                  badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                  dot = '🟡 A mejorar';
                } else if (dim.status === 'critico') {
                  badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
                  dot = '🔴 Prioridad';
                }

                return (
                  <div key={idx} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200 text-[11px] truncate pr-1">
                        {dim.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                          {dot}
                        </span>
                        <span className="font-mono text-white font-bold text-xs">
                          {dim.score}/{dim.maxScore}
                        </span>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          dim.status === 'fortaleza'
                            ? 'bg-emerald-400'
                            : dim.status === 'mejorar'
                            ? 'bg-amber-400'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${dim.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NPS Card */}
            {activeResult.npsScore !== undefined && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Calificación NPS Interno</h4>
                  <p className="text-[10px] text-slate-400">Probabilidad de recomendar el trabajo con el BP</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-400">{activeResult.npsScore}/10</span>
                  <div className="text-[10px] font-semibold text-slate-300">
                    {activeResult.npsScore >= 9
                      ? '🎉 Promotor'
                      : activeResult.npsScore >= 7
                      ? '⚖️ Pasivo'
                      : '⚠️ Detractor'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ALERTA CRÍTICA si existe en el reporte de Duelo */}
        {report?.alertNotice && (
          <div className="bg-rose-950/40 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-rose-300">Indicador de Atención Personal</h4>
              <p className="text-xs text-rose-200 mt-1 leading-relaxed">{report.alertNotice}</p>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="mt-2.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Hablar con People Business Partner
              </button>
            </div>
          </div>
        )}

        {/* REPORTE DE INTERPRETACIÓN ELABORADO CON GEMINI AI */}
        {report && (
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-2xl">
            {/* Header del reporte Gemini */}
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-500/40">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
                    Interpretación Analítica con Gemini AI
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-indigo-200">
                    Generado de manera inteligente para tu retroalimentación
                  </p>
                </div>
              </div>
            </div>

            {/* AVISO / DISCLAIMER OBLIGATORIO */}
            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/95 leading-relaxed font-medium">
                  <strong>Aviso Importante:</strong> {report.disclaimer}
                </p>
              </div>
            </div>

            {/* Diagnóstico Integral */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-teal-400" />
                Diagnóstico Integral
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {report.overallDiagnosis}
              </p>
            </div>

            {/* Fortalezas Clave */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Fortalezas Clave
              </h4>
              <ul className="space-y-1">
                {report.strengths.map((str, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Áreas de Oportunidad */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                Oportunidades & Puntos de Atención
              </h4>
              <ul className="space-y-1">
                {report.areasOfOpportunity.map((opp, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan de Acción Recomendado */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-1">
                Plan de Acción Recomendado
              </h4>
              <div className="space-y-1.5">
                {report.recommendedActionPlan.map((action, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Acciones finales */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setSelectedSurvey(null);
              setActiveResult(null);
              setIsCompleted(false);
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all text-center"
          >
            Volver a Encuestas
          </button>
          <button
            type="button"
            onClick={() => startSurvey(selectedSurvey)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repetir</span>
          </button>
        </div>
      </div>
    );
  }

  // VISTA 4: Ejecutor paso a paso de la Encuesta
  if (!currentQuestion) return null;

  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="max-w-xl mx-auto pb-28 space-y-4 text-white animate-fade-in px-1">
      {/* Barra superior de progreso */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-teal-400 truncate max-w-[220px]">
            {selectedSurvey.title}
          </span>
          <span className="font-mono font-bold text-white shrink-0">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Pregunta Activa */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 min-h-[280px] flex flex-col justify-between">
        <div>
          {currentQuestion.dimension && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-2.5">
              {currentQuestion.dimension}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Tipo de Opciones */}
        <div className="pt-1">
          {/* Caso 1: Escala Likert (1 a 5) */}
          {currentQuestion.type === 'likert' && (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 mb-1">
                Selecciona tu nivel de acuerdo:
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[
                  { val: 1, label: '1', sub: 'Total desacuerdo' },
                  { val: 2, label: '2', sub: 'En desacuerdo' },
                  { val: 3, label: '3', sub: 'Neutral' },
                  { val: 4, label: '4', sub: 'De acuerdo' },
                  { val: 5, label: '5', sub: 'Total acuerdo' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleSelectOption(item.val)}
                    className={`py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      currentAnswer === item.val
                        ? 'border-teal-400 bg-teal-500/20 text-teal-300 ring-2 ring-teal-400/30 font-bold scale-105'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-base font-bold">{item.val}</span>
                    <span className="text-[8px] sm:text-[9px] text-center mt-0.5 leading-tight line-clamp-2">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caso 2: Booleano Verdadero / Falso (Test de Duelo) */}
          {currentQuestion.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectOption('V')}
                className={`py-3.5 px-3 rounded-xl border text-center transition-all ${
                  currentAnswer === 'V'
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/40 font-bold'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-lg font-bold block">Verdadero (V)</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Me identifico
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectOption('F')}
                className={`py-3.5 px-3 rounded-xl border text-center transition-all ${
                  currentAnswer === 'F'
                    ? 'border-rose-400 bg-rose-500/20 text-rose-300 ring-2 ring-rose-400/40 font-bold'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-lg font-bold block">Falso (F)</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  No me identifico
                </span>
              </button>
            </div>
          )}

          {/* Caso 3: Escala NPS (0 al 10) */}
          {currentQuestion.type === 'nps' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>0 = Nada probable</span>
                <span>10 = Muy probable</span>
              </div>
              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectOption(val)}
                    className={`py-2 rounded-lg border text-center font-bold text-xs transition-all ${
                      currentAnswer === val
                        ? 'border-indigo-400 bg-indigo-500 text-white shadow-lg scale-110'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones de Navegación */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            disabled={currentAnswer === undefined}
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>{isLastQuestion ? 'Finalizar con IA' : 'Siguiente'}</span>
            {isLastQuestion ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
