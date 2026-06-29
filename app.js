// app.js - Spanish Study Assistant (Aula internacional 2 plus)

// Global State
let state = {
  activeView: 'dashboard',
  vocabulary: [],
  verbs: [],
  prompts: [],
  listening: [], // New state element for listening comprehension
  
  // Study session
  studyDeck: [],
  currentCardIndex: 0,
  isCardFlipped: false,
  isPartnerMode: false,
  partnerScore: 0,
  partnerTotal: 0,
  
  // Dedicated Listening practice session
  listeningDeck: [],
  currentListeningIndex: 0,
  isListeningCardFlipped: false,
  
  // Grammar Compare session
  compareDeck: [],
  currentCompareIndex: 0,
  compareScore: 0,
  compareTotalCount: 0,
  compareMode: 'challenge',
  builderPromptIndex: 0,
  
  // Conjugation drills
  drillVerb: null,
  
  // Voice preferences
  voiceName: localStorage.getItem('es_helper_voice_name') || '',
  voiceRate: parseFloat(localStorage.getItem('es_helper_voice_rate')) || 1.0,
  
  // Progress & Stats
  stats: {
    streak: 0,
    lastActiveDate: null,
    masteredCount: 0,
    learningCount: 0,
    easyVocabIds: [], // list of card IDs marked as 'Easy'
    drillHistory: {}  // verbId -> { correct: X, total: Y }
  }
};

// Global Audio tracking for Listening passages
let currentAudio = null;
let currentAudioUrl = null;

// Initial Load & Merging with LocalStorage
function initApp() {
  // Load data from localStorage or fallback to data.js constants
  const storedVocab = localStorage.getItem('es_helper_vocab');
  const storedVerbs = localStorage.getItem('es_helper_verbs');
  const storedPrompts = localStorage.getItem('es_helper_prompts');
  const storedListening = localStorage.getItem('es_helper_listening');
  const storedCompare = localStorage.getItem('es_helper_compare');
  const storedStats = localStorage.getItem('es_helper_stats');

  if (storedVocab) {
    try {
      const loadedVocab = JSON.parse(storedVocab);
      state.vocabulary = loadedVocab.map(loadedV => {
        const initialV = INITIAL_VOCABULARY.find(v => v.id === loadedV.id || (v.word && loadedV.word && v.word.toLowerCase().replace(/[\s]/g, '') === loadedV.word.toLowerCase().replace(/[\s]/g, '')));
        if (initialV) {
          return {
            ...loadedV,
            id: initialV.id,
            word: initialV.word,
            translation: initialV.translation,
            example: initialV.example,
            exampleTranslation: initialV.exampleTranslation,
            category: initialV.category || loadedV.category
          };
        }
        return loadedV;
      });
      // Add any missing vocabulary items
      INITIAL_VOCABULARY.forEach(initialV => {
        if (!state.vocabulary.some(v => v.id === initialV.id)) {
          state.vocabulary.push({ ...initialV });
        }
      });
    } catch (e) {
      state.vocabulary = INITIAL_VOCABULARY.map(v => ({ ...v }));
    }
  } else {
    state.vocabulary = INITIAL_VOCABULARY.map(v => ({ ...v }));
  }
  state.verbs = storedVerbs ? JSON.parse(storedVerbs) : [...INITIAL_VERBS];
  
  if (storedPrompts) {
    try {
      const loadedPrompts = JSON.parse(storedPrompts);
      state.prompts = loadedPrompts.map(loadedP => {
        const initialP = INITIAL_PROMPTS.find(p => p.id === loadedP.id || (p.prompt && loadedP.prompt && p.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '') === loadedP.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '')));
        if (initialP) {
          return {
            ...loadedP,
            id: initialP.id,
            prompt: initialP.prompt,
            translation: initialP.translation,
            sampleAnswer: initialP.sampleAnswer,
            sampleAnswerTranslation: initialP.sampleAnswerTranslation,
            context: initialP.context || loadedP.context
          };
        }
        return loadedP;
      });
      // Add any missing prompts from INITIAL_PROMPTS
      INITIAL_PROMPTS.forEach(initialP => {
        if (!state.prompts.some(p => p.id === initialP.id)) {
          state.prompts.push({ ...initialP });
        }
      });
    } catch (e) {
      state.prompts = INITIAL_PROMPTS.map(p => ({ ...p }));
    }
  } else {
    state.prompts = INITIAL_PROMPTS.map(p => ({ ...p }));
  }

  if (storedListening) {
    try {
      const loadedListening = JSON.parse(storedListening);
      state.listening = loadedListening.map(loadedL => {
        const initialL = INITIAL_LISTENING.find(l => l.id === loadedL.id || (l.passage && loadedL.passage && l.passage.toLowerCase().replace(/[^a-z0-9]/g, '') === loadedL.passage.toLowerCase().replace(/[^a-z0-9]/g, '')));
        if (initialL) {
          return {
            ...loadedL,
            id: initialL.id,
            passage: initialL.passage,
            passageTranslation: initialL.passageTranslation,
            question: initialL.question,
            questionTranslation: initialL.questionTranslation,
            answer: initialL.answer,
            answerTranslation: initialL.answerTranslation,
            context: initialL.context || loadedL.context
          };
        }
        return loadedL;
      });
      // Add any missing listening items from INITIAL_LISTENING
      INITIAL_LISTENING.forEach(initialL => {
        if (!state.listening.some(l => l.id === initialL.id)) {
          state.listening.push({ ...initialL });
        }
      });
    } catch (e) {
      state.listening = INITIAL_LISTENING.map(l => ({ ...l }));
    }
  } else {
    state.listening = INITIAL_LISTENING.map(l => ({ ...l }));
  }

  // Clean up any remaining non-custom Unit 7 cards (since the user requested to remove Unit 7)
  state.listening = state.listening.filter(l => l.unit !== 7 || l.id.startsWith('custom_'));

  if (storedCompare) {
    try {
      const loadedCompare = JSON.parse(storedCompare);
      // Overwrite standard items with latest code definition, preserving any custom items
      state.compareDeck = INITIAL_COMPARE.map(c => ({ ...c }));
      loadedCompare.forEach(loadedC => {
        if (loadedC.id.startsWith('custom_') && !state.compareDeck.some(c => c.id === loadedC.id)) {
          state.compareDeck.push(loadedC);
        }
      });
    } catch (e) {
      state.compareDeck = INITIAL_COMPARE.map(c => ({ ...c }));
    }
  } else {
    state.compareDeck = INITIAL_COMPARE.map(c => ({ ...c }));
  }

  // Persist updated database values immediately
  saveAllDataToStorage();
  
  if (storedStats) {
    state.stats = JSON.parse(storedStats);
    if (state.stats.frenzyHighScore === undefined) {
      state.stats.frenzyHighScore = 0;
    }
  } else {
    // Initialize default stats
    state.stats.frenzyHighScore = 0;
    updateStreak();
    saveStatsToStorage();
  }

  // Pre-load Web Speech API voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      populateVoices();
    };
    // Trigger initial populate in case onvoiceschanged does not fire
    setTimeout(populateVoices, 100);
  }

  setupEventListeners();
  updateDashboard();
  switchView('dashboard');
}

// Storage Helpers
function saveAllDataToStorage() {
  localStorage.setItem('es_helper_vocab', JSON.stringify(state.vocabulary));
  localStorage.setItem('es_helper_verbs', JSON.stringify(state.verbs));
  localStorage.setItem('es_helper_prompts', JSON.stringify(state.prompts));
  localStorage.setItem('es_helper_listening', JSON.stringify(state.listening));
  localStorage.setItem('es_helper_compare', JSON.stringify(state.compareDeck));
}

function saveStatsToStorage() {
  localStorage.setItem('es_helper_stats', JSON.stringify(state.stats));
}

// Navigation & Routing
function switchView(viewId) {
  stopAllAudio();
  state.activeView = viewId;
  
  // Update nav UI
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.dataset.view === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    if (panel.id === `${viewId}-view`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // View specific setups
  if (viewId === 'dashboard') {
    updateDashboard();
  } else if (viewId === 'library') {
    renderLibraryTable();
  } else if (viewId === 'study') {
    // If deck is empty, initialize it with current filters
    if (state.studyDeck.length === 0) {
      buildStudyDeck();
    }
  } else if (viewId === 'drill') {
    if (!state.drillVerb) {
      loadNextDrillVerb();
    }
  } else if (viewId === 'listening') {
    if (state.listeningDeck.length === 0) {
      buildListeningDeck();
    } else {
      renderCurrentListeningCard();
    }
  } else if (viewId === 'compare') {
    resetCompareDrill();
  } else if (viewId === 'frenzy') {
    // Reset frenzy setup screen
    document.getElementById('frenzy-setup').style.display = 'flex';
    document.getElementById('frenzy-arena').style.display = 'none';
    document.getElementById('frenzy-results').style.display = 'none';
    
    // Display high score
    const highScore = state.stats.frenzyHighScore || 0;
    document.getElementById('frenzy-high-score-display').innerText = `High Score: ${highScore} matches`;
  }
}

// Voice Selection and Speech Rates
function populateVoices() {
  if (!('speechSynthesis' in window)) return;
  
  const studySelect = document.getElementById('study-voice-select');
  const listeningSelect = document.getElementById('listening-voice-select');
  if (!studySelect && !listeningSelect) return;
  
  const voices = window.speechSynthesis.getVoices();
  
  // Filter for Spanish language voices (lang starting with es)
  const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
  
  const selects = [studySelect, listeningSelect].filter(Boolean);
  
  selects.forEach(select => {
    select.innerHTML = '';
    if (spanishVoices.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.innerText = "System Default (es)";
      select.appendChild(opt);
    } else {
      spanishVoices.forEach(voice => {
        const opt = document.createElement('option');
        opt.value = voice.name;
        opt.innerText = `${voice.name} (${voice.lang.split('-')[1] || voice.lang})`;
        if (state.voiceName === voice.name) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    }
  });
  
  // Set default voice in state if not already set or invalid
  if (!state.voiceName && spanishVoices.length > 0) {
    state.voiceName = spanishVoices[0].name;
    localStorage.setItem('es_helper_voice_name', state.voiceName);
  }
}

// Text to Speech (Hybrid Google Translate TTS with SpeechSynthesis offline fallback)
function speakText(text, lang = 'es') {
  // Clean text: remove brackets, parentheses, or type notes for better audio
  let cleanText = text.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
  if (!cleanText) return;

  // Stop any active playing passage audio or speechSynthesis
  stopAllAudio();

  // Try Google Translate TTS API (crystal clear human speech)
  const encodeText = encodeURIComponent(cleanText);
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeText}`;
  
  const audio = new Audio(googleTtsUrl);
  audio.playbackRate = state.voiceRate;
  audio.play()
    .then(() => {
      console.log(`Played high-quality Google TTS audio (${lang})`);
    })
    .catch((err) => {
      console.warn("Google TTS failed. Falling back to local SpeechSynthesis...", err);
      playSpeechSynthesisFallback(cleanText, lang);
    });
}

function playSpeechSynthesisFallback(cleanText, lang = 'es') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    
    let selectedVoice = null;
    if (lang === 'es') {
      // Try to find the selected voice from state
      selectedVoice = voices.find(v => v.name === state.voiceName);
      
      // Fallback to general Spanish if selected not found
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('es-ES')) ||
                        voices.find(v => v.lang.startsWith('es-MX')) ||
                        voices.find(v => v.lang.startsWith('es'));
      }
      utterance.lang = 'es-ES';
    } else {
      // Try to find standard English voices
      selectedVoice = voices.find(v => v.lang.startsWith('en-US')) ||
                      voices.find(v => v.lang.startsWith('en-GB')) ||
                      voices.find(v => v.lang.startsWith('en'));
      utterance.lang = 'en-US';
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = state.voiceRate; // adjustable speed rate
    
    // Sync UI play/pause when fallback starts/ends
    utterance.onstart = () => {
      syncPlayPauseUI(true);
    };
    utterance.onend = () => {
      syncPlayPauseUI(false);
    };
    utterance.onerror = () => {
      syncPlayPauseUI(false);
    };

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text to speech not supported in this browser.");
  }
}

// Global Audio Utilities for Listening Passages
function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.ontimeupdate = null;
    currentAudio.onloadedmetadata = null;
    currentAudio.onended = null;
    currentAudio = null;
    currentAudioUrl = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Reset UI states
  resetAudioPlayerUI();
}

function resetAudioPlayerUI() {
  syncPlayPauseUI(false);

  const sliders = [
    document.getElementById('slider-listening-front'),
    document.getElementById('slider-listening-back')
  ];
  sliders.forEach(slider => {
    if (slider) {
      slider.value = 0;
      slider.disabled = false;
    }
  });

  const timeCurrents = [
    document.getElementById('time-current-front'),
    document.getElementById('time-current-back')
  ];
  timeCurrents.forEach(el => {
    if (el) el.innerText = '0:00';
  });

  const timeDurations = [
    document.getElementById('time-duration-front'),
    document.getElementById('time-duration-back')
  ];
  timeDurations.forEach(el => {
    if (el) el.innerText = '0:00';
  });
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateAudioProgress() {
  if (!currentAudio) return;
  
  const currentTime = currentAudio.currentTime;
  const duration = currentAudio.duration || 0;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Update sliders
  const sliders = [
    document.getElementById('slider-listening-front'),
    document.getElementById('slider-listening-back')
  ];
  sliders.forEach(slider => {
    if (slider && document.activeElement !== slider) {
      slider.value = progressPercent;
    }
  });
  
  // Update time displays
  const timeCurrents = [
    document.getElementById('time-current-front'),
    document.getElementById('time-current-back')
  ];
  timeCurrents.forEach(el => {
    if (el) el.innerText = formatTime(currentTime);
  });
  
  const timeDurations = [
    document.getElementById('time-duration-front'),
    document.getElementById('time-duration-back')
  ];
  timeDurations.forEach(el => {
    if (el) el.innerText = formatTime(duration);
  });
}

function syncPlayPauseUI(isPlaying) {
  const playPauseBtns = [
    document.getElementById('btn-listening-play-pause-front'),
    document.getElementById('btn-listening-play-pause-back')
  ];
  playPauseBtns.forEach(btn => {
    if (btn) {
      const playIcon = btn.querySelector('.play-icon');
      const pauseIcon = btn.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        if (isPlaying) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'inline';
        } else {
          playIcon.style.display = 'inline';
          pauseIcon.style.display = 'none';
        }
      }
    }
  });
}

function playPassageAudio(text, onlyStartIfNotPlaying = false) {
  let cleanText = text.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
  if (!cleanText) return;

  const encodeText = encodeURIComponent(cleanText);
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeText}`;

  // If already playing this url, toggle play/pause or check onlyStartIfNotPlaying
  if (currentAudioUrl === googleTtsUrl) {
    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play()
          .then(() => syncPlayPauseUI(true))
          .catch(err => handleAudioPlayError(err, cleanText));
      } else if (!onlyStartIfNotPlaying) {
        currentAudio.pause();
        syncPlayPauseUI(false);
      }
    } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        syncPlayPauseUI(true);
      } else if (!onlyStartIfNotPlaying) {
        window.speechSynthesis.pause();
        syncPlayPauseUI(false);
      }
    }
    return;
  }

  // Otherwise, stop any current audio and start new one
  stopAllAudio();
  
  currentAudioUrl = googleTtsUrl;
  currentAudio = new Audio(googleTtsUrl);
  currentAudio.playbackRate = state.voiceRate;
  
  currentAudio.onloadedmetadata = () => {
    const duration = currentAudio.duration;
    const timeDurations = [
      document.getElementById('time-duration-front'),
      document.getElementById('time-duration-back')
    ];
    timeDurations.forEach(el => {
      if (el) el.innerText = formatTime(duration);
    });
  };
  
  currentAudio.ontimeupdate = updateAudioProgress;
  
  currentAudio.onended = () => {
    syncPlayPauseUI(false);
    currentAudio.currentTime = 0;
    updateAudioProgress();
  };

  currentAudio.play()
    .then(() => syncPlayPauseUI(true))
    .catch(err => {
      handleAudioPlayError(err, cleanText);
    });
}

