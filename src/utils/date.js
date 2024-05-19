import moment from 'moment/moment'
import 'moment/locale/fr'

export const dateFormatDateHeure = (date) => {
  if (date != null) {
    moment.locale('fr');
    return moment(date).format('d MMMM YYYY à HH:mm:ss');
  }
}

export const dateFormatDateCompact = (date) => {
  if (date != null) {
    moment.locale('fr');
    return moment(date).format('d/MM/YYYY');
  }
}