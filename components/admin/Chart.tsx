'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type ChartPropsType = {
  data: {
    date: string
    count: number // 해당 달의 예약 수
  }[]
}

function Chart({ data }: ChartPropsType) {
  return (
    <section className='mt-24'>
      <h1 className='text-center text-4xl font-semibold'>Monthly Bookings</h1>

      {/* 반응형 차트 컨테이너 (부모 요소 크기에 맞게 자동 조절됨) */}
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <BarChart
          data={data}
          margin={{ top: 50 }} // 차트와 상단 간격
        >
          {/* 배경 격자 */}
          <CartesianGrid strokeDasharray='3 3' />
          {/* X축 - 날짜 (월별) */}
          <XAxis dataKey='date' />
          {/* Y축 - 예약 수, 소수점 제거 */}
          <YAxis allowDecimals={false} />
          {/* 마우스 오버 시 툴팁 표시 */}
          <Tooltip />
          {/* 막대그래프 - count값 기준, 색상 설정 */}
          <Bar
            dataKey='count'
            fill='#ef7215'
            barSize={75}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}

export default Chart
