import {
  clampMarginPair,
  computeSpacers,
  getContentInsets,
  getHeaderFooterVisibility,
  isEmptyHtml,
  MIN_CONTENT_SIZE,
  type PaginationBlock,
} from '@/components/editor/page-layout'

const layout = { pageHeight: 1000, contentTop: 100, contentBottom: 100 }

const block = (height: number, extra: Partial<PaginationBlock> = {}): PaginationBlock => ({
  naturalGap: 0,
  marginSum: 0,
  height,
  breakBefore: false,
  ...extra,
})

describe('computeSpacers', () => {
  it('leaves blocks that fit on the page alone', () => {
    expect(computeSpacers([block(300), block(300)], layout)).toEqual([0, 0])
  })

  it('pushes a block that would cross the bottom inset to the next page', () => {
    // second block would span 400..900 → ok; third 900..1000 crosses 900
    const spacers = computeSpacers([block(300), block(500), block(100)], layout)
    // third block moves to 1000 + 100 = 1100; previous bottom is 900
    expect(spacers).toEqual([0, 0, 200])
  })

  it('accounts for margins around an inserted spacer', () => {
    const spacers = computeSpacers(
      [block(790), block(50, { naturalGap: 20, marginSum: 30 })],
      layout
    )
    // prev bottom 890; target 1100; spacer = 1100 - 890 - 30
    expect(spacers).toEqual([0, 180])
  })

  it('starts the block after a page break on the next page', () => {
    const spacers = computeSpacers(
      [block(100), block(20), block(50, { breakBefore: true })],
      layout
    )
    // break ends at 220 on page 0 → next block at 1100
    expect(spacers).toEqual([0, 0, 880])
  })

  it('does not push blocks taller than a page that start inside the body', () => {
    expect(computeSpacers([block(50), block(1500)], layout)).toEqual([0, 0])
  })

  it('moves a block that lands in the gap after an oversized block', () => {
    // 100..1600 overflows; next block would start at 1600, page 1 body ends at 1900 → fine
    // a block landing at 1950 (in page 1 bottom inset) goes to page 2
    const spacers = computeSpacers([block(1850), block(10)], layout)
    expect(spacers).toEqual([0, 2100 - 1950])
  })

  it('is stable: applying the result again yields the same spacers', () => {
    const blocks = Array.from({ length: 30 }, () => block(70, { naturalGap: 10, marginSum: 10 }))
    expect(computeSpacers(blocks, layout)).toEqual(computeSpacers(blocks, layout))
  })
})

describe('getHeaderFooterVisibility', () => {
  it('shows page numbers in the footer without creating an empty header', () => {
    const v = getHeaderFooterVisibility(false, false, true, 'footer-right')
    expect(v.headerZone).toBe(false)
    expect(v.footerZone).toBe(true)
    expect(v.footerText).toBe(false)
    expect(v.footerPageNumber).toBe('right')
  })

  it('keeps footer page numbers when the header is also shown', () => {
    const v = getHeaderFooterVisibility(true, true, true, 'footer-center')
    expect(v.headerPageNumber).toBeNull()
    expect(v.footerPageNumber).toBe('center')
  })

  it('places page numbers in the header', () => {
    const v = getHeaderFooterVisibility(false, true, true, 'header-left')
    expect(v.headerZone).toBe(true)
    expect(v.headerText).toBe(false)
    expect(v.headerPageNumber).toBe('left')
    expect(v.footerPageNumber).toBeNull()
  })

  it('hides page numbers when disabled or set to none', () => {
    expect(getHeaderFooterVisibility(false, false, false, 'footer-right').footerZone).toBe(false)
    expect(getHeaderFooterVisibility(false, false, true, 'none').footerZone).toBe(false)
  })
})

describe('getContentInsets', () => {
  it('uses the margins when there is no header or footer', () => {
    expect(getContentInsets({ top: 96, bottom: 72 }, 0, 0)).toEqual({ top: 96, bottom: 72 })
  })

  it('pushes the body below a header taller than the margin allows', () => {
    // header at 48px, 80px tall, 8px gap → body starts at 136
    expect(getContentInsets({ top: 96, bottom: 96 }, 80, 0).top).toBe(136)
  })

  it('keeps the margin when the header fits inside it', () => {
    expect(getContentInsets({ top: 96, bottom: 96 }, 20, 20)).toEqual({ top: 96, bottom: 96 })
  })
})

describe('clampMarginPair', () => {
  it('keeps a minimum content width between opposite margins', () => {
    expect(clampMarginPair(300, 300, 794)).toBe(794 - 300 - MIN_CONTENT_SIZE)
  })

  it('enforces the minimum margin', () => {
    expect(clampMarginPair(0, 96, 794)).toBe(24)
  })
})

describe('isEmptyHtml', () => {
  it('treats empty editor output as empty', () => {
    expect(isEmptyHtml('<p></p>')).toBe(true)
    expect(isEmptyHtml('')).toBe(true)
    expect(isEmptyHtml('<p>&nbsp;</p>')).toBe(true)
  })

  it('detects text and images', () => {
    expect(isEmptyHtml('<p>Title</p>')).toBe(false)
    expect(isEmptyHtml('<p><img src="x.png"></p>')).toBe(false)
  })
})
