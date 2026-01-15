import { useEffect, useMemo, useState } from 'react'
import usePlanFilter from './../../../hooks/usePlanFilter'
import TabMenu from './../TabMenu/TabMenu'
import FilterSort from '../FilterSort/FilterSort'
import PlanGrid from '../PlanGrid/PlanGrid'
import FilterModal from '../FilterModal/FilterModal'
import styles from './PlanCardSystem.module.css'
import LoadingScreen from './../../chatbot/LoadingScreen'
import ScrollToTopButton from '../../ScrollToTopButton'

const PlanCardSystem = ({ onFilterModalState }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  //정렬 및 나이대 필터 변수
  const [currentSort, setCurrentSort] = useState('popularity')
  const [currentAgeGroup, setCurrentAgeGroup] = useState('all')

  //페이지네이션 초기화
  const [resetTrigger, setResetTrigger] = useState(0)

  const {
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
  } = usePlanFilter()

  //필터 모달상태 변경 시 PageList에 알림
  useEffect(() => {
    if (onFilterModalState) {
      onFilterModalState(isFilterOpen)
    }
  }, [isFilterOpen, onFilterModalState])

  //탭 변경 시 페이지네이션 초기화
  useEffect(() => {
    if (appliedFilters?.category) {
      setResetTrigger(prev => prev + 1)
    }
  }, [appliedFilters?.category])

  //정렬이나 나이대 필터 변경시에도 페이지네이션 초기화
  useEffect(() => {
    setResetTrigger(prev => prev + 1)
  }, [currentSort, currentAgeGroup])

  const getSortedPlans = useMemo(() => {
    let sortedPlans = [...filteredPlans]

    switch (currentSort) {
      case 'popularity':
        //인기순 정렬
        sortedPlans.sort((a, b) => {
          const rankA = parseInt(a.popularityRank) || 999
          const rankB = parseInt(b.popularityRank) || 999
          return rankA - rankB
        })
        break

      case 'priceLow':
        // 낮은 가격순
        sortedPlans.sort((a, b) => {
          const priceA = parseInt(a.price) || 0
          const priceB = parseInt(b.price) || 0
          return priceA - priceB
        })
        break

      case 'priceHigh':
        // 높은 가격순
        sortedPlans.sort((a, b) => {
          const priceA = parseInt(a.price) || 0
          const priceB = parseInt(b.price) || 0
          return priceB - priceA
        })
        break

      case 'dataHigh':
        // 데이터 많은 순
        sortedPlans.sort((a, b) => {
          const getDataValue = dataStr => {
            if (!dataStr) return 0

            // 무제한인 경우 최고값
            if (dataStr.includes('무제한') || dataStr.toLowerCase().includes('unlimited')) {
              return 999999
            }

            // 범위 처리: 예) "250MB~1GB"
            const rangeMatch = dataStr.match(
              /(\d+(?:\.\d+)?)(MB|GB|TB)?\s*~\s*(\d+(?:\.\d+)?)(MB|GB|TB)?/i
            )
            if (rangeMatch) {
              let value = parseFloat(rangeMatch[3]) // 상한값 사용
              let unit = (rangeMatch[4] || rangeMatch[2] || 'MB').toUpperCase() // 단위가 없으면 앞 단위 또는 MB

              if (unit === 'GB') value *= 1000
              else if (unit === 'TB') value *= 1000000
              // MB는 그대로

              return value
            }

            // 숫자 추출 (GB, MB 단위 고려)
            const numbers = dataStr.match(/(\d+(?:\.\d+)?)/g)
            if (!numbers) return 0

            let value = parseFloat(numbers[0])

            // 단위 변환 (GB = 1000MB로 계산)
            if (dataStr.toUpperCase().includes('GB')) {
              value = value * 1000
            } else if (dataStr.toUpperCase().includes('TB')) {
              value = value * 1000000
            }
            // MB는 그대로

            return value
          }

          const dataA = getDataValue(a.data)
          const dataB = getDataValue(b.data)
          return dataB - dataA // 내림차순 (많은 순)
        })
        break

      default:
        // 기본값은 그대로
        break
    }

    //나이대 필터 적용
    if (currentAgeGroup !== 'all') {
      sortedPlans = sortedPlans.filter(plan => {
        if (
          !plan.ageGroup ||
          plan.ageGroup === 'all' ||
          plan.ageGroup === '전체' ||
          plan.ageGroup === '' ||
          plan.ageGroup === null
        ) {
          return true
        }

        const planAge = parseInt(plan.ageGroup)
        const filterAge = parseInt(currentAgeGroup)

        if (currentAgeGroup === '60') {
          return planAge >= 60
        } else {
          return planAge >= filterAge && planAge < filterAge + 10
        }
      })
    }

    return sortedPlans
  }, [filteredPlans, currentSort, currentAgeGroup])

  //정렬 변경 핸들러
  const handleSortChange = sortType => {
    setCurrentSort(sortType)
  }

  //나이대 필터 변경 핸들러
  const handleAgeGroupChange = ageGroup => {
    setCurrentAgeGroup(ageGroup)
  }

  //필터 적용 및 모달닫기
  const handleApplyFilters = () => {
    applyFilters()
    setIsFilterOpen(false)
    setResetTrigger(prev => prev + 1)
  }

  //전체 초기화(필터,정렬,페이지네이션)
  const handleResetAll = () => {
    resetFilters()
    setCurrentSort('popularity')
    setCurrentAgeGroup('all')
    setResetTrigger(prev => prev + 1)
  }

  // 로딩 상태 처리
  if (loading) {
    return <LoadingScreen />
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <TabMenu
          selectedCategory={appliedFilters.category}
          onCategoryChange={changeCategory}
          allPlans={allPlans} // 전체 플랜 데이터 전달 (카테고리별 개수 표시용)
        />

        <FilterSort
          selectedCategory={appliedFilters.category}
          onFilterOpen={() => setIsFilterOpen(true)}
          onSortChange={handleSortChange}
          onAgeGroupChange={handleAgeGroupChange}
          currentSort={currentSort}
          currentAgeGroup={currentAgeGroup}
        />

        <PlanGrid
          plans={getSortedPlans} // 정렬된 결과 전달
          onResetFilters={handleResetAll}
          resetTrigger={resetTrigger}
        />
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        onApply={handleApplyFilters}
        onReset={() => {
          resetFilters()
          setCurrentSort('popularity')
          setCurrentAgeGroup('all')
        }}
        onToggleApp={toggleApp}
      />
      <ScrollToTopButton isOpen={isFilterOpen} />
    </div>
  )
}

export default PlanCardSystem