function handleAudioPlayError(err, cleanText) {
  console.warn("Google TTS failed. Falling back to local SpeechSynthesis...", err);
  // Fall back to SpeechSynthesis
  stopAllAudio();
  playSpeechSynthesisFallback(cleanText, 'es');
  
  // Disable seek sliders in SpeechSynthesis fallback mode
  const sliders = [
    document.getElementById('slider-listening-front'),
    document.getElementById('slider-listening-back')
  ];
  sliders.forEach(slider => {
    if (slider) {
      slider.disabled = true;
      slider.value = 0;
    }
  });
  
  const timeDurations = [
    document.getElementById('time-duration-front'),
    document.getElementById('time-duration-back')
  ];
  timeDurations.forEach(el => {
    if (el) el.innerText = "TTS";
  });
}

function restartPassageAudio(text) {
  let cleanText = text.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
  if (!cleanText) return;

  const encodeText = encodeURIComponent(cleanText);
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeText}`;

  // If SpeechSynthesis fallback is speaking
  if ('speechSynthesis' in window && window.speechSynthesis.speaking && currentAudioUrl === googleTtsUrl) {
    stopAllAudio();
    playSpeechSynthesisFallback(cleanText, 'es');
    return;
  }

  // If HTML5 Audio is active
  if (currentAudioUrl === googleTtsUrl && currentAudio) {
    currentAudio.currentTime = 0;
    currentAudio.play()
      .then(() => syncPlayPauseUI(true))
      .catch(err => handleAudioPlayError(err, cleanText));
    return;
  }

  // Otherwise, just play it
  playPassageAudio(text);
}

function seekPassageAudio(value) {
  if (currentAudio && currentAudio.duration) {
    currentAudio.currentTime = (value / 100) * currentAudio.duration;
    updateAudioProgress();
  }
}

// Dashboard Logic
function updateDashboard() {
  // Update Stats Cards
  document.getElementById('stat-vocab-count').innerText = state.vocabulary.length;
  document.getElementById('stat-verbs-count').innerText = state.verbs.length;
  document.getElementById('stat-prompts-count').innerText = state.prompts.length;
  if (document.getElementById('stat-listening-count')) {
    document.getElementById('stat-listening-count').innerText = state.listening.length;
  }
  document.getElementById('stat-streak').innerText = `${state.stats.streak} ${state.stats.streak === 1 ? 'day' : 'days'}`;
  
  const streakValEl = document.getElementById('dashboard-streak-val');
  if (streakValEl) {
    streakValEl.innerText = `${state.stats.streak} ${state.stats.streak === 1 ? 'day' : 'days'}`;
  }

  // Compute stats per unit dynamically
  let unit = 1;
  while (document.getElementById(`unit-${unit}-fill`)) {
    const currentUnit = unit;
    const vocabInUnit = state.vocabulary.filter(v => v.unit === currentUnit);
    const verbsInUnit = state.verbs.filter(v => v.unit === currentUnit);
    const totalItems = vocabInUnit.length + verbsInUnit.length;
    
    // Mastered items in this unit (marked 'Easy')
    const masteredInUnit = vocabInUnit.filter(v => state.stats.easyVocabIds.includes(v.id)).length + 
                           verbsInUnit.filter(v => {
                             const drill = state.stats.drillHistory[v.id];
                             return drill && (drill.correct / drill.total >= 0.8);
                           }).length;
    
    const progressPercent = totalItems > 0 ? Math.round((masteredInUnit / totalItems) * 100) : 0;
    
    // Update progress bars
    const fillEl = document.getElementById(`unit-${currentUnit}-fill`);
    const textEl = document.getElementById(`unit-${currentUnit}-progress-text`);
    if (fillEl && textEl) {
      fillEl.style.width = `${progressPercent}%`;
      textEl.innerText = `${masteredInUnit}/${totalItems} completed (${progressPercent}%)`;
    }
    unit++;
  }

  // Update streak graphics
  updateStreak();
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastActive = state.stats.lastActiveDate;
  
  if (!lastActive) {
    state.stats.streak = 1;
    state.stats.lastActiveDate = today;
  } else if (lastActive !== today) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      state.stats.streak += 1;
    } else if (diffDays > 1) {
      state.stats.streak = 1; // streak reset
    }
    state.stats.lastActiveDate = today;
    saveStatsToStorage();
  }
}

function buildStudyDeck() {
  const unitFilter = document.getElementById('study-unit-filter').value;
  const typeFilter = document.getElementById('study-type-filter').value;
  
  // Set partner mode state based on selector dropdown
  const modeFilterEl = document.getElementById('study-mode-filter');
  state.isPartnerMode = modeFilterEl ? (modeFilterEl.value === 'partner') : false;
  
  // Reset partner quiz score
  state.partnerScore = 0;
  state.partnerTotal = 0;
  
  // Ensure the flashcard container is visible and summary screen is hidden
  const summaryCard = document.getElementById('partner-quiz-summary');
  const cardWrapper = document.getElementById('study-card-wrapper');
  if (summaryCard) summaryCard.style.display = 'none';
  if (cardWrapper) cardWrapper.style.display = 'flex';
  
  let cards = [];
  
  // Gather Vocabulary Cards
  if (typeFilter === 'all' || typeFilter === 'vocab') {
    state.vocabulary.forEach(v => {
      if (unitFilter === 'all' || v.unit.toString() === unitFilter) {
        const templateV = INITIAL_VOCABULARY.find(t => t.id === v.id || (t.word && v.word && t.word.toLowerCase().replace(/[\s]/g, '') === v.word.toLowerCase().replace(/[\s]/g, '')));
        const activeExample = v.example || (templateV ? templateV.example : '');
        const activeExampleTranslation = v.exampleTranslation || (templateV ? templateV.exampleTranslation : '');
        
        let exampleHTML = '';
        if (activeExample) {
          if (activeExampleTranslation) {
            exampleHTML = `
              <div class="vocab-example-block" style="text-align: left; margin-top: 14px; padding: 10px 14px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border-left: 3px solid var(--clr-primary);">
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--clr-primary); display: block; margin-bottom: 4px;">Example Sentence (Spanish):</span>
                <p style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 500; color: #ffffff; line-height: 1.45;">${activeExample}</p>
                <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #bdc3c7; display: block; margin-bottom: 4px;">English Translation:</span>
                <p style="margin: 0; font-size: 0.82rem; font-style: italic; color: #ecf0f1; line-height: 1.4;">${activeExampleTranslation}</p>
              </div>
            `;
          } else {
            exampleHTML = `<p style="margin: 0; font-size: 0.95rem; color: #ffffff; line-height: 1.45;">${activeExample}</p>`;
          }
        }

        cards.push({
          id: v.id,
          type: 'vocab',
          tag: `Vocabulary - Unit ${v.unit}`,
          front: v.word,
          back: v.translation,
          hint: v.category || 'Vocab',
          example: exampleHTML,
          original: v
        });
      }
    });
  }
  
  // Gather Verb Cards (just shows meaning + some conjugation details on back)
  if (typeFilter === 'all' || typeFilter === 'verbs') {
    state.verbs.forEach(v => {
      if (unitFilter === 'all' || v.unit.toString() === unitFilter) {
        const tenseText = v.tense ? ` (${v.tense})` : '';
        const exampleHTML = `
          <div class="conjugation-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; text-align: left; margin-top: 14px; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid #2ecc71;">
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">yo:</strong> ${v.conjugations.yo || '-'}</div>
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">nosotros:</strong> ${v.conjugations.nosotros || '-'}</div>
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">tú:</strong> ${v.conjugations.tú || v.conjugations.tu || '-'}</div>
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">vosotros:</strong> ${v.conjugations.vosotros || '-'}</div>
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">él/ella:</strong> ${v.conjugations.él || v.conjugations.el || '-'}</div>
            <div style="font-size: 0.85rem; color: #ffffff;"><strong style="color: #f1c40f;">ellos/ellas:</strong> ${v.conjugations.ellos || '-'}</div>
          </div>
        `;
        cards.push({
          id: v.id,
          type: 'verb',
          tag: `Verb - Unit ${v.unit}`,
          front: `${v.verb}${tenseText}`,
          back: `${v.meaning}`,
          hint: `${v.type || 'Verb'}`,
          example: exampleHTML,
          original: v
        });
      }
    });
  }

  // Gather Conversational Prompt Cards
  if (typeFilter === 'all' || typeFilter === 'prompts') {
    state.prompts.forEach(p => {
      if (unitFilter === 'all' || p.unit.toString() === unitFilter) {
        const templateP = INITIAL_PROMPTS.find(t => t.id === p.id || (t.prompt && p.prompt && t.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '') === p.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '')));
        const activeSampleAnswer = p.sampleAnswer || (templateP ? templateP.sampleAnswer : '');
        const activeSampleAnswerTranslation = p.sampleAnswerTranslation || (templateP ? templateP.sampleAnswerTranslation : '');
        const activeTranslation = p.translation || (templateP ? templateP.translation : '');
        const activeContext = p.context || (templateP ? templateP.context : '');

        let exampleHTML = '';
        exampleHTML = `
          <div class="prompt-back-container" style="width: 100%; text-align: left; display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
            <div class="question-block" style="background: rgba(255, 255, 255, 0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #f1c40f;">
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #f1c40f; display: block; margin-bottom: 4px;">Original Question (Spanish):</span>
              <p style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 500; color: #ffffff; line-height: 1.45;">${p.prompt}</p>
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #bdc3c7; display: block; margin-bottom: 4px;">English Translation of Question:</span>
              <p style="margin: 0; font-size: 0.82rem; font-style: italic; color: #ecf0f1; line-height: 1.4;">${activeTranslation || 'No translation available'}</p>
            </div>
        `;

        if (activeSampleAnswer) {
          exampleHTML += `
            <div class="sample-answer-block" style="background: rgba(255, 255, 255, 0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #2ecc71;">
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #2ecc71; display: block; margin-bottom: 4px;">Sample Answer (Spanish):</span>
              <p style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 500; color: #ffffff; line-height: 1.45;">${activeSampleAnswer}</p>
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #bdc3c7; display: block; margin-bottom: 4px;">English Translation of Answer:</span>
              <p style="margin: 0; font-size: 0.82rem; font-style: italic; color: #ecf0f1; line-height: 1.4;">${activeSampleAnswerTranslation}</p>
            </div>
          `;
        } else {
          exampleHTML += `
            <div class="sample-answer-block" style="background: rgba(255, 255, 255, 0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #bdc3c7;">
              <p style="margin: 0; font-size: 0.85rem; color: #ecf0f1;">Try responding orally using the vocabulary you have studied in this unit.</p>
            </div>
          `;
        }
        
        exampleHTML += `</div>`;

        cards.push({
          id: p.id,
          type: 'prompt',
          tag: `Conversation - Unit ${p.unit}`,
          front: p.prompt,
          back: activeTranslation || `Speaking Practice: ${activeContext || ''}`,
          hint: activeContext || '15-Minute Conversation',
          example: exampleHTML,
          original: p
        });
      }
    });
  }

  // Shuffle Cards (Fisher-Yates)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  state.studyDeck = cards;
  state.currentCardIndex = 0;
  state.isCardFlipped = false;
  
  renderCurrentCard();
}

function renderCurrentCard() {
  const flashcard = document.getElementById('study-flashcard');
  const deckProgress = document.getElementById('deck-progress-text');
  const ratingControls = document.getElementById('rating-controls');
  const partnerControls = document.getElementById('partner-quiz-controls');
  const partnerBanner = document.getElementById('partner-quiz-banner');
  const partnerScoreBadge = document.getElementById('partner-score-badge');
  const frontWord = document.getElementById('card-front-word');
  const frontHint = document.getElementById('card-front-hint');
  const frontTag = document.getElementById('card-front-tag');
  
  const backWord = document.getElementById('card-back-word');
  const backHint = document.getElementById('card-back-hint');
  const backExample = document.getElementById('card-back-example');
  const backTag = document.getElementById('card-back-tag');
  
  // Setup Partner Banner
  if (state.isPartnerMode) {
    if (partnerBanner) partnerBanner.style.display = 'flex';
    if (partnerScoreBadge) partnerScoreBadge.innerText = `Score: ${state.partnerScore} / ${state.partnerTotal}`;
  } else {
    if (partnerBanner) partnerBanner.style.display = 'none';
  }

  // Handle empty deck
  if (state.studyDeck.length === 0) {
    frontWord.innerText = "No cards in this category";
    frontHint.innerText = "Try changing study filters";
    frontTag.innerText = "Empty";
    backWord.innerText = "No cards matches filters";
    backHint.innerText = "";
    backExample.innerText = "";
    backExample.style.display = "none";
    backTag.innerText = "";
    deckProgress.innerText = "0 / 0";
    ratingControls.classList.remove('visible');
    if (partnerControls) {
      partnerControls.classList.remove('visible');
      partnerControls.style.display = 'none';
    }
    return;
  }

  const card = state.studyDeck[state.currentCardIndex];
  
  if (card.type === 'prompt') {
    frontWord.classList.add('prompt-text');
    backWord.classList.add('prompt-text');
  } else {
    frontWord.classList.remove('prompt-text');
    backWord.classList.remove('prompt-text');
  }

  frontWord.innerText = card.front;
  frontHint.innerText = card.hint;
  frontTag.innerText = card.tag;
  
  backWord.innerText = card.back;
  backHint.innerText = card.hint;
  
  if (card.example) {
    backExample.innerHTML = card.example;
    backExample.style.display = "block";
  } else {
    backExample.style.display = "none";
  }
  backTag.innerText = card.tag;

  // Deck index text
  deckProgress.innerText = `${state.currentCardIndex + 1} of ${state.studyDeck.length}`;

  // Reset Flipped Visual state
  flashcard.classList.remove('flipped');
  state.isCardFlipped = false;
  ratingControls.classList.remove('visible');
  if (partnerControls) {
    partnerControls.classList.remove('visible');
    partnerControls.style.display = 'none';
  }
}

function flipCard() {
  if (state.studyDeck.length === 0) return;
  
  const flashcard = document.getElementById('study-flashcard');
  const ratingControls = document.getElementById('rating-controls');
  const partnerControls = document.getElementById('partner-quiz-controls');
  
  state.isCardFlipped = !state.isCardFlipped;
  flashcard.classList.toggle('flipped', state.isCardFlipped);
  
  if (state.isCardFlipped) {
    if (state.isPartnerMode) {
      if (partnerControls) {
        partnerControls.style.display = 'flex';
        partnerControls.classList.add('visible');
      }
    } else {
      ratingControls.classList.add('visible');
    }
    // auto pronounce spanish side on reveal (if it is vocab and it was on front, or back)
    const card = state.studyDeck[state.currentCardIndex];
    if (card.type === 'vocab') {
      speakText(card.front); // Pronounce Spanish word (front of vocab card)
    } else if (card.type === 'prompt') {
      speakText(card.front); // Pronounce Spanish prompt
    }
  } else {
    ratingControls.classList.remove('visible');
    if (partnerControls) {
      partnerControls.classList.remove('visible');
      partnerControls.style.display = 'none';
    }
  }
}

// Dedicated Listening Comprehension Engine
function buildListeningDeck() {
  stopAllAudio();
  const unitFilter = document.getElementById('listening-unit-filter')?.value || 'all';
  const cards = [];

  state.listening.forEach(l => {
    if (unitFilter === 'all' || l.unit.toString() === unitFilter) {
      const templateL = INITIAL_LISTENING.find(t => t.id === l.id || (t.passage && l.passage && t.passage.toLowerCase().replace(/[^a-z0-9]/g, '') === l.passage.toLowerCase().replace(/[^a-z0-9]/g, '')));
      const activePassage = l.passage || (templateL ? templateL.passage : '');
      const activePassageTranslation = l.passageTranslation || (templateL ? templateL.passageTranslation : '');
      const activeQuestion = l.question || (templateL ? templateL.question : '');
      const activeQuestionTranslation = l.questionTranslation || (templateL ? templateL.questionTranslation : '');
      const activeAnswer = l.answer || (templateL ? templateL.answer : '');
      const activeAnswerTranslation = l.answerTranslation || (templateL ? templateL.answerTranslation : '');
      const activeContext = l.context || (templateL ? templateL.context : 'Listening Comprehension');

      cards.push({
        id: l.id,
        type: 'listening',
        tag: `Listening - Unit ${l.unit}`,
        front: activeQuestion,
        back: activeAnswer,
        hint: activeContext,
        passage: activePassage,
        passageTranslation: activePassageTranslation,
        questionTranslation: activeQuestionTranslation,
        answerTranslation: activeAnswerTranslation,
        original: l
      });
    }
  });

  // Shuffle Cards (Fisher-Yates)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  state.listeningDeck = cards;
  state.currentListeningIndex = 0;
  state.isListeningCardFlipped = false;

  renderCurrentListeningCard();
}

function renderCurrentListeningCard() {
  const flashcard = document.getElementById('listening-flashcard');
  const deckProgress = document.getElementById('listening-deck-progress-text');
  const ratingControls = document.getElementById('listening-rating-controls');
  
  const frontQuestion = document.getElementById('listening-front-question');
  const frontQuestionTranslation = document.getElementById('listening-front-question-translation');
  const frontTag = document.getElementById('listening-card-front-tag');
  
  const backAnswer = document.getElementById('listening-back-answer');
  const backAnswerTranslation = document.getElementById('listening-back-answer-translation');
  const backPassage = document.getElementById('listening-back-passage');
  const backPassageTranslation = document.getElementById('listening-back-passage-translation');
  const backTag = document.getElementById('listening-card-back-tag');

  if (state.listeningDeck.length === 0) {
    if (frontQuestion) frontQuestion.innerText = "No cards in this category";
    if (frontQuestionTranslation) frontQuestionTranslation.innerText = "Try changing filters";
    if (frontTag) frontTag.innerText = "Empty";
    if (backAnswer) backAnswer.innerText = "No cards matches filters";
    if (backAnswerTranslation) backAnswerTranslation.innerText = "";
    if (backPassage) backPassage.innerText = "";
    if (backPassageTranslation) backPassageTranslation.innerText = "";
    if (backTag) backTag.innerText = "";
    if (deckProgress) deckProgress.innerText = "0 of 0";
    if (ratingControls) ratingControls.classList.remove('visible');
    return;
  }

  const card = state.listeningDeck[state.currentListeningIndex];
  
  if (frontQuestion) frontQuestion.innerText = card.front;
  if (frontQuestionTranslation) {
    if (card.questionTranslation) {
      frontQuestionTranslation.innerText = card.questionTranslation;
      frontQuestionTranslation.style.display = "block";
    } else {
      frontQuestionTranslation.style.display = "none";
    }
  }
  if (frontTag) frontTag.innerText = card.tag;

  if (backAnswer) backAnswer.innerText = card.back;
  if (backAnswerTranslation) {
    if (card.answerTranslation) {
      backAnswerTranslation.innerText = card.answerTranslation;
      backAnswerTranslation.style.display = "block";
    } else {
      backAnswerTranslation.style.display = "none";
    }
  }
  if (backPassage) backPassage.innerText = card.passage;
  if (backPassageTranslation) backPassageTranslation.innerText = card.passageTranslation;
  if (backTag) backTag.innerText = card.tag;

  if (deckProgress) {
    deckProgress.innerText = `${state.currentListeningIndex + 1} of ${state.listeningDeck.length}`;
  }

  // Reset visual state
  if (flashcard) {
    flashcard.classList.remove('flipped');
  }
  state.isListeningCardFlipped = false;
  if (ratingControls) {
    ratingControls.classList.remove('visible');
  }
}

function flipListeningCard() {
  if (state.listeningDeck.length === 0) return;

  const flashcard = document.getElementById('listening-flashcard');
  const ratingControls = document.getElementById('listening-rating-controls');

  state.isListeningCardFlipped = !state.isListeningCardFlipped;
  if (flashcard) {
    flashcard.classList.toggle('flipped', state.isListeningCardFlipped);
  }

  if (state.isListeningCardFlipped) {
    if (ratingControls) {
      ratingControls.classList.add('visible');
    }
    // Auto-play passage audio on flip (only if not already playing)
    const card = state.listeningDeck[state.currentListeningIndex];
    if (card) {
      playPassageAudio(card.passage, true);
    }
  } else {
    if (ratingControls) {
      ratingControls.classList.remove('visible');
    }
  }
}

function nextListeningCard() {
  if (state.listeningDeck.length === 0) return;
  stopAllAudio();
  state.currentListeningIndex = (state.currentListeningIndex + 1) % state.listeningDeck.length;
  renderCurrentListeningCard();
}

function prevListeningCard() {
  if (state.listeningDeck.length === 0) return;
  stopAllAudio();
  state.currentListeningIndex = (state.currentListeningIndex - 1 + state.listeningDeck.length) % state.listeningDeck.length;
  renderCurrentListeningCard();
}

function handleListeningCardRating(rating) {
  if (state.listeningDeck.length === 0) return;
  const card = state.listeningDeck[state.currentListeningIndex];

  // Record stats
  if (rating === 'easy') {
    if (!state.stats.easyVocabIds.includes(card.id)) {
      state.stats.easyVocabIds.push(card.id);
    }
    // Correct synth sound
    playSynthSound('correct');
  } else {
    state.stats.easyVocabIds = state.stats.easyVocabIds.filter(id => id !== card.id);
  }
  
  state.stats.masteredCount = state.stats.easyVocabIds.length;
  saveStatsToStorage();

  const activeRatingBtn = document.getElementById(`btn-listening-rate-${rating}`);
  if (activeRatingBtn) {
    activeRatingBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      activeRatingBtn.style.transform = '';
      nextListeningCard();
    }, 150);
  } else {
    nextListeningCard();
  }
}

function handleCardRating(rating) {
  if (state.studyDeck.length === 0) return;
  const card = state.studyDeck[state.currentCardIndex];

  // Update Stats based on ratings
  if (rating === 'easy') {
    if (!state.stats.easyVocabIds.includes(card.id)) {
      state.stats.easyVocabIds.push(card.id);
    }
  } else {
    // If rated medium/hard, remove from mastered
    state.stats.easyVocabIds = state.stats.easyVocabIds.filter(id => id !== card.id);
  }
  
  saveStatsToStorage();

  // Move to next card
  nextCard();
}

function nextCard() {
  if (state.studyDeck.length === 0) return;
  
  if (state.currentCardIndex < state.studyDeck.length - 1) {
    state.currentCardIndex++;
    renderCurrentCard();
  } else {
    if (state.isPartnerMode) {
      showPartnerQuizSummary();
    } else {
      alert("Congratulations! You have finished reviewing this deck.");
      buildStudyDeck(); // Shuffle and rebuild
    }
  }
}

function gradePartnerAnswer(isCorrect) {
  if (state.studyDeck.length === 0) return;
  
  if (isCorrect) {
    state.partnerScore++;
  }
  state.partnerTotal++;
  
  const badge = document.getElementById('partner-score-badge');
  if (badge) badge.innerText = `Score: ${state.partnerScore} / ${state.partnerTotal}`;
  
  // Advance to next card or complete quiz
  if (state.currentCardIndex < state.studyDeck.length - 1) {
    state.currentCardIndex++;
    renderCurrentCard();
  } else {
    showPartnerQuizSummary();
  }
}

function showPartnerQuizSummary() {
  const summaryCard = document.getElementById('partner-quiz-summary');
  const cardWrapper = document.getElementById('study-card-wrapper');
  const partnerControls = document.getElementById('partner-quiz-controls');
  const resultText = document.getElementById('partner-quiz-result-text');
  const percentageEl = document.getElementById('partner-quiz-percentage');
  
  if (cardWrapper) cardWrapper.style.display = 'none';
  if (partnerControls) {
    partnerControls.classList.remove('visible');
    partnerControls.style.display = 'none';
  }
  
  const percentage = state.partnerTotal > 0 ? Math.round((state.partnerScore / state.partnerTotal) * 100) : 0;
  
  if (resultText) {
    resultText.innerText = `Your partner scored ${state.partnerScore} out of ${state.partnerTotal} cards correctly!`;
  }
  if (percentageEl) {
    percentageEl.innerText = `${percentage}%`;
  }
  
  if (summaryCard) {
    summaryCard.style.display = 'flex';
  }
}

function prevCard() {
  if (state.studyDeck.length === 0) return;
  
  if (state.currentCardIndex > 0) {
    state.currentCardIndex--;
    renderCurrentCard();
  }
}

// Conjugation Drill Arena
function loadNextDrillVerb() {
  const unitFilter = document.getElementById('drill-unit-filter').value;
  let matchingVerbs = state.verbs;
  
  if (unitFilter !== 'all') {
    matchingVerbs = state.verbs.filter(v => v.unit.toString() === unitFilter);
  }
  
  if (matchingVerbs.length === 0) {
    document.getElementById('drill-verb-name').innerText = "No Verbs";
    document.getElementById('drill-verb-translation').innerText = "Try changing the unit filter";
    document.getElementById('drill-conjugation-fields').innerHTML = "<p>Add verbs in the creator or change unit filters.</p>";
    return;
  }
  
  // Select random verb
  const randVerb = matchingVerbs[Math.floor(Math.random() * matchingVerbs.length)];
  state.drillVerb = randVerb;
  
  // Render details
  document.getElementById('drill-verb-name').innerText = randVerb.verb;
  document.getElementById('drill-verb-translation').innerText = randVerb.meaning;
  document.getElementById('drill-tag-tense').innerText = randVerb.tense || 'Present';
  document.getElementById('drill-tag-type').innerText = randVerb.type || 'Regular';
  document.getElementById('drill-tag-unit').innerText = `Unit ${randVerb.unit}`;
  
  // Re-generate inputs
  const container = document.getElementById('drill-conjugation-fields');
  container.innerHTML = '';
  
  const pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  pronouns.forEach(pron => {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    // Label translations for pronouns
    let pronLabel = pron;
    if (pron === 'él') pronLabel = 'él / ella / usted';
    if (pron === 'ellos') pronLabel = 'ellos / ellas / ustedes';
    
    div.innerHTML = `
      <label for="drill-input-${pron}">${pronLabel}</label>
      <input type="text" id="drill-input-${pron}" class="input-conjugation" placeholder="Type conjugation..." autocomplete="off">
    `;
    container.appendChild(div);
  });
  
  // Reset buttons
  document.getElementById('btn-check-drill').style.display = 'inline-flex';
  document.getElementById('btn-next-drill').style.display = 'none';
  document.getElementById('drill-feedback-msg').className = 'drill-feedback';
  document.getElementById('drill-feedback-msg').innerText = '';
}

function checkDrillAnswers() {
  if (!state.drillVerb) return;
  
  const pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  let allCorrect = true;
  
  // Record drill usage in stats
  if (!state.stats.drillHistory[state.drillVerb.id]) {
    state.stats.drillHistory[state.drillVerb.id] = { correct: 0, total: 0 };
  }
  
  pronouns.forEach(pron => {
    const inputEl = document.getElementById(`drill-input-${pron}`);
    const userAnswer = inputEl.value.trim().toLowerCase();
    const correctAnswer = (state.drillVerb.conjugations[pron] || '').toLowerCase();
    
    const isExact = userAnswer === correctAnswer;
    const isIgnoredVosotros = (pron === 'vosotros' && userAnswer === '');
    
    if (isExact) {
      inputEl.classList.remove('incorrect');
      inputEl.classList.add('correct');
      inputEl.value = correctAnswer; // ensure correct casing/accents
    } else if (isIgnoredVosotros) {
      inputEl.classList.remove('incorrect');
      inputEl.classList.remove('correct');
      inputEl.value = ''; // keep it blank
    } else {
      allCorrect = false;
      inputEl.classList.remove('correct');
      inputEl.classList.add('incorrect');
      
      // Append correct answer suggestion inside field or placeholder
      inputEl.value = userAnswer ? `${userAnswer} ➔ (${correctAnswer})` : `➔ (${correctAnswer})`;
    }
  });

  // Update Stats
  state.stats.drillHistory[state.drillVerb.id].total += 1;
  if (allCorrect) {
    state.stats.drillHistory[state.drillVerb.id].correct += 1;
    document.getElementById('drill-feedback-msg').innerText = "Excellent! All correct.";
    document.getElementById('drill-feedback-msg').className = "drill-feedback success";
    speakText(state.drillVerb.verb); // pronounce infinitive
  } else {
    document.getElementById('drill-feedback-msg').innerText = "Check highlighted errors.";
    document.getElementById('drill-feedback-msg').className = "drill-feedback error";
  }
  
  saveStatsToStorage();
  
  document.getElementById('btn-check-drill').style.display = 'none';
  document.getElementById('btn-next-drill').style.display = 'inline-flex';
}

// Reference Library
function renderLibraryTable() {
  const searchVal = document.getElementById('lib-search').value.toLowerCase();
  const unitVal = document.getElementById('lib-unit-filter').value;
  const typeVal = document.getElementById('lib-type-filter').value;
  const tbody = document.getElementById('library-tbody');
  
  tbody.innerHTML = '';
  
  let mergedList = [];
  
  // Map Vocab
  state.vocabulary.forEach(v => {
    mergedList.push({
      id: v.id,
      unit: v.unit,
      type: 'Vocabulary',
      typeCode: 'vocab',
      primaryText: v.word,
      secondaryText: v.translation,
      category: v.category || 'Vocab',
      example: v.example || '',
      isCustom: v.id.startsWith('custom_')
    });
  });
  
  // Map Verbs
  state.verbs.forEach(v => {
    const yoConjug = v.conjugations.yo || '';
    const pronounsText = `yo: ${yoConjug} / él: ${v.conjugations.él || ''} / ellos: ${v.conjugations.ellos || ''}`;
    mergedList.push({
      id: v.id,
      unit: v.unit,
      type: 'Verb',
      typeCode: 'verb',
      primaryText: `${v.verb} (${v.tense || 'Present'})`,
      secondaryText: `${v.meaning}`,
      category: v.type || 'Regular',
      example: pronounsText,
      isCustom: v.id.startsWith('custom_')
    });
  });

  // Map Prompts
  state.prompts.forEach(p => {
    mergedList.push({
      id: p.id,
      unit: p.unit,
      type: 'Conversation',
      typeCode: 'prompt',
      primaryText: p.prompt,
      secondaryText: p.context || '',
      category: 'Oral Practice',
      example: 'Oral Drill',
      isCustom: p.id.startsWith('custom_')
    });
  });

  // Map Listening
  state.listening.forEach(l => {
    mergedList.push({
      id: l.id,
      unit: l.unit,
      type: 'Listening',
      typeCode: 'listening',
      primaryText: l.question,
      secondaryText: l.passage,
      category: l.context || 'Listening',
      example: l.answer || '',
      isCustom: l.id.startsWith('custom_')
    });
  });

  // Filter List
  const filtered = mergedList.filter(item => {
    const matchesSearch = item.primaryText.toLowerCase().includes(searchVal) || 
                          item.secondaryText.toLowerCase().includes(searchVal) ||
                          item.category.toLowerCase().includes(searchVal);
    const matchesUnit = unitVal === 'all' || item.unit.toString() === unitVal;
    const matchesType = typeVal === 'all' || item.typeCode === typeVal;
    
    return matchesSearch && matchesUnit && matchesType;
  });

  // Render Rows
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--clr-text-light);">No cards found in the library.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    
    // Set speak text depending on type (passage for listening cards)
    const speakTextData = item.typeCode === 'listening' ? item.secondaryText : item.primaryText.split('(')[0];
    const safeSpeakText = speakTextData.replace(/"/g, '&quot;').trim();
    
    tr.innerHTML = `
      <td><strong>${item.primaryText}</strong></td>
      <td>${item.secondaryText}</td>
      <td>Unit ${item.unit}</td>
      <td><span class="library-badge ${item.typeCode}">${item.type}</span></td>
      <td><span class="example-text">${item.example}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-icon-sm speak-row-btn" data-text="${safeSpeakText}" title="Escuchar pronunciación">
            <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          </button>
          ${item.isCustom ? `
            <button class="btn-icon-sm delete-btn" data-id="${item.id}" data-type="${item.typeCode}" title="Delete Card">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach dynamic speech events
  tbody.querySelectorAll('.speak-row-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      speakText(btn.dataset.text);
    });
  });

  // Attach delete events
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomItem(btn.dataset.id, btn.dataset.type);
    });
  });
}

function deleteCustomItem(id, type) {
  if (!confirm("Are you sure you want to delete this custom card?")) return;
  
  if (type === 'vocab') {
    state.vocabulary = state.vocabulary.filter(v => v.id !== id);
  } else if (type === 'verb') {
    state.verbs = state.verbs.filter(v => v.id !== id);
  } else if (type === 'prompt') {
    state.prompts = state.prompts.filter(p => p.id !== id);
  } else if (type === 'listening') {
    state.listening = state.listening.filter(l => l.id !== id);
  }
  
  saveAllDataToStorage();
  renderLibraryTable();
}

// Card Creator Panel Logic
function toggleCreatorFormType(type) {
  document.querySelectorAll('.creator-tab').forEach(tab => {
    if (tab.dataset.type === type) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  if (type === 'vocab') {
    document.getElementById('creator-vocab-fields').style.display = 'flex';
    document.getElementById('creator-verb-fields').style.display = 'none';
    document.getElementById('creator-listening-fields').style.display = 'none';
  } else if (type === 'verb') {
    document.getElementById('creator-vocab-fields').style.display = 'none';
    document.getElementById('creator-verb-fields').style.display = 'grid';
    document.getElementById('creator-listening-fields').style.display = 'none';
  } else {
    document.getElementById('creator-vocab-fields').style.display = 'none';
    document.getElementById('creator-verb-fields').style.display = 'none';
    document.getElementById('creator-listening-fields').style.display = 'flex';
  }
  updateCreatorPreview();
}

function updateCreatorPreview() {
  const activeTab = document.querySelector('.creator-tab.active').dataset.type;
  const container = document.getElementById('preview-card-slot');
  
  if (activeTab === 'vocab') {
    const word = document.getElementById('c-word').value.trim() || 'e.g. Sentirse ridículo';
    const translation = document.getElementById('c-translation').value.trim() || 'e.g. To feel ridiculous';
    const category = document.getElementById('c-category').value.trim() || 'Vocab';
    const example = document.getElementById('c-example').value.trim() || 'e.g. Me siento ridículo al hablar.';
    const unit = document.getElementById('c-unit').value;
    
    container.innerHTML = `
      <div class="flashcard-container" style="cursor: default;">
        <div class="card-face card-front" style="position: relative; box-shadow: var(--shadow-sm);">
          <div class="card-top">
            <span class="card-tag">Vocabulary - U${unit}</span>
            <span style="font-size: 0.8rem; color: var(--clr-text-light); font-weight:500;">Preview</span>
          </div>
          <div class="card-body">
            <div class="card-word" style="font-size: 1.8rem;">${word}</div>
            <div class="card-hint">${category}</div>
            ${example ? `<div class="card-example" style="font-size: 0.9rem; padding: 8px 12px; margin-top: 8px;">${example}</div>` : ''}
          </div>
          <div class="card-footer-info">
            <span>Translation on back: <em>${translation}</em></span>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'verb') {
    const verbName = document.getElementById('cv-name').value.trim() || 'e.g. Hablar';
    const meaning = document.getElementById('cv-meaning').value.trim() || 'e.g. To speak';
    const tense = document.getElementById('cv-tense').value.trim() || 'Present';
    const type = document.getElementById('cv-type').value.trim() || 'Regular';
    const unit = document.getElementById('cv-unit').value;
    
    container.innerHTML = `
      <div class="flashcard-container" style="cursor: default;">
        <div class="card-face card-front" style="position: relative; box-shadow: var(--shadow-sm); background: linear-gradient(135deg, #ffffff, #fdfbf7);">
          <div class="card-top">
            <span class="card-tag">Verb - U${unit}</span>
            <span style="font-size: 0.8rem; color: var(--clr-text-light); font-weight:500;">Preview</span>
          </div>
          <div class="card-body" style="gap: 6px;">
            <div class="card-word" style="font-size: 1.8rem; color: var(--clr-primary);">${verbName}</div>
            <div class="card-hint">${tense} (${type})</div>
            <div style="font-size:0.85rem; text-align: left; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px; width: 100%; border-left: 3px solid var(--clr-primary);">
              <strong>Meaning:</strong> ${meaning}<br>
              <strong>yo:</strong> ${document.getElementById('cv-yo').value.trim() || '...'} | 
              <strong>nosotros:</strong> ${document.getElementById('cv-nosotros').value.trim() || '...'}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'listening') {
    const question = document.getElementById('cl-question').value.trim() || 'e.g. ¿Qué le pide la persona al señor?';
    const qTranslation = document.getElementById('cl-question-translation').value.trim() || 'e.g. What does the person ask the man to do?';
    const context = document.getElementById('cl-context').value.trim() || 'Courtesy Requests';
    const unit = document.getElementById('cl-unit').value;
    
    container.innerHTML = `
      <div class="flashcard-container" style="cursor: default;">
        <div class="card-face card-front" style="position: relative; box-shadow: var(--shadow-sm); background: linear-gradient(135deg, #ffffff, #f0f7fd);">
          <div class="card-top">
            <span class="card-tag" style="background: rgba(52, 152, 219, 0.1); color: #3498db;">Listening - U${unit}</span>
            <span style="font-size: 0.8rem; color: var(--clr-text-light); font-weight:500;">Preview (Front)</span>
          </div>
          <div class="card-body" style="gap: 12px;">
            <div style="font-size: 2.2rem;">🎧</div>
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #3498db;">Audio Passage (Text is Hidden on Front)</div>
            <div style="font-size: 0.85rem; color: var(--clr-text-light); font-style: italic; margin-top: -6px;">Audio plays via TTS</div>
            <div style="border-top: 1px solid var(--clr-border); width: 100%; margin: 8px 0;"></div>
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--clr-text-light);">Question:</div>
            <div style="font-size: 1.1rem; font-weight: 600; color: var(--clr-text-dark);">${question}</div>
            ${qTranslation ? `<div style="font-size: 0.85rem; font-style: italic; color: var(--clr-text-light); margin-top: -4px;">${qTranslation}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

function saveCreatedCard() {
  const activeTab = document.querySelector('.creator-tab.active').dataset.type;
  
  if (activeTab === 'vocab') {
    const word = document.getElementById('c-word').value.trim();
    const translation = document.getElementById('c-translation').value.trim();
    const category = document.getElementById('c-category').value.trim() || 'Vocab';
    const example = document.getElementById('c-example').value.trim();
    const unit = parseInt(document.getElementById('c-unit').value);
    
    if (!word || !translation) {
      alert("Please fill in the required fields (Spanish Phrase and English Translation).");
      return;
    }
    
    const newVocab = {
      id: `custom_v_${Date.now()}`,
      unit: unit,
      word: word,
      translation: translation,
      type: 'phrase',
      example: example,
      category: category
    };
    
    state.vocabulary.push(newVocab);
    
    // Reset Form
    document.getElementById('c-word').value = '';
    document.getElementById('c-translation').value = '';
    document.getElementById('c-category').value = '';
    document.getElementById('c-example').value = '';
    
  } else if (activeTab === 'verb') {
    const verbName = document.getElementById('cv-name').value.trim();
    const meaning = document.getElementById('cv-meaning').value.trim();
    const tense = document.getElementById('cv-tense').value.trim() || 'Present';
    const type = document.getElementById('cv-type').value.trim() || 'Regular';
    const unit = parseInt(document.getElementById('cv-unit').value);
    
    const yo = document.getElementById('cv-yo').value.trim();
    const tú = document.getElementById('cv-tu').value.trim();
    const él = document.getElementById('cv-el').value.trim();
    const nosotros = document.getElementById('cv-nosotros').value.trim();
    const vosotros = document.getElementById('cv-vosotros').value.trim();
    const ellos = document.getElementById('cv-ellos').value.trim();
    
    if (!verbName || !meaning || !yo || !tú || !él || !nosotros || !ellos) {
      alert("Please fill in the verb name, meaning, and conjugations (excluding optional vosotros).");
      return;
    }
    
    const newVerb = {
      id: `custom_verb_${Date.now()}`,
      verb: verbName,
      meaning: meaning,
      unit: unit,
      tense: tense,
      type: type,
      conjugations: { yo, tú, él, nosotros, vosotros, ellos }
    };
    
    state.verbs.push(newVerb);
    
    // Reset fields
    document.getElementById('cv-name').value = '';
    document.getElementById('cv-meaning').value = '';
    document.getElementById('cv-yo').value = '';
    document.getElementById('cv-tu').value = '';
    document.getElementById('cv-el').value = '';
    document.getElementById('cv-nosotros').value = '';
    document.getElementById('cv-vosotros').value = '';
    document.getElementById('cv-ellos').value = '';
  } else if (activeTab === 'listening') {
    const passage = document.getElementById('cl-passage').value.trim();
    const passageTranslation = document.getElementById('cl-passage-translation').value.trim();
    const question = document.getElementById('cl-question').value.trim();
    const questionTranslation = document.getElementById('cl-question-translation').value.trim();
    const answer = document.getElementById('cl-answer').value.trim();
    const answerTranslation = document.getElementById('cl-answer-translation').value.trim();
    const context = document.getElementById('cl-context').value.trim() || 'Custom Listening';
    const unit = parseInt(document.getElementById('cl-unit').value);

    if (!passage || !passageTranslation || !question || !answer || !answerTranslation) {
      alert("Please fill in the required fields (Passage, Passage Translation, Question, Answer, and Answer Translation).");
      return;
    }

    const newListening = {
      id: `custom_l_${Date.now()}`,
      unit: unit,
      passage: passage,
      passageTranslation: passageTranslation,
      question: question,
      questionTranslation: questionTranslation,
      answer: answer,
      answerTranslation: answerTranslation,
      context: context
    };

    state.listening.push(newListening);

    // Reset fields
    document.getElementById('cl-passage').value = '';
    document.getElementById('cl-passage-translation').value = '';
    document.getElementById('cl-question').value = '';
    document.getElementById('cl-question-translation').value = '';
    document.getElementById('cl-answer').value = '';
    document.getElementById('cl-answer-translation').value = '';
    document.getElementById('cl-context').value = '';
  }
  
  saveAllDataToStorage();
  updateCreatorPreview();
  // Invalidate decks so they rebuild
  state.studyDeck = [];
  state.listeningDeck = [];
  alert("Card saved successfully to your library!");
}

// Backup Manager
function exportUserData() {
  const backup = {
    vocabulary: state.vocabulary,
    verbs: state.verbs,
    prompts: state.prompts,
    listening: state.listening,
    stats: state.stats,
    version: '1.0',
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `spanish_assistant_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importUserData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // Simple structural validation
      if (data.vocabulary && data.verbs && data.stats) {
        state.vocabulary = data.vocabulary.map(loadedV => {
          const initialV = INITIAL_VOCABULARY.find(v => v.id === loadedV.id || (v.word && loadedV.word && v.word.toLowerCase().replace(/[\s]/g, '') === loadedV.word.toLowerCase().replace(/[\s]/g, '')));
          if (initialV) {
            return {
              ...loadedV,
              id: initialV.id,
              word: initialV.word,
              translation: initialV.translation,
              example: initialV.example,
              exampleTranslation: initialV.exampleTranslation,
              category: initialV.category || loadedV.category
            };
          }
          return loadedV;
        });
        // Add any missing vocabulary items
        INITIAL_VOCABULARY.forEach(initialV => {
          if (!state.vocabulary.some(v => v.id === initialV.id)) {
            state.vocabulary.push({ ...initialV });
          }
        });
        state.verbs = data.verbs;
        const rawPrompts = data.prompts || [...INITIAL_PROMPTS];
        state.prompts = rawPrompts.map(loadedP => {
          const initialP = INITIAL_PROMPTS.find(p => p.id === loadedP.id || (p.prompt && loadedP.prompt && p.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '') === loadedP.prompt.toLowerCase().replace(/[¿?¡!.,;:()'"\s]/g, '')));
          if (initialP) {
            return {
              ...loadedP,
              id: initialP.id,
              prompt: initialP.prompt,
              translation: initialP.translation,
              sampleAnswer: initialP.sampleAnswer,
              sampleAnswerTranslation: initialP.sampleAnswerTranslation,
              context: initialP.context || loadedP.context
            };
          }
          return loadedP;
        });
        // Add any missing prompts from INITIAL_PROMPTS
        INITIAL_PROMPTS.forEach(initialP => {
          if (!state.prompts.some(p => p.id === initialP.id)) {
            state.prompts.push({ ...initialP });
          }
        });

        // Import Listening Comprehension cards
        const rawListening = data.listening || [...INITIAL_LISTENING];
        state.listening = rawListening.map(loadedL => {
          const initialL = INITIAL_LISTENING.find(l => l.id === loadedL.id || (l.passage && loadedL.passage && l.passage.toLowerCase().replace(/[^a-z0-9]/g, '') === loadedL.passage.toLowerCase().replace(/[^a-z0-9]/g, '')));
          if (initialL) {
            return {
              ...loadedL,
              id: initialL.id,
              passage: initialL.passage,
              passageTranslation: initialL.passageTranslation,
              question: initialL.question,
              questionTranslation: initialL.questionTranslation,
              answer: initialL.answer,
              answerTranslation: initialL.answerTranslation,
              context: initialL.context || loadedL.context
            };
          }
          return loadedL;
        });
        // Add any missing listening items from INITIAL_LISTENING
        INITIAL_LISTENING.forEach(initialL => {
          if (!state.listening.some(l => l.id === initialL.id)) {
            state.listening.push({ ...initialL });
          }
        });

        state.stats = data.stats;
        
        saveAllDataToStorage();
        saveStatsToStorage();
        
        // Reset study decks
        state.studyDeck = [];
        state.listeningDeck = [];
        state.drillVerb = null;
        
        alert("Data imported successfully!");
        updateDashboard();
        switchView('dashboard');
      } else {
        alert("Invalid backup file. Key data elements are missing.");
      }
    } catch(err) {
      alert("Error reading the JSON file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
      
      // Close mobile sidebar on click
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('mobile-sidebar-backdrop');
      if (sidebar && backdrop) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Study Area Filters
  document.getElementById('study-unit-filter').addEventListener('change', buildStudyDeck);
  document.getElementById('study-type-filter').addEventListener('change', buildStudyDeck);
  document.getElementById('study-mode-filter').addEventListener('change', buildStudyDeck);
  
  // Voice & Speed Controls
  const studyVoiceSelect = document.getElementById('study-voice-select');
  const listeningVoiceSelect = document.getElementById('listening-voice-select');
  
  if (studyVoiceSelect) {
    studyVoiceSelect.addEventListener('change', (e) => {
      state.voiceName = e.target.value;
      localStorage.setItem('es_helper_voice_name', state.voiceName);
      if (listeningVoiceSelect) listeningVoiceSelect.value = state.voiceName;
      speakText("Perfecto");
    });
  }
  if (listeningVoiceSelect) {
    listeningVoiceSelect.addEventListener('change', (e) => {
      state.voiceName = e.target.value;
      localStorage.setItem('es_helper_voice_name', state.voiceName);
      if (studyVoiceSelect) studyVoiceSelect.value = state.voiceName;
      speakText("Perfecto");
    });
  }
  
  const studySpeedRange = document.getElementById('study-speed-range');
  const studySpeedVal = document.getElementById('study-speed-val');
  const listeningSpeedRange = document.getElementById('listening-speed-range');
  const listeningSpeedVal = document.getElementById('listening-speed-val');
  
  if (studySpeedRange && studySpeedVal) {
    studySpeedRange.value = state.voiceRate;
    studySpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
    
    studySpeedRange.addEventListener('input', (e) => {
      state.voiceRate = parseFloat(e.target.value);
      studySpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
      localStorage.setItem('es_helper_voice_rate', state.voiceRate);
      
      if (listeningSpeedRange && listeningSpeedVal) {
        listeningSpeedRange.value = state.voiceRate;
        listeningSpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
      }
      if (currentAudio) {
        currentAudio.playbackRate = state.voiceRate;
      }
    });
  }
  
  if (listeningSpeedRange && listeningSpeedVal) {
    listeningSpeedRange.value = state.voiceRate;
    listeningSpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
    
    listeningSpeedRange.addEventListener('input', (e) => {
      state.voiceRate = parseFloat(e.target.value);
      listeningSpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
      localStorage.setItem('es_helper_voice_rate', state.voiceRate);
      
      if (studySpeedRange && studySpeedVal) {
        studySpeedRange.value = state.voiceRate;
        studySpeedVal.innerText = `${state.voiceRate.toFixed(2)}x`;
      }
      if (currentAudio) {
        currentAudio.playbackRate = state.voiceRate;
      }
    });
  }
  
  // Study Area Controls
  document.getElementById('study-flashcard').addEventListener('click', flipCard);
  document.getElementById('btn-prev-card').addEventListener('click', (e) => {
    e.stopPropagation();
    prevCard();
  });
  document.getElementById('btn-next-card').addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
  });
  
  document.getElementById('btn-speak-front').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.studyDeck[state.currentCardIndex];
    if (card) {
      speakText(card.front);
    }
  });
  
  document.getElementById('btn-speak-back').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.studyDeck[state.currentCardIndex];
    if (card) {
      speakText(card.back, 'en');
    }
  });
  
  // Card Ratings
  document.getElementById('btn-rate-easy').addEventListener('click', (e) => {
    e.stopPropagation();
    handleCardRating('easy');
  });
  document.getElementById('btn-rate-medium').addEventListener('click', (e) => {
    e.stopPropagation();
    handleCardRating('medium');
  });
  document.getElementById('btn-rate-hard').addEventListener('click', (e) => {
    e.stopPropagation();
    handleCardRating('hard');
  });

  // Listening Practice Controls & Ratings
  document.getElementById('listening-unit-filter').addEventListener('change', buildListeningDeck);
  document.getElementById('listening-flashcard').addEventListener('click', flipListeningCard);
  
  document.getElementById('btn-prev-listening').addEventListener('click', (e) => {
    e.stopPropagation();
    prevListeningCard();
  });
  document.getElementById('btn-next-listening').addEventListener('click', (e) => {
    e.stopPropagation();
    nextListeningCard();
  });
  
  document.getElementById('btn-listening-play-pause-front').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.listeningDeck[state.currentListeningIndex];
    if (card) {
      playPassageAudio(card.passage);
    }
  });
  document.getElementById('btn-listening-play-pause-back').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.listeningDeck[state.currentListeningIndex];
    if (card) {
      playPassageAudio(card.passage);
    }
  });
  
  document.getElementById('btn-listening-restart-front').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.listeningDeck[state.currentListeningIndex];
    if (card) {
      restartPassageAudio(card.passage);
    }
  });
  document.getElementById('btn-listening-restart-back').addEventListener('click', (e) => {
    e.stopPropagation();
    const card = state.listeningDeck[state.currentListeningIndex];
    if (card) {
      restartPassageAudio(card.passage);
    }
  });

  const sliderFront = document.getElementById('slider-listening-front');
  if (sliderFront) {
    sliderFront.addEventListener('click', (e) => e.stopPropagation());
    sliderFront.addEventListener('input', (e) => {
      seekPassageAudio(parseFloat(e.target.value));
    });
  }

  const sliderBack = document.getElementById('slider-listening-back');
  if (sliderBack) {
    sliderBack.addEventListener('click', (e) => e.stopPropagation());
    sliderBack.addEventListener('input', (e) => {
      seekPassageAudio(parseFloat(e.target.value));
    });
  }

  // Prevent card flipping when clicking inside the audio player controls
  document.querySelectorAll('.audio-player-container').forEach(container => {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  
  document.getElementById('btn-listening-rate-easy').addEventListener('click', (e) => {
    e.stopPropagation();
    handleListeningCardRating('easy');
  });
  document.getElementById('btn-listening-rate-medium').addEventListener('click', (e) => {
    e.stopPropagation();
    handleListeningCardRating('medium');
  });
  document.getElementById('btn-listening-rate-hard').addEventListener('click', (e) => {
    e.stopPropagation();
    handleListeningCardRating('hard');
  });

  // Partner Quiz Grading & Actions
  document.getElementById('btn-quiz-incorrect').addEventListener('click', (e) => {
    e.stopPropagation();
    gradePartnerAnswer(false);
  });
  document.getElementById('btn-quiz-correct').addEventListener('click', (e) => {
    e.stopPropagation();
    gradePartnerAnswer(true);
  });
  document.getElementById('btn-quiz-swap').addEventListener('click', (e) => {
    buildStudyDeck();
  });
  document.getElementById('btn-quiz-restart').addEventListener('click', (e) => {
    buildStudyDeck();
  });

  // Conjugation Drill Filters & Actions
  document.getElementById('drill-unit-filter').addEventListener('change', loadNextDrillVerb);
  document.getElementById('btn-check-drill').addEventListener('click', checkDrillAnswers);
  document.getElementById('btn-next-drill').addEventListener('click', loadNextDrillVerb);
  
  // Reference Library Search/Filters
  document.getElementById('lib-search').addEventListener('input', renderLibraryTable);
  document.getElementById('lib-unit-filter').addEventListener('change', renderLibraryTable);
  document.getElementById('lib-type-filter').addEventListener('change', renderLibraryTable);

  // Card Creator Actions & Inputs
  document.querySelectorAll('.creator-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      toggleCreatorFormType(tab.dataset.type);
    });
  });
  
  // Sync previews
  const creatorInputs = ['c-word', 'c-translation', 'c-category', 'c-example', 'c-unit', 
                         'cv-name', 'cv-meaning', 'cv-tense', 'cv-type', 'cv-unit',
                         'cv-yo', 'cv-tu', 'cv-el', 'cv-nosotros', 'cv-vosotros', 'cv-ellos',
                         'cl-passage', 'cl-passage-translation', 'cl-question', 'cl-question-translation', 'cl-answer', 'cl-answer-translation', 'cl-context', 'cl-unit'];
  
  creatorInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCreatorPreview);
  });
  
  document.getElementById('btn-save-card').addEventListener('click', saveCreatedCard);

  // Backup actions
  document.getElementById('btn-export-data').addEventListener('click', exportUserData);
  document.getElementById('btn-import-file').addEventListener('change', importUserData);

  // Match Madness Actions
  document.getElementById('btn-start-frenzy').addEventListener('click', startFrenzyGame);
  document.getElementById('btn-quit-frenzy').addEventListener('click', () => endFrenzyGame(true));
  document.getElementById('btn-frenzy-go-home').addEventListener('click', () => switchView('frenzy'));
  document.getElementById('btn-frenzy-restart').addEventListener('click', startFrenzyGame);

  // Grammar Compare Actions
  document.getElementById('btn-start-compare').addEventListener('click', startCompareDrill);
  document.getElementById('btn-next-compare').addEventListener('click', nextCompareQuestion);
  document.getElementById('btn-restart-compare').addEventListener('click', startCompareDrill);
  document.getElementById('btn-speak-compare').addEventListener('click', () => {
    if (state.compareDeck.length > 0) {
      const currentQ = state.compareDeck[state.currentCompareIndex];
      const completeSentence = currentQ.sentenceEs.replace('[blank]', currentQ.answer);
      speakText(completeSentence);
    }
  });

  // Compare Tabs & Builder Mode Binds
  document.getElementById('tab-compare-challenge').addEventListener('click', () => toggleCompareMode('challenge'));
  document.getElementById('tab-compare-builder').addEventListener('click', () => toggleCompareMode('builder'));
  document.getElementById('compare-builder-select').addEventListener('change', (e) => {
    state.builderPromptIndex = parseInt(e.target.value, 10);
    renderBuilderPrompt();
  });
  document.getElementById('btn-check-builder').addEventListener('click', checkCustomSentence);
  document.getElementById('btn-reset-builder').addEventListener('click', resetCustomSentence);
  document.getElementById('btn-speak-builder-model').addEventListener('click', speakBuilderModel);

  // Reset Progress Action
  document.getElementById('btn-reset-progress').addEventListener('click', () => {
    const confirmReset = confirm(
      "Are you sure you want to reset all your study progress?\n\n" +
      "This will:\n" +
      "• Reset your Daily Study Streak to 0\n" +
      "• Clear all rating history (e.g., 'Mastered' card counts)\n" +
      "• Reset Match Madness high scores\n\n" +
      "Note: Your custom-added words and verbs will NOT be deleted."
    );
    
    if (confirmReset) {
      state.stats.streak = 0;
      state.stats.lastActiveDate = null;
      state.stats.easyVocabIds = [];
      state.stats.frenzyHighScore = 0;
      state.stats.drillHistory = {};
      
      saveStatsToStorage();
      alert("Study progress successfully reset!");
      updateDashboard();
    }
  });

  // Keybindings for studying
  document.addEventListener('keydown', (e) => {
    if (state.activeView === 'study') {
      if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      } else if (e.code === 'ArrowRight') {
        nextCard();
      } else if (e.code === 'ArrowLeft') {
        prevCard();
      } else if (state.isCardFlipped) {
        if (state.isPartnerMode) {
          if (e.key === '1') gradePartnerAnswer(false);
          if (e.key === '3') gradePartnerAnswer(true);
        } else {
          if (e.key === '1') handleCardRating('hard');
          if (e.key === '2') handleCardRating('medium');
          if (e.key === '3') handleCardRating('easy');
        }
      }
    } else if (state.activeView === 'listening') {
      if (e.code === 'Space') {
        e.preventDefault();
        flipListeningCard();
      } else if (e.code === 'ArrowRight') {
        nextListeningCard();
      } else if (e.code === 'ArrowLeft') {
        prevListeningCard();
      } else if (state.isListeningCardFlipped) {
        if (e.key === '1') handleListeningCardRating('hard');
        if (e.key === '2') handleListeningCardRating('medium');
        if (e.key === '3') handleListeningCardRating('easy');
      }
    }
  });
}

