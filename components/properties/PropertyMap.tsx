'use client'

import CountryFlagAndName from '../card/CountryFlagAndName'
import Title from './Title'
import { findCountryByCode } from '@/utils/countries'
import { icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'

// 마커 이미지
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png'
const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30]
})

function PropertyMap({ countryCode }: { countryCode: string }) {
  const defaultLocation = [51.505, -0.09] as [number, number]
  // 위치 정보 없을 경우 표시할 기본 위치 (런던 근처 좌표)
  const location = findCountryByCode(countryCode)?.location as [number, number]

  return (
    <div className='mt-4'>
      <div className='mb-4'>
        <Title text='Where you will  be staying' />
        <CountryFlagAndName countryCode={countryCode} />
      </div>
      <MapContainer
        scrollWheelZoom={false} //휠 줌 비활성화
        zoomControl={false} //기본 줌 버튼 비활성화 (아래에서 수동으로 추가)
        className='relative z-0 h-[50vh] rounded-lg'
        center={location || defaultLocation} //위치 중심 좌표 (없으면 기본값)
        zoom={7}
      >
        <TileLayer
          //실제 지도의 타일 이미지 제공처 설정 (OpenStreetMap)
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ZoomControl position='bottomright' />
        <Marker
          position={location || defaultLocation}
          icon={markerIcon}
        ></Marker>
      </MapContainer>
    </div>
  )
}

export default PropertyMap
