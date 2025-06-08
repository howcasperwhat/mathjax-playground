export function getMaybeTransformedBBox(element: SVGGraphicsElement) {
  const [C, P] = [element, element.parentElement] as SVGGraphicsElement[]

  // https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#getCTM
  // [[a, c, e], [b, d, f], [0, 0, 1]]
  // a: scaleX, d: scaleY | b: skewY, c: skewX (tanθ) | e: translateX, f: translateY

  const CRM = C.getCTM()!
  const PRM = P.getCTM()!
  const RPM = PRM.inverse()
  if (!RPM) {
    message.error('Parent Element is not invertible')
    return { x: 0, y: 0, w: 0, h: 0 }
  }
  const CPM = RPM.multiply(CRM)

  // https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#getBBox
  // DOMRect that before transform (if has transform)
  const CBox = C.getBBox()
  // Transform to the parent coordinate system
  const x = CPM.a * CBox.x + CPM.c * CBox.y + CPM.e
  const y = CPM.b * CBox.x + CPM.d * CBox.y + CPM.f

  const CRect = element.getBoundingClientRect()
  const PSM = P.getScreenCTM()!
  // The unit length of the base coordinate of
  // the parent element in the screen coordinate system
  const wu = Math.sqrt(PSM.a * PSM.a + PSM.c * PSM.c)
  const hu = Math.sqrt(PSM.b * PSM.b + PSM.d * PSM.d)
  if (wu === 0 || hu === 0) {
    message.error('scale factor is zero, cannot calculate size.')
    return { x: 0, y: 0, w: 0, h: 0 }
  }
  // width and height in the parent coordinate system
  const w = CRect.width / wu
  const h = CRect.height / hu
  return { x, y, w, h }
}