// Kickstart App
window.addEventListener('DOMContentLoaded', initApp);


// ==========================================
// MATCH MADNESS / FLASHCARD FRENZY GAMEPLAY
// ==========================================

// Web Audio API Synthesizer (satisfying offline audio chimes)
function playSynthSound(type) {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'incorrect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'win') {
      osc.type = 'sine';
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      });
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch(err) {
    console.error("Audio error", err);
  }
}

function startFrenzyGame() {
  const unitFilter = document.getElementById('frenzy-unit-filter').value;
  let pool = [];
  
  // Collect vocabulary based on filters
  state.vocabulary.forEach(v => {
    if (unitFilter === 'all' || v.unit.toString() === unitFilter) {
      pool.push({ id: v.id, word: v.word, translation: v.translation });
    }
  });

  if (pool.length < 5) {
    alert("You need at least 5 vocabulary words in this unit to play. Try selecting another unit or adding more cards!");
    return;
  }

  // Shuffle pool (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Initialize Game State
  state.frenzyGame = {
    timeLeft: 45,
    score: 0,
    pool: pool.slice(5),
    activePairs: pool.slice(0, 5),
    selectedSpanId: null,
    selectedEngId: null,
    timer: setInterval(tickFrenzyTimer, 1000)
  };

  // UI Setup
  document.getElementById('frenzy-setup').style.display = 'none';
  document.getElementById('frenzy-results').style.display = 'none';
  document.getElementById('frenzy-arena').style.display = 'flex';
  
  document.getElementById('frenzy-current-score').innerText = '0';
  document.getElementById('frenzy-time-left').innerText = '45s';
  document.getElementById('frenzy-timer-bar').style.width = '100%';

  renderFrenzyColumns();
}

