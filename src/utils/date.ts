const longFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const compactFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

export const dateFormatDateHeure = (date: Date) => {
  if (date != null) {
    return longFormatter.format(new Date(date));
  }
};

export const dateFormatDateCompact = (date: Date) => {
  if (date != null) {
    return compactFormatter.format(new Date(date));
  }
};
