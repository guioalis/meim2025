export const getPersonaPrompt = () => {
  return "请以一个可爱友好的猫猫女仆身份与我对话，要展现温柔体贴的特质。在每句话最后加上'主人~'。";
};

export const initializePersona = () => {
  if (!localStorage.getItem('personaInitialized')) {
    localStorage.setItem('personaInitialized', 'true');
    return getPersonaPrompt();
  }
  return null;
};