function renderFrenzyColumns() {
  const spanishCol = document.getElementById('frenzy-spanish-col');
  const englishCol = document.getElementById('frenzy-english-col');
  
  spanishCol.innerHTML = '';
  englishCol.innerHTML = '';

  const activePairs = state.frenzyGame.activePairs;

  // Shuffle Spanish and English arrays separately to scramble positions
  const spanishList = [...activePairs];
  const englishList = [...activePairs];

  for (let i = spanishList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spanishList[i], spanishList[j]] = [spanishList[j], spanishList[i]];
  }
  for (let i = englishList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [englishList[i], englishList[j]] = [englishList[j], englishList[i]];
  }

  // Render Spanish column
  spanishList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'frenzy-card';
    div.dataset.id = item.id;
    div.dataset.lang = 'es';
    div.innerText = item.word;
    div.addEventListener('click', handleFrenzyCardClick);
    spanishCol.appendChild(div);
  });

  // Render English column
  englishList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'frenzy-card';
    div.dataset.id = item.id;
    div.dataset.lang = 'en';
    div.innerText = item.translation;
    div.addEventListener('click', handleFrenzyCardClick);
    englishCol.appendChild(div);
  });
}

function handleFrenzyCardClick(e) {
  const card = e.currentTarget;
  const id = card.dataset.id;
  const lang = card.dataset.lang;

  if (card.classList.contains('matched')) return;

  if (lang === 'es') {
    // Clear previous selected
    document.querySelectorAll('#frenzy-spanish-col .frenzy-card').forEach(el => el.classList.remove('selected'));
    card.classList.add('selected');
    state.frenzyGame.selectedSpanId = id;
  } else {
    // Clear previous selected
    document.querySelectorAll('#frenzy-english-col .frenzy-card').forEach(el => el.classList.remove('selected'));
    card.classList.add('selected');
    state.frenzyGame.selectedEngId = id;
  }

  checkFrenzyMatch();
}

