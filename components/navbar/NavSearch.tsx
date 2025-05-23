'use client'

import { Input } from '../ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function NavSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '')
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {}, [])

  return (
    <Input
      type='text'
      placeholder='find a property...'
      className='max-w-xs dark:bg-muted'
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        handleSearch(e.target.value)
      }}
    />
  )
}

export default NavSearch
