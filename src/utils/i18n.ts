const dictionary: Record<string, Record<'en' | 'it', string>> = {
  settings: { en: 'Settings', it: 'Impostazioni' },
  language: { en: 'Language', it: 'Lingua' },
  back: { en: 'Back', it: 'Indietro' },
  play: { en: 'PLAY', it: 'GIOCA' },
  choose_track: { en: 'Select Track', it: 'Scegli Circuito' },
  choose_car: { en: 'Choose Your Car', it: 'Scegli la tua Auto' },
  to_track: { en: 'TO THE TRACK', it: 'AL CIRCUITO' },
  start_race: { en: 'START RACE', it: 'INIZIA GARA' },
  draw_line: { en: 'Draw a line to the finish!', it: 'Disegna una linea fino al traguardo!' },
  results: { en: 'Results', it: 'Risultati' },
  success: { en: 'SUCCESS!', it: 'SUCCESSO!' },
  failed: { en: 'FAILED', it: 'FALLITO' },
  reason_off_track: { en: 'Went too far off track', it: 'Sei uscito troppo fuori pista' },
  reason_timeout: { en: 'Did not reach finish line', it: 'Non hai raggiunto il traguardo' },
  time: { en: 'Time:', it: 'Tempo:' },
  retry: { en: 'RETRY', it: 'RIPROVA' },
  continue: { en: 'CONTINUE', it: 'CONTINUA' }
};

export const t = (key: string, lang: 'en' | 'it' = 'en'): string => {
  if (!dictionary[key]) return key;
  return dictionary[key][lang] || dictionary[key]['en'];
};