function checkFrenzyMatch() {
  const spanId = state.frenzyGame.selectedSpanId;
  const engId = state.frenzyGame.selectedEngId;

  if (spanId && engId) {
    const spanishCard = document.querySelector(`#frenzy-spanish-col .frenzy-card[data-id="${spanId}"]`);
    const englishCard = document.querySelector(`#frenzy-english-col .frenzy-card[data-id="${engId}"]`);

    if (spanId === engId) {
      // Correct Match!
      playSynthSound('correct');
      state.frenzyGame.score++;
      document.getElementById('frenzy-current-score').innerText = state.frenzyGame.score;

      // Animate fade-out
      spanishCard.classList.remove('selected');
      englishCard.classList.remove('selected');
      spanishCard.classList.add('matched');
      englishCard.classList.add('matched');

      // Clear selection
      state.frenzyGame.selectedSpanId = null;
      state.frenzyGame.selectedEngId = null;

      // Remove matched pair from activePairs and feed new pair in
      setTimeout(() => {
        state.frenzyGame.activePairs = state.frenzyGame.activePairs.filter(item => item.id !== spanId);
        
        // Feed in a new pair from pool if available
        if (state.frenzyGame.pool.length > 0) {
          const nextPair = state.frenzyGame.pool.shift();
          state.frenzyGame.activePairs.push(nextPair);
        }

        // If activePairs is empty, rebuild pool and activePairs
        if (state.frenzyGame.activePairs.length === 0) {
          const unitFilter = document.getElementById('frenzy-unit-filter').value;
          let newPool = [];
          state.vocabulary.forEach(v => {
            if (unitFilter === 'all' || v.unit.toString() === unitFilter) {
              newPool.push({ id: v.id, word: v.word, translation: v.translation });
            }
          });
          // Shuffle
          for (let i = newPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newPool[i], newPool[j]] = [newPool[j], newPool[i]];
          }
          state.frenzyGame.activePairs = newPool.slice(0, 5);
          state.frenzyGame.pool = newPool.slice(5);
        }

        renderFrenzyColumns();
      }, 400);

    } else {
      // Incorrect Match
      playSynthSound('incorrect');
      
      spanishCard.classList.remove('selected');
      englishCard.classList.remove('selected');
      spanishCard.classList.add('incorrect');
      englishCard.classList.add('incorrect');

      // Clear selection
      state.frenzyGame.selectedSpanId = null;
      state.frenzyGame.selectedEngId = null;

      // Clear shake class after animation completes
      setTimeout(() => {
        spanishCard.classList.remove('incorrect');
        englishCard.classList.remove('incorrect');
      }, 400);
    }
  }
}

