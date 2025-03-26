// Nouveau fichier pour gérer l'inactivité
export class InactivityService {
  constructor(timeout = 5 * 60 * 1000) { // 2 minutes en millisecondes
    this.timeout = timeout;
    this.timeoutId = null;
    this.setupListeners();
  }

  setupListeners() {
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer());
    });
  }

  startTimer(logoutCallback) {
    this.logoutCallback = logoutCallback;
    this.resetTimer();
  }

  resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      // Afficher une alerte 30 secondes avant la déconnexion
      alert('Vous serez déconnecté dans 30 secondes pour inactivité');
      
      setTimeout(() => {
        if (this.logoutCallback) {
          this.logoutCallback();
        }
      }, 30000);
    }, this.timeout - 30000);
  }

  stopTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
} 