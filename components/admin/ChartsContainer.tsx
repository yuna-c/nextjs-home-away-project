import Chart from './Chart'
import { fetchChartsData } from '@/utils/actions'

async function ChartsContainer() {
  const bookings = await fetchChartsData()
  if (bookings.length < 1) return null

  return <Chart data={bookings} />
}

export default ChartsContainer
