import { Card, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { calculateTotals } from '@/utils/calculateTotals'
import { formatCurrency } from '@/utils/format'
import { useProperty } from '@/utils/store'

function BookingForm() {
  const { range, price } = useProperty((state) => state)
  const checkIn = range?.from as Date
  const checkOut = range?.to as Date
  const { totalNights, subTotal, cleaning, service, tax, orderTotal } = calculateTotals({ checkIn, checkOut, price })
  return (
    <Card className='mb-4 p-8'>
      <CardTitle className='mb-8'>Summary</CardTitle>
      <FormRow
        label={`$${price} x ${totalNights} nights`}
        amount={subTotal}
      />
      <FormRow
        label='Cleaning Fee'
        amount={cleaning}
      />
      <FormRow
        label='Service Fee'
        amount={service}
      />
      <FormRow
        label='Tax'
        amount={tax}
      />
      <Separator className='mt-4' />
      <CardTitle className='mt-8'>
        <FormRow
          label='Booking Total'
          amount={orderTotal}
        />
      </CardTitle>
    </Card>
  )
}

function FormRow({ label, amount }: { label: string; amount: number }) {
  return (
    <p className='mb-2 flex justify-between text-sm'>
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </p>
  )
}
export default BookingForm
