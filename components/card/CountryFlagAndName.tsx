import { findCountryByCode } from '@/utils/countries'
import Flag from 'react-world-flags'

function CountryFlagAndName({ countryCode }: { countryCode: string }) {
  const validCountry = findCountryByCode(countryCode)! // undefined 방지 ! 무조건 값이 있다 확신
  const countryName = validCountry.name.length > 20 ? `${validCountry?.name.substring(0, 20)}...` : validCountry.name
  return (
    <span className='flex items-center justify-between gap-2 text-sm'>
      {/*
        국가 코드로 나오는 이슈
        {validCountry?.flag} 
       */}

      <Flag
        code={validCountry!.code}
        style={{ width: 20, height: 20 }}
      />
      {countryName}
    </span>
  )
}

export default CountryFlagAndName
