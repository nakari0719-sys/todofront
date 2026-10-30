import type { CSSProperties } from 'react'

type IconName = 'check' | 'plus' | 'list' | 'circle' | 'search' | 'edit' | 'trash' | 'arrow' | 'refresh' | 'close' | 'leaf'
const paths: Record<IconName, string> = {
  check: 'm5 12 4 4L19 6',
  plus: 'M12 5v14M5 12h14',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  search: 'm21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  edit: 'm16 3 5 5M4 20l5-1L21 7l-5-5L4 14z',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  refresh: 'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6',
  close: 'm6 6 12 12M6 18 18 6',
  leaf: 'M20 4C8 2 2 9 6 16s16 3 14-12ZM5 21 16 9',
}
export function Icon({ name, size = 20, className = '', style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}><path d={paths[name]} /></svg>
}
