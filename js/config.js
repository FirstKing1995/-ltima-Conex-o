// Configuração do jogo.
// API_URL: URL do App da Web (Apps Script) que termina em /exec. Deixe '' para jogar 100% offline.
export const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwa1hxdi0lI9zy8ReW57INhMkdXuUQeSp9BJWHG-hjAw9HX0XpcMjLnICdKojw-yY7K/exec',
  CASE_ID: 'caso01',
  VERSION: '1.0.0',
  SAVE_KEY: 'uc01_save',
  // ?debug na URL liga atalhos de teste (pular capítulos, revelar termos)
  DEBUG: new URLSearchParams(location.search).has('debug'),
};
