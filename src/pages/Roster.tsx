import { ROSTER, STATUS_LABEL, type RosterMember } from '@/lib/roster';

/**
 * The roster page — honest status per character.
 *
 * House law: a character works only when a real system runs under them.
 * Everything else is labelled "in training". Nothing here claims function
 * this app does not have, and no job is invented ahead of V1 shipping it.
 */

function StatusPill({ member }: { member: RosterMember }) {
  const tone =
    member.status === 'active-here'
      ? { bg: 'rgba(52,211,153,0.12)', fg: '#6ee7b7', bd: 'rgba(52,211,153,0.35)' }
      : member.status === 'elsewhere'
        ? { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.6)', bd: 'rgba(255,255,255,0.18)' }
        : { bg: 'rgba(245,181,61,0.10)', fg: '#ffd47a', bd: 'rgba(245,181,61,0.32)' };

  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
      style={{ background: tone.bg, color: tone.fg, borderColor: tone.bd }}
    >
      {STATUS_LABEL[member.status]}
    </span>
  );
}

function Card({ member }: { member: RosterMember }) {
  const realized = member.status !== 'in-training';

  return (
    <article
      className="flex flex-col rounded-2xl border p-5"
      style={{
        borderColor: realized ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div
          className="h-1 w-10 shrink-0 rounded-full"
          style={{ background: member.accent, boxShadow: `0 0 12px ${member.accent}` }}
        />
        <StatusPill member={member} />
      </div>

      <h2 className="text-lg font-semibold text-white/90">{member.name}</h2>
      <p className="mb-1 text-[0.7rem] tracking-[0.14em] text-white/40 uppercase">
        {member.title} · {member.role}
      </p>
      <p className="mb-4 text-xs leading-relaxed text-white/50">{member.copy}</p>

      {member.worksHere.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 text-[10px] tracking-[0.18em] text-emerald-300 uppercase">
            Running here
          </div>
          <ul className="space-y-1">
            {member.worksHere.map((w) => (
              <li key={w} className="flex gap-2 text-xs text-white/80">
                <span aria-hidden="true" className="text-emerald-400">
                  ✓
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {member.elsewhereNote && (
        <p className="mb-3 text-xs leading-relaxed text-white/45">{member.elsewhereNote}</p>
      )}

      {member.inTraining.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 text-[10px] tracking-[0.18em] text-amber-300/80 uppercase">
            In training
          </div>
          <ul className="space-y-1">
            {member.inTraining.map((t) => (
              <li key={t} className="flex gap-2 text-xs text-white/45">
                <span aria-hidden="true" className="text-amber-400/70">
                  ·
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {member.accentNote && (
        <p className="mt-auto pt-2 text-[10px] leading-relaxed text-white/30">
          {member.accentLocked ? '' : 'Colour not locked — '}
          {member.accentNote}
        </p>
      )}
    </article>
  );
}

export function Roster() {
  const working = ROSTER.filter((m) => m.status === 'active-here').length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <p className="mb-3 text-xs tracking-[0.28em] text-[#f5b53d]/70 uppercase">
          The house roster
        </p>
        <h1 className="chrome-text mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Five agents. The roster is closed.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          A character works only when a real system runs under them. Everything
          else says “in training” — including jobs that are already running on
          other surfaces but not on this one. {working} of {ROSTER.length} are
          running here today.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROSTER.map((m) => (
          <Card key={m.name} member={m} />
        ))}
      </div>
    </main>
  );
}

export default Roster;
