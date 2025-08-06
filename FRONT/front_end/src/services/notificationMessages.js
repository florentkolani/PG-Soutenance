// Service pour personnaliser les messages de notification

export function getCustomNotificationMessage(notif) {
  if (notif.type === 'ticket') {
    if (notif.message && notif.message.includes('clôturé')) {
      return '🎉 Votre ticket a été clôturé avec succès!';
    }
    if (notif.message && notif.message.includes('créé')) {
      return '🆕 Vous venez de créer un nouveau ticket.';
    }
    if (notif.message && notif.message.includes('réponse')) {
      return '📬 Vous avez reçu une nouvelle réponse pour votre ticket.';
    }
    if (notif.message && notif.message.includes('Nouveau message client')) {
      return '💬 Un client a envoyé un nouveau message sur un ticket.';
    }
    if (notif.message && notif.message.includes('Nouveau message')) {
      return '💬 Vous avez un nouveau message pour votre ticket.';
    }
    if (notif.message && notif.message.includes('a été mis à jour')) {
      return '🔄 Le statut du ticket à été mis à jour avec succès.';
    }
    // Ajoute d'autres cas spécifiques si besoin
  }
  if (notif.type === 'task') {
    if (notif.message && notif.message.includes('assignée')) {
      return "📝 Vous venez d'être assignée a une nouvel tâche !";
    }
    if (notif.message && notif.message.includes('clôturée')) {
      return '✅ La tâche a été clôturée avec succès.';
    }
    if (notif.message && notif.message.includes('mise à jour')) {
      return '🔄 Statut de la tâche mis à jour avec succès.';
    }
    // Ajoute d'autres cas spécifiques si besoin
  }
  if (notif.type === 'message') {
    if (notif.message && notif.message.includes('Nouveau message')) {
      return '💬 Vous venez de recevoir un nouveau message.';
    }
    if (notif.message && notif.message.includes('réponse')) {
      return '📬 Vous avez reçu une nouvelle réponse.';
    }
  }
  // Par défaut, retourne le message du back
  return notif.message;
} 