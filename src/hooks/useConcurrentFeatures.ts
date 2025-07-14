import { 
  useTransition, 
  useDeferredValue, 
  useState, 
  useCallback, 
  useMemo,
  startTransition 
} from 'react'

export function useOptimizedSearch<T>(
  data: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs = 300
) {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)
  
  const filteredData = useMemo(() => {
    if (!deferredQuery) return data
    return data.filter(item => searchFn(item, deferredQuery))
  }, [data, deferredQuery, searchFn])
  
  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setQuery(value)
    })
  }, [])
  
  return {
    query,
    filteredData,
    handleSearch,
    isPending,
    isStale: query !== deferredQuery
  }
}

export function useOptimizedDataUpdates<T>(
  initialData: T[],
  maxRetentionTime = 300000 // 5 minutes
) {
  const [data, setData] = useState<T[]>(initialData)
  const [, startTransition] = useTransition()
  
  const addData = useCallback((newData: T & { timestamp: number }) => {
    startTransition(() => {
      const now = Date.now()
      const cutoffTime = now - maxRetentionTime
      
      setData(prev => {
        const updatedData = [...prev, newData]
        return updatedData.filter(item => 
          (item as any).timestamp > cutoffTime
        )
      })
    })
  }, [maxRetentionTime])
  
  const deferredData = useDeferredValue(data)
  
  return {
    data: deferredData,
    addData,
    count: data.length
  }
}