function tickFrenzyTimer() {
  state.frenzyGame.timeLeft--;
  document.getElementById('frenzy-time-left').innerText = `${state.frenzyGame.timeLeft}s`;
  
  // Shrink bar
  const percent = (state.frenzyGame.timeLeft / 45) * 100;
  document.getElementById('frenzy-timer-bar').style.width = `${percent}%`;

  if (state.frenzyGame.timeLeft <= 0) {
    endFrenzyGame(false);
  }
}

function endFrenzyGame(isQuit) {
  if (state.frenzyGame && state.frenzyGame.timer) {
    clearInterval(state.frenzyGame.timer);
  }

  if (isQuit) {
    switchView('frenzy');
    return;
  }

  const score = state.frenzyGame.score;
  const prevHighScore = state.stats.frenzyHighScore || 0;
  let isNewHigh = false;

  if (score > prevHighScore) {
    state.stats.frenzyHighScore = score;
    saveStatsToStorage();
    isNewHigh = true;
    playSynthSound('win');
  }

  // Display results
  document.getElementById('frenzy-arena').style.display = 'none';
  document.getElementById('frenzy-results').style.display = 'flex';
  
  document.getElementById('frenzy-results-summary').innerHTML = `
    You successfully matched <strong>${score} terms</strong> in 45 seconds!
  `;

  document.getElementById('frenzy-new-high-score').style.display = isNewHigh ? 'block' : 'none';
}

// ==========================================
// GRAMMAR COMPARE GAMEPLAY (p. 61 & 229)
// ==========================================

function resetCompareDrill() {
  stopAllAudio();
  
  // Reset tabs UI
  const tabChallenge = document.getElementById('tab-compare-challenge');
  const tabBuilder = document.getElementById('tab-compare-builder');
  if (tabChallenge) tabChallenge.classList.add('active');
  if (tabBuilder) tabBuilder.classList.remove('active');
  
  const challengeCont = document.getElementById('compare-challenge-container');
  const builderCont = document.getElementById('compare-builder-container');
  if (challengeCont) challengeCont.style.display = 'flex';
  if (builderCont) builderCont.style.display = 'none';
  
  document.getElementById('compare-drill-setup').style.display = 'flex';
  document.getElementById('compare-drill-arena').style.display = 'none';
  document.getElementById('compare-drill-summary').style.display = 'none';
  
  state.compareScore = 0;
  state.compareTotalCount = 0;
  state.currentCompareIndex = 0;
  state.compareMode = 'challenge';
  
  document.getElementById('compare-drill-score').innerText = `Score: 0 / 0`;
}

function startCompareDrill() {
  document.getElementById('compare-drill-setup').style.display = 'none';
  document.getElementById('compare-drill-summary').style.display = 'none';
  document.getElementById('compare-drill-arena').style.display = 'flex';
  
  state.compareScore = 0;
  state.compareTotalCount = 0;
  state.currentCompareIndex = 0;
  
  // Shuffle compare deck
  state.compareDeck.sort(() => Math.random() - 0.5);
  
  renderCompareCard();
}

