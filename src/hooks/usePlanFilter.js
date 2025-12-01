import { useMemo, useState, useEffect } from 'react'
import { mockData } from '../data/mockData'

const usePlanFilter = () => {
  const initialFilters = {
    category: '5G/LTE 요금제',
    network: '5G/LTE',
    dataPrice: '',
    dataType: '',
    selectedApps: [],
  }

  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [tempFilters, setTempFilters] = useState(initialFilters)
  const [allPlans, setAllPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        //목업 데이터로 대체
        //const response = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/plans`)
        await new Promise(resolve => setTimeout(resolve, 200)) // 의도적인 네트워크 로딩 (로딩ui)
        setAllPlans(mockData)
        setError(null)
      } catch (err) {
        console.error('API 요청 실패:', err)
        setError('요금제 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const getCurrentCategoryData = () => {
    return allPlans.filter(plan => plan.category === appliedFilters.category)
  }

  const filteredPlans = useMemo(() => {
    const currentData = getCurrentCategoryData()

    return currentData.filter(plan => {
      const networkMatch =
        appliedFilters.network === '5G/LTE' ||
        (appliedFilters.network === '5G' &&
          (plan.title.includes('5G') || plan.description.includes('5G'))) ||
        (appliedFilters.network === 'LTE' &&
          (plan.title.includes('LTE') || plan.description.includes('LTE')))

      const dataPriceMatch = (() => {
        if (!appliedFilters.dataPrice) return true

        const price = parseInt(plan.price)
        switch (appliedFilters.dataPrice) {
          case '~5만원대':
            return price <= 50000
          case '6~8만원대':
            return price >= 60000 && price <= 80000
          case '9만원대~':
            return price >= 90000
          case '상관 없어요':
            return true
          default:
            return true
        }
      })()

      const dataTypeMatch = (() => {
        if (!appliedFilters.dataType) return true

        switch (appliedFilters.dataType) {
          case '다쓰면 속도제한':
            return (
              plan.postExhaustionDataSpeed &&
              (plan.postExhaustionDataSpeed.includes('Mbps') ||
                plan.postExhaustionDataSpeed.includes('Kbps'))
            )
          case '완전 무제한':
            return plan.data === '무제한' || plan.data.includes('무제한')
          case '상관 없어요':
            return true
          default:
            return true
        }
      })()

      const appMatch = (() => {
        if (appliedFilters.selectedApps.length === 0) return true

        const allBenefits = [
          ...(plan.basicBenefit
            ? Array.isArray(plan.basicBenefit)
              ? plan.basicBenefit
              : [plan.basicBenefit]
            : []),
          ...(Array.isArray(plan.premiumBenefit)
            ? plan.premiumBenefit
            : plan.premiumBenefit
              ? [plan.premiumBenefit]
              : []),
          ...(Array.isArray(plan.mediaBenefit)
            ? plan.mediaBenefit
            : plan.mediaBenefit
              ? [plan.mediaBenefit]
              : []),
        ]

        return appliedFilters.selectedApps.some(selectedApp =>
          allBenefits.some(
            benefit => benefit && benefit.toLowerCase().includes(selectedApp.toLowerCase())
          )
        )
      })()

      return networkMatch && dataPriceMatch && dataTypeMatch && appMatch
    })
  }, [appliedFilters, allPlans])

  const applyFilters = () => {
    setAppliedFilters(tempFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      category: appliedFilters.category,
      network: '5G/LTE',
      dataPrice: '',
      dataType: '',
      selectedApps: [],
    }
    setTempFilters(resetFilters)
    setAppliedFilters(resetFilters)
  }

  const toggleApp = appName => {
    setTempFilters(prev => ({
      ...prev,
      selectedApps: prev.selectedApps.includes(appName)
        ? prev.selectedApps.filter(name => name !== appName)
        : [...prev.selectedApps, appName],
    }))
  }

  const changeCategory = category => {
    setAppliedFilters(prev => ({
      ...prev,
      category: category,
    }))
    setTempFilters(prev => ({
      ...prev,
      category: category,
    }))
  }

  return {
    appliedFilters,
    tempFilters,
    filteredPlans,
    allPlans,
    loading,
    error,
    setTempFilters,
    applyFilters,
    resetFilters,
    toggleApp,
    changeCategory,
    getCurrentCategoryData,
  }
}

export default usePlanFilter
