import { Stage, Phone, Bar, Icon, Roll, type Act } from '../../kit'
import './suppsdaily.css'

// SuppsDaily's Today screen as it ships now: the time-of-day hero with the
// day's ring and ribbon, then the window you're in (Morning) as a card of
// capsule ticks, with the next window (Lunch) running off the crop.
//
// Story, three beats: the morning card waiting (context), a tap on each
// capsule fills it (action), and the morning's count, the hero line, the
// ribbon and the ring all follow (payoff). The loop undoes the ticks in place,
// last first, as one quick motion, and the morning is ready again.
//
// Real strings: SuppsDaily, Morning, the hero line, the ring count, the
// ribbon's three windows, With breakfast, ~8 am, Vitamin D3, Omega-3 fish oil,
// Lunch and the doses. Everything else is a line.

type S = { d3: boolean; omega: boolean }
const START: S = { d3: false, omega: false }
const REST = { wide: { x: 300, y: 470 }, compact: { x: 290, y: 470 } }

const script = async (a: Act<S>) => {
  await a.wait(1300)
  a.mark('d3')
  await a.click({ at: 'd3', x: 0.5, y: 0.5 })
  a.put({ d3: true })
  await a.wait(1100)
  a.mark('omega')
  await a.click({ at: 'omega', x: 0.5, y: 0.5 })
  a.put({ omega: true })
  await a.move(REST[a.layout])
  a.mark('done')
  await a.wait(2600)
  // Undo in place, last tick first, so the morning reads as fresh again
  a.put({ omega: false })
  await a.wait(90)
  a.put({ d3: false })
  await a.wait(1400)
}

function Ring({ value, total }: { value: number; total: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  return (
    <span className="sd-ring">
      <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,.26)" strokeWidth="7" />
        <circle
          className="sd-ring__arc"
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / total)}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <span className="sd-ring__n">
        <b>
          <Roll>{`${value}/${total}`}</Roll>
        </b>
        <span>daily</span>
      </span>
    </span>
  )
}

function Capsule({ on, name }: { on: boolean; name: string }) {
  return (
    <span className="sd-box" data-on={on || undefined} data-target={name}>
      <Icon name="check" size={14} stroke={3} />
    </span>
  )
}

function Dose({ qty, unit }: { qty: string; unit: string }) {
  return (
    <span className="sd-qty">
      <span className="sd-qty__b">−</span>
      <span className="sd-qty__v">
        <b>{qty}</b>
        <span>{unit}</span>
      </span>
      <span className="sd-qty__b">+</span>
    </span>
  )
}

export default function SuppsDaily() {
  return (
    <Stage<S>
      width={400}
      height={520}
      compact={{ below: 400, width: 358, height: 520 }}
      initial={START}
      poster={{ d3: true, omega: true }}
      script={script}
      cursor={{ at: REST, style: 'touch' }}
      className="sd"
    >
      {(s, _rect, layout) => {
        const morning = Number(s.d3) + Number(s.omega)
        const taken = 1 + morning
        const left = 2 - morning
        return (
          <>
            <div className="sd-wash" />
            <Phone width={layout === 'compact' ? 326 : 300} dark className="sd-phone">
              <div className="sd-screen">
                <div className="sd-hero">
                  <div className="sd-hero__top">
                    <span className="sd-brand">SuppsDaily</span>
                    <span className="sd-date">Fri 6 Nov</span>
                  </div>
                  <div className="sd-hb">
                    <div className="sd-hb__t">
                      <span className="sd-eye">Now · until 10:00</span>
                      <span className="sd-h">Morning</span>
                      <span className="sd-sub">
                        <Roll variant="fade">{left === 0 ? 'Morning done.' : `${left} left to take.`}</Roll>
                      </span>
                    </div>
                    <Ring value={taken} total={5} />
                  </div>
                  <div className="sd-ribbon">
                    <span>
                      <i className="full" />
                      <em>Waking</em>
                    </span>
                    <span className="cur">
                      <i style={{ ['--p' as string]: `${morning * 50}%` }} />
                      <em>Morning</em>
                    </span>
                    <span>
                      <i />
                      <em>Evening</em>
                    </span>
                  </div>
                </div>

                <div className="sd-blk" style={{ ['--c' as string]: 'var(--sd-morning)' }}>
                  <div className="sd-blk__head">
                    <span className="sd-pip" />
                    <span className="sd-blk__t">
                      <span className="sd-blk__label">Morning</span>
                      <span className="sd-blk__sub">With breakfast</span>
                    </span>
                    <span className="sd-blk__count">
                      <Roll>{`${morning}/2`}</Roll>
                    </span>
                    <span className="sd-chip">~8 am</span>
                  </div>
                  <div className="sd-row" data-on={s.d3 || undefined}>
                    <Capsule on={s.d3} name="d3" />
                    <span className="sd-row__body">
                      <span className="sd-name">Vitamin D3</span>
                      <Bar w={92} h={6} r={3} tone={2} />
                    </span>
                    <Dose qty="1×" unit="tablet" />
                  </div>
                  <div className="sd-row" data-on={s.omega || undefined}>
                    <Capsule on={s.omega} name="omega" />
                    <span className="sd-row__body">
                      <span className="sd-name">Omega-3 fish oil</span>
                      <Bar w={74} h={6} r={3} tone={2} />
                    </span>
                    <Dose qty="1×" unit="softgel" />
                  </div>
                </div>

                <div className="sd-blk" style={{ ['--c' as string]: 'var(--sd-lunch)' }}>
                  <div className="sd-blk__head">
                    <span className="sd-pip" />
                    <span className="sd-blk__t">
                      <span className="sd-blk__label">Lunch</span>
                      <Bar w={58} h={6} r={3} tone={2} />
                    </span>
                    <span className="sd-chip">~1 pm</span>
                  </div>
                  <div className="sd-row">
                    <span className="sd-box sd-box--quiet" />
                    <span className="sd-row__body sd-row__body--bars">
                      <Bar w={70} h={8} r={4} tone={3} />
                      <Bar w={104} h={6} r={3} tone={2} />
                    </span>
                  </div>
                </div>
                <div className="sd-blk" style={{ ['--c' as string]: 'var(--sd-eve)' }}>
                  <div className="sd-blk__head">
                    <span className="sd-pip" />
                    <span className="sd-blk__t">
                      <span className="sd-blk__label">Evening</span>
                      <Bar w={84} h={6} r={3} tone={2} />
                    </span>
                    <span className="sd-chip">~6–10 pm</span>
                  </div>
                  <div className="sd-row">
                    <span className="sd-box sd-box--quiet" />
                    <span className="sd-row__body sd-row__body--bars">
                      <Bar w={96} h={8} r={4} tone={3} />
                      <Bar w={68} h={6} r={3} tone={2} />
                    </span>
                  </div>
                </div>
              </div>
            </Phone>
          </>
        )
      }}
    </Stage>
  )
}
