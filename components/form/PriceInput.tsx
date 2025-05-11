import { Input } from '../ui/input'
import { Label } from '../ui/label'

// name='price'를 직접 쓰는 대신,
// import { PropertyScalarFieldEnum } from '@prisma/client'
// const name = PropertyScalarFieldEnum.price
// 라고 하면 Prisma 모델과 키 동기화에 유리함

type PriceInputProps = {
  defaultValue?: number
}

function PriceInput({ defaultValue }: PriceInputProps) {
  const name = 'price'

  return (
    <div className='mb-2'>
      <Label
        htmlFor={name}
        className='capitalize'
      >
        Price ($)
      </Label>
      <Input
        id={name}
        type='number'
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  )
}

export default PriceInput
