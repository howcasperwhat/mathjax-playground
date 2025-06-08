import type { UseStorageOptions } from '@vueuse/core'
import { APP_NAME } from '~/constants/global'

export function useAppLocalStorage<T>(
  key: string,
  initialValue: T | MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) {
  return useLocalStorage<T>(`${APP_NAME}_${key}`, initialValue, options)
}
