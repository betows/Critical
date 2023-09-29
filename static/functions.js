export const refresh = context =>
  context.$axios.post('/token/refresh/', {
    refresh: context.$cookies.get('refresh-token')
  }).then((resp) => {
    context.$cookies.set('access-token', resp.data.access)
    return resp
  }).catch((r) => {
    if (r.message === 'Network Error') { return { status: 500 } }
    const store = context.store || context.$store
    clearInterval(store.state.interval)
    context.$cookies.removeAll()
    return r.response
  })

export const init_refresh = (context, initial_call) => {
  if (initial_call) {
    client_refresh(context)
  }
  const interval = setInterval(() => client_refresh(context), process.env.REFRESH_INTERVAL_SEC * 1000)
  const store = context.$store || context.store
  store.commit('setInterval', interval)
}

export const get_auth_header = (context) => {
  return { headers: { Authorization: 'Bearer ' + context.$cookies.get('access-token') } }
}

export const get_pos_auth_header = (baseApiKey) => {
  return { headers: { 'x-api-key': baseApiKey } }
}

export const get_default_head = (context, title_suffix) => {
  return {
    title: context.brand.platform_name + title_suffix,
    link: [{
      hid: 'shortcut icon',
      rel: 'shortcut icon',
      href: context.brand.favicon
    }],
    meta: [{
      hid: 'theme-color',
      name: 'theme-color',
      content: context.brand.theme.primary
    }]
  }
}

export const logout = (context) => {
  const store = context.store || context.$store
  clearInterval(store.state.interval)
  const cfg = get_auth_header(context)
  context.$axios.post('/authentication/logout/', {
    refresh: context.$cookies.get('refresh-token')
  }, cfg).catch(() => {})
  context.$cookies.removeAll()
  const router = context.$router || context.app.router
  router.push('/login')
}

export const validateFileType = (type, val) => {
  const valType = val.split('.').pop().toLowerCase()
  switch (type) {
    case 'img': return /png/.test(valType) || /jpg/.test(valType) || /jpeg/.test(valType)
    case 'pdf': return /pdf/.test(valType)
    case 'doc': return /doc/.test(valType)
    case 'xls': return /xls/.test(valType) || /csv/.test(valType)
    case 'ppt': return /ppt/.test(valType)
    default: return null
  }
}

export const validateURLFileTypeReturnIcon = (context, val) => {
  const str = val.split('.').pop().toLowerCase()
  if (/png/.test(str) || /jpg/.test(str) || /jpeg/.test(str)) { return context.JpgFileIcon } else if (/pdf/.test(str)) { return context.PdfFileIcon } else if (/doc/.test(str)) { return context.DocFileIcon } else if (/xls/.test(str) || /csv/.test(str)) { return context.XlsFileIcon } else if (/ppt/.test(str)) { return context.PptFileIcon }
}

export const urlify = (txt) => {
  if (!txt) { return }
  const urlRegex = /(<img\s[^>]*>|<a(?:\s[^>]*)?>[\s\S]*?<\/a>|<iframe(?:\s[^>]*)?>[\s\S]*?<\/iframe>)|(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi // eslint-disable-line no-useless-escape
  return txt.replace(urlRegex, function (url, tag) {
    if (tag) { return url }
    let hyperlink = url
    if (!hyperlink.match('^https?:\/\/')) { // eslint-disable-line no-useless-escape
      hyperlink = 'https://' + hyperlink
    }
    return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
  })
}

export const format_time = (val) => {
  if (val < 0) { return '00:00:00' }
  let seconds = parseInt(val, 10) // don't forget the second param
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds - (hours * 3600)) / 60)
  seconds = seconds - (hours * 3600) - (minutes * 60)
  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  const time = hours + ':' + minutes + ':' + seconds
  return time
}

export const convert_date_format = (date) => {
  if (date !== null && date !== undefined) {
    const isYYYYMMDD = date.split('/')[0] === date
    const isDDMMYYYY = date.split('-')[0] === date
    if (isYYYYMMDD) {
      const date_aux = date.split('-').reverse().join('/')
      return date_aux
    } else if (isDDMMYYYY) {
      const date_aux = date.split('/').reverse().join('-')
      return date_aux
    }
  } else {
    return date
  }
}

export function formatCurrency (amount) {
  return amount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount) : '-'
}

export const getSimpleDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}
