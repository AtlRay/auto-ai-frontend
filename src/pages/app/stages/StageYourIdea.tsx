import { useState } from 'react';
import { ZayraFormProvider, ZayraField, ZayraSubmit } from '@/components/forms/ZayraForm';
import { useZayraPresence } from '@/hooks/useZayraPresence';

/**
 * Founder Engine stage 1 — "Your Idea".
 *
 * The first form built under HOUSE FORM LAW, compliant from birth: Zayra can
 * inject values, anything she fills is marked, every field stays editable, the
 * founder presses submit, and the business name is a legal string gated behind
 * visual spelling confirmation.
 */
function IdeaForm() {
  const { setOpen, setCaption } = useZayraPresence();
  const [captured, setCaptured] = useState(false);

  return (
    <div className="mx-auto max-w-xl text-left">
      <ZayraField
        name="idea"
        label="What's the business?"
        hint="One or two sentences is plenty. Zayra works from this."
        multiline
      />
      <ZayraField
        name="serves"
        label="Who is it for?"
        hint="The person who pays you."
        multiline
      />
      <ZayraField
        name="businessName"
        label="Business name"
        hint="This is the name that would go on a filing, so it has to be exact."
        legal
      />

      <div className="mb-5">
        <button
          type="button"
          onClick={() => {
            setCaption(
              "Ask me to draft this and I'll fill it in — my drafting isn't connected in this build yet.",
            );
            setOpen(true);
          }}
          className="inline-flex min-h-11 items-center rounded-lg border border-violet-400/30 px-4 text-sm text-violet-100/80 transition hover:border-violet-400/60 hover:bg-violet-500/10"
        >
          Ask Zayra to fill this in
        </button>
      </div>

      <ZayraSubmit label="Save my idea" onSubmit={() => setCaptured(true)} />

      {captured && (
        <div className="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-500/5 p-3 text-xs text-emerald-100/80">
          Captured on this device. Nothing has been sent to your account — the
          founder record isn't wired up in this build yet.
        </div>
      )}
    </div>
  );
}

export function StageYourIdea() {
  return (
    <ZayraFormProvider>
      <IdeaForm />
    </ZayraFormProvider>
  );
}

export default StageYourIdea;
