export const crashByHour = [
  { hour: '0', count: 3241 }, { hour: '1', count: 2187 }, { hour: '2', count: 1823 },
  { hour: '3', count: 1342 }, { hour: '4', count: 1156 }, { hour: '5', count: 1834 },
  { hour: '6', count: 3521 }, { hour: '7', count: 6234 }, { hour: '8', count: 7891 },
  { hour: '9', count: 6543 }, { hour: '10', count: 6712 }, { hour: '11', count: 7234 },
  { hour: '12', count: 7891 }, { hour: '13', count: 7654 }, { hour: '14', count: 8123 },
  { hour: '15', count: 9234 }, { hour: '16', count: 10123 }, { hour: '17', count: 11234 },
  { hour: '18', count: 9876 }, { hour: '19', count: 7654 }, { hour: '20', count: 6234 },
  { hour: '21', count: 5432 }, { hour: '22', count: 4876 }, { hour: '23', count: 3921 },
]

export const crashByDay = [
  { day: 'Sun', count: 21432 }, { day: 'Mon', count: 23456 }, { day: 'Tue', count: 24123 },
  { day: 'Wed', count: 24567 }, { day: 'Thu', count: 25234 }, { day: 'Fri', count: 27891 },
  { day: 'Sat', count: 16973 },
]

export const crashByMonth = [
  { month: 'Jan', count: 11234 }, { month: 'Feb', count: 10123 }, { month: 'Mar', count: 13456 },
  { month: 'Apr', count: 13789 }, { month: 'May', count: 14234 }, { month: 'Jun', count: 14567 },
  { month: 'Jul', count: 14123 }, { month: 'Aug', count: 13891 }, { month: 'Sep', count: 13234 },
  { month: 'Oct', count: 14456 }, { month: 'Nov', count: 13123 }, { month: 'Dec', count: 13446 },
]

export const damageCategories = [
  { category: 'OVER $1,500', count: 94321 },
  { category: '$501 - $1,500', count: 41234 },
  { category: '$500 OR LESS', count: 28121 },
]

export const weatherConditions = [
  { condition: 'CLEAR', count: 112345 },
  { condition: 'RAIN', count: 23456 },
  { condition: 'SNOW', count: 12345 },
  { condition: 'CLOUDY/OVERCAST', count: 8765 },
  { condition: 'FOG/SMOKE/HAZE', count: 2345 },
  { condition: 'SLEET/HAIL', count: 1234 },
  { condition: 'FREEZING RAIN/DRIZZLE', count: 987 },
  { condition: 'BLOWING SNOW', count: 765 },
  { condition: 'SEVERE CROSS WIND GATE', count: 432 },
  { condition: 'OTHER', count: 1002 },
]

export const lightingConditions = [
  { condition: 'DAYLIGHT', count: 89234 },
  { condition: 'DARKNESS, LIGHTED ROAD', count: 45678 },
  { condition: 'DARKNESS', count: 18765 },
  { condition: 'DUSK', count: 5432 },
  { condition: 'DAWN', count: 4567 },
]

export const severityDistribution = [
  { severity: 'NO INDICATION OF INJURY', count: 83215 },
  { severity: 'REPORTED, NOT EVIDENT', count: 34567 },
  { severity: 'NONINCAPACITATING INJURY', count: 28901 },
  { severity: 'INCAPACITATING INJURY', count: 13456 },
  { severity: 'FATAL', count: 3537 },
]

export const intersectionRiskByControl = [
  { type: 'NO CONTROLS',        atRiskRate: 32.4 },
  { type: 'YIELD',              atRiskRate: 30.1 },
  { type: 'RAILWAY CROSSING',   atRiskRate: 34.8 },
  { type: 'STOP SIGN/FLASHER',  atRiskRate: 28.3 },
  { type: 'OTHER REG. SIGN',    atRiskRate: 26.7 },
  { type: 'TRAFFIC SIGNAL',     atRiskRate: 24.5 },
]

export const intersectionRiskByType = [
  { type: 'FOUR WAY',                       atRiskRate: 29.3 },
  { type: 'T-INTERSECTION',                 atRiskRate: 27.8 },
  { type: 'NOT DIVIDED',                    atRiskRate: 26.4 },
  { type: 'DIVIDED - W/MEDIAN (NOT RAISED)',atRiskRate: 24.2 },
  { type: 'ONE-WAY',                        atRiskRate: 22.9 },
  { type: 'DIVIDED - W/MEDIAN BARRIER',     atRiskRate: 21.7 },
]

// At Risk rate (%) per [day 0=Sun..6=Sat][hour 0-23]
const hourBase = [38,42,45,40,32,28,24,22,21,22,23,24,24,25,26,26,25,26,27,28,30,33,35,37]
const dayMult  = [1.08, 0.94, 0.94, 0.94, 0.95, 1.00, 1.12]
export const riskHeatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => Math.min(50, Math.round(hourBase[h] * dayMult[d])))
)