function renderCompareCard() {
  if (state.compareDeck.length === 0) return;
  const currentQ = state.compareDeck[state.currentCompareIndex];
  
  document.getElementById('compare-drill-index').innerText = `Question ${state.currentCompareIndex + 1} of ${state.compareDeck.length}`;
  document.getElementById('compare-drill-score').innerText = `Score: ${state.compareScore} / ${state.compareTotalCount}`;
  
  // Setup Spanish sentence with a placeholder blank
  const sentenceWithPlaceholder = currentQ.sentenceEs.replace('[blank]', '_______');
  document.getElementById('compare-sentence-es').innerText = sentenceWithPlaceholder;
  document.getElementById('compare-sentence-en').innerText = currentQ.sentenceEn;
  
  // Hide feedback and next button
  document.getElementById('compare-feedback-box').style.display = 'none';
  document.getElementById('btn-next-compare').style.display = 'none';
  
  // Render option buttons
  const optionsContainer = document.getElementById('compare-options');
  optionsContainer.innerHTML = '';
  
  currentQ.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'compare-option-btn';
    btn.innerText = opt;
    btn.addEventListener('click', () => submitCompareAnswer(opt, btn));
    optionsContainer.appendChild(btn);
  });
}

function submitCompareAnswer(selectedOpt, clickedBtn) {
  const currentQ = state.compareDeck[state.currentCompareIndex];
  const isCorrect = (selectedOpt.toLowerCase() === currentQ.answer.toLowerCase());
  
  // Disable all option buttons
  const optionBtns = document.querySelectorAll('.compare-option-btn');
  optionBtns.forEach(btn => btn.disabled = true);
  
  state.compareTotalCount += 1;
  
  // Update scores and highlight buttons
  if (isCorrect) {
    state.compareScore += 1;
    clickedBtn.classList.add('correct');
    if (typeof playSynthSound === 'function') {
      playSynthSound('correct');
    }
    
    document.getElementById('compare-feedback-title').innerText = '¡Excelente! Correct.';
    document.getElementById('compare-feedback-title').style.color = 'var(--clr-success)';
    document.getElementById('compare-feedback-box').style.borderLeftColor = 'var(--clr-success)';
  } else {
    clickedBtn.classList.add('incorrect');
    
    // Highlight correct button
    optionBtns.forEach(btn => {
      if (btn.innerText.toLowerCase() === currentQ.answer.toLowerCase()) {
        btn.classList.add('correct');
      }
    });
    if (typeof playSynthSound === 'function') {
      playSynthSound('incorrect');
    }
    
    document.getElementById('compare-feedback-title').innerText = 'Keep practicing!';
    document.getElementById('compare-feedback-title').style.color = 'var(--clr-error)';
    document.getElementById('compare-feedback-box').style.borderLeftColor = 'var(--clr-error)';
  }
  
  // Display completed sentence in the main box
  const filledSentence = currentQ.sentenceEs.replace('[blank]', currentQ.answer);
  document.getElementById('compare-sentence-es').innerHTML = currentQ.sentenceEs.replace('[blank]', `<span style="color: var(--clr-primary); text-decoration: underline;">${currentQ.answer}</span>`);
  
  // Show detailed explanation & pronounce the sentence
  document.getElementById('compare-feedback-explanation').innerText = currentQ.explanation;
  document.getElementById('compare-feedback-box').style.display = 'block';
  
  // Automatically speak the correct Spanish sentence
  speakText(filledSentence);
  
  // Update score bar immediately
  document.getElementById('compare-drill-score').innerText = `Score: ${state.compareScore} / ${state.compareTotalCount}`;
  
  // Show Next button
  document.getElementById('btn-next-compare').style.display = 'block';
}

function nextCompareQuestion() {
  state.currentCompareIndex += 1;
  
  if (state.currentCompareIndex < state.compareDeck.length) {
    renderCompareCard();
  } else {
    // End of deck, show summary
    document.getElementById('compare-drill-arena').style.display = 'none';
    document.getElementById('compare-drill-summary').style.display = 'flex';
    
    const pct = Math.round((state.compareScore / state.compareTotalCount) * 100);
    document.getElementById('compare-summary-text').innerText = `You scored ${state.compareScore} out of ${state.compareTotalCount} correct!`;
    document.getElementById('compare-summary-percentage').innerText = `${pct}%`;
    
    if (pct >= 80 && typeof playSynthSound === 'function') {
      playSynthSound('win');
    }
  }
}

function toggleCompareMode(mode) {
  state.compareMode = mode;
  stopAllAudio();

  const tabChallenge = document.getElementById('tab-compare-challenge');
  const tabBuilder = document.getElementById('tab-compare-builder');
  const challengeCont = document.getElementById('compare-challenge-container');
  const builderCont = document.getElementById('compare-builder-container');

  if (mode === 'challenge') {
    if (tabChallenge) tabChallenge.classList.add('active');
    if (tabBuilder) tabBuilder.classList.remove('active');
    if (challengeCont) challengeCont.style.display = 'flex';
    if (builderCont) builderCont.style.display = 'none';
  } else {
    if (tabChallenge) tabChallenge.classList.remove('active');
    if (tabBuilder) tabBuilder.classList.add('active');
    if (challengeCont) challengeCont.style.display = 'none';
    if (builderCont) builderCont.style.display = 'flex';
    initCompareBuilder();
  }
}

function initCompareBuilder() {
  const select = document.getElementById('compare-builder-select');
  if (select && select.children.length === 0) {
    select.innerHTML = '';
    COMPARE_BUILDER_PROMPTS.forEach((p, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.innerText = p.title;
      select.appendChild(opt);
    });
  }
  
  if (select) select.value = state.builderPromptIndex;
  renderBuilderPrompt();
}

function renderBuilderPrompt() {
  const promptObj = COMPARE_BUILDER_PROMPTS[state.builderPromptIndex];
  if (!promptObj) return;
  
  const formulaEl = document.getElementById('compare-builder-formula');
  const promptEl = document.getElementById('compare-builder-prompt');
  
  if (formulaEl) formulaEl.innerText = `Formula: ${promptObj.formula}`;
  if (promptEl) promptEl.innerText = promptObj.prompt;
  
  resetCustomSentence();
}

function resetCustomSentence() {
  const inputEl = document.getElementById('compare-builder-input');
  if (inputEl) inputEl.value = '';
  
  const feedback = document.getElementById('compare-builder-feedback');
  if (feedback) {
    feedback.style.display = 'none';
    feedback.className = '';
    feedback.innerHTML = '';
  }
  
  const modelBox = document.getElementById('compare-builder-model-box');
  if (modelBox) modelBox.style.display = 'none';
}

function checkCustomSentence() {
  const inputEl = document.getElementById('compare-builder-input');
  if (!inputEl) return;
  
  const txt = inputEl.value.trim();
  const feedback = document.getElementById('compare-builder-feedback');
  const modelBox = document.getElementById('compare-builder-model-box');
  
  if (!txt) {
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'builder-feedback-tip';
      feedback.innerHTML = '<strong>💡 Tip:</strong> Please write a Spanish sentence in the text area first.';
    }
    if (modelBox) modelBox.style.display = 'none';
    return;
  }
  
  const promptObj = COMPARE_BUILDER_PROMPTS[state.builderPromptIndex];
  if (!promptObj) return;
  
  const normalized = txt.toLowerCase().replace(/\s+/g, ' ');
  
  // 1. Check required terms
  let allRequiredPresent = true;
  let missingTerms = [];
  promptObj.validator.required.forEach(term => {
    const regex = new RegExp('\\b' + term + '\\b');
    if (!regex.test(normalized)) {
      allRequiredPresent = false;
      missingTerms.push(`"${term}"`);
    }
  });
  
  // 2. Check anyOf terms (if any)
  let hasAnyOf = true;
  let missingAnyOf = '';
  if (promptObj.validator.anyOf) {
    const matchedAny = promptObj.validator.anyOf.some(term => {
      const regex = new RegExp('\\b' + term + '\\b');
      return regex.test(normalized);
    });
    if (!matchedAny) {
      hasAnyOf = false;
      missingAnyOf = promptObj.validator.anyOf.map(t => `"${t}"`).join(' or ');
    }
  }
  
  // 3. Check forbidden terms (if any)
  let containsForbidden = false;
  let matchedForbidden = '';
  if (promptObj.validator.forbidden) {
    for (let term of promptObj.validator.forbidden) {
      const regex = term.includes(' ') ? new RegExp(term) : new RegExp('\\b' + term + '\\b');
      if (regex.test(normalized)) {
        containsForbidden = true;
        matchedForbidden = term;
        break;
      }
    }
  }
  
  if (feedback) feedback.style.display = 'block';
  
  // Determine success or error
  if (!allRequiredPresent) {
    if (feedback) {
      feedback.className = 'builder-feedback-error';
      feedback.innerHTML = `<strong>❌ Structure Error:</strong> Your comparison is missing the required element(s): ${missingTerms.join(', ')}.<br><small>${promptObj.validator.errorTip}</small>`;
    }
    if (modelBox) modelBox.style.display = 'none';
    if (typeof playSynthSound === 'function') playSynthSound('incorrect');
  } else if (!hasAnyOf) {
    if (feedback) {
      feedback.className = 'builder-feedback-error';
      feedback.innerHTML = `<strong>❌ Structure Error:</strong> Your sentence needs to include one of: ${missingAnyOf}.<br><small>${promptObj.validator.errorTip}</small>`;
    }
    if (modelBox) modelBox.style.display = 'none';
    if (typeof playSynthSound === 'function') playSynthSound('incorrect');
  } else if (containsForbidden) {
    if (feedback) {
      feedback.className = 'builder-feedback-error';
      feedback.innerHTML = `<strong>❌ Grammatical Error:</strong> Found incorrect comparative connector / word usage: "${matchedForbidden}".<br><small>${promptObj.validator.errorTip}</small>`;
    }
    if (modelBox) modelBox.style.display = 'none';
    if (typeof playSynthSound === 'function') playSynthSound('incorrect');
  } else {
    // Check order (e.g., más/menos/tan must appear before que/como)
    let comparativeWordIdx = -1;
    let connectorIdx = -1;
    
    const wordsToSearch = [...(promptObj.validator.anyOf || []), ...promptObj.validator.required];
    const descriptors = ['más', 'mas', 'menos', 'tan', 'tanto', 'tanta', 'tantos', 'tantas', 'mejor', 'peor', 'mayor', 'menor'];
    const connectors = ['que', 'como'];
    
    wordsToSearch.forEach(w => {
      const idx = normalized.indexOf(w);
      if (idx !== -1) {
        if (descriptors.includes(w)) {
          comparativeWordIdx = (comparativeWordIdx === -1) ? idx : Math.min(comparativeWordIdx, idx);
        }
        if (connectors.includes(w)) {
          connectorIdx = (connectorIdx === -1) ? idx : Math.min(connectorIdx, idx);
        }
      }
    });
    
    if (comparativeWordIdx !== -1 && connectorIdx !== -1 && connectorIdx < comparativeWordIdx) {
      if (feedback) {
        feedback.className = 'builder-feedback-error';
        feedback.innerHTML = `<strong>❌ Word Order Error:</strong> In Spanish, comparative words like "más/tan/tanto" must come before the connector "que/como" in standard comparisons.`;
      }
      if (modelBox) modelBox.style.display = 'none';
      if (typeof playSynthSound === 'function') playSynthSound('incorrect');
    } else {
      // Success!
      if (feedback) {
        feedback.className = 'builder-feedback-success';
        feedback.innerHTML = `<strong>✅ Structure Validated!</strong> Great job! You successfully structured the comparison. Now, compare your sentence with the model example below.`;
      }
      
      const modelEsEl = document.getElementById('compare-builder-model-es');
      const modelEnEl = document.getElementById('compare-builder-model-en');
      if (modelEsEl) modelEsEl.innerText = promptObj.modelEs;
      if (modelEnEl) modelEnEl.innerText = promptObj.modelEn;
      if (modelBox) modelBox.style.display = 'block';
      
      if (typeof playSynthSound === 'function') playSynthSound('correct');
      
      // Pronounce model sentence
      speakText(promptObj.modelEs);
    }
  }
}

function speakBuilderModel() {
  const promptObj = COMPARE_BUILDER_PROMPTS[state.builderPromptIndex];
  if (promptObj) speakText(promptObj.modelEs);
}

