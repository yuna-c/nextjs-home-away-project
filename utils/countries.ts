import countries from 'world-countries'

export const formattedCountries = countries.map((item) => {
  return {
    code: item.cca2, // 국가 코드 (cca2)
    name: item.name.common, // 국가 이름
    flag: item.flag, // 이모지 국기 (여기선 안 씀)
    location: item.latlng, // 위도 경도
    region: item.region // 대륙
  }
})

export const findCountryByCode = (code: string) => {
  return formattedCountries.find((item) => item.code === code)
}
