'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { amenities, Amenity } from '@/utils/amenities'
import { useState } from 'react'

function AmenitiesInput({ defaultValue }: { defaultValue?: Amenity[] /* 묶음 저장 후 구문 분석 해야하니까 배열로 */ }) {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(defaultValue || amenities)

  const handleChange = (amenity: Amenity) => {
    setSelectedAmenities((prev) => {
      return prev.map((a) => {
        if (a.name === amenity.name) {
          return { ...a, selected: !a.selected }
        }
        return a
      })
    })
  }

  return (
    <section>
      <input
        type='hidden'
        name='amenities'
        // 문자열로 변환 전송
        value={JSON.stringify(selectedAmenities)}
      />

      <div className='grid grid-cols-2 gap-4'>
        {selectedAmenities.map((amenity) => (
          <div
            key={amenity.name}
            className='flex items-center space-x-2'
          >
            <Checkbox
              key={amenity.name}
              checked={amenity.selected}
              onCheckedChange={() => handleChange(amenity)}
              className='rounded-[4px]'
              id={amenity.name}
            />
            <label
              htmlFor={amenity.name}
              className='flex items-center gap-x-2 rounded-sm text-sm font-medium capitalize leading-none'
            >
              {amenity.name}
              <amenity.icon className='h-4 w-4' />
            </label>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AmenitiesInput
