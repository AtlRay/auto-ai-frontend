import { useState } from 'react';
import { ZayraFormProvider, ZayraField, ZayraSubmit } from '@/components/forms/ZayraForm';
import { useZayraPresence } from '@/hooks/useZayraPresence';

/**
 * Founder Engine stage 4 — "Formation".
 *
 * The form HOUSE FORM LAW was written for: almost every field here is a legal
 * string that would land on a state filing, so each carries the visual
 * spelling gate and submit stays closed until all of them are confirmed.
 *
 * ALPHA SAFETY LOCK: live filing is off. This prepares a draft and says so.
 * Nothing here submits to any state, and no wording implies it does.
 *
 * FUTURE PORT — do not build ahead of it. Formation is one third of the AEGIS
 * HUB that Lovable is building on V1 (formation + Deadline Ledger + trademark
 * protection, unified under one shield page). This stage is the port target,
 * not a place to invent a second design. See V2-AUTOMATION-GATE.md.
 */
function FormationForm() {
  const { setOpen, setCaption } = useZayraPresence();
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-xl text-left">
      <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-500/5 p-3">
        <div className="mb-1 text-[10px] tracking-[0.2em] text-amber-300 uppercase">
          Live filing is locked
        </div>
        <p className="text-xs leading-relaxed text-white/70">
          This prepares your filing draft. Nothing is submitted to any state
          during private alpha, and no fee is charged.
        </p>
      </div>

      <ZayraField
        name="entityName"
        label="Entity name"
        hint="Exactly as it should appear on the filing, including the suffix."
        legal
      />
      <ZayraField
        name="formationState"
        label="Formation state"
        hint="Where the entity will be formed."
      />
      <ZayraField
        name="organizerName"
        label="Organizer's full legal name"
        hint="The person signing as organizer."
        legal
      />
      <ZayraField
        name="agentName"
        label="Registered agent name"
        hint="Must match the agent's records exactly."
        legal
      />
      <ZayraField
        name="agentAddress"
        label="Registered agent address"
        hint="Street address in the formation state. No PO boxes."
        legal
        multiline
      />

      <div className="mb-5">
        <button
          type="button"
          onClick={() => {
            setCaption(
              "I can prepare these from what you've told me — my drafting isn't connected in this build yet.",
            );
            setOpen(true);
          }}
          className="inline-flex min-h-11 items-center rounded-lg border border-violet-400/30 px-4 text-sm text-violet-100/80 transition hover:border-violet-400/60 hover:bg-violet-500/10"
        >
          Ask Zayra to prepare this
        </button>
      </div>

      <ZayraSubmit label="Save filing draft" onSubmit={() => setSaved(true)} />

      {saved && (
        <div className="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-100/80">
          Draft saved on this device. It has not been filed, and nothing was
          sent to a state or an agent — live filing stays locked during alpha.
        </div>
      )}
    </div>
  );
}

export function StageFormation() {
  return (
    <ZayraFormProvider>
      <FormationForm />
    </ZayraFormProvider>
  );
}

export default StageFormation;
