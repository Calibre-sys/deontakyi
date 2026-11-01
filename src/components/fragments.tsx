/*
 * Interface fragments for the two private projects that have no screen recording.
 * They show what each tool produces. Contents are representative samples, not real records.
 */

export function OutreachEmail() {
  return (
    <div data-ui className="w-[78%] max-w-[30rem] bg-paper p-7 text-[15px] leading-relaxed text-ink">
      <p className="text-[13px] text-muted">From SOH Energy · To a contact on the manpower list</p>
      <p className="mt-1 font-semibold">Are you available for upcoming projects?</p>
      <p className="mt-5">Good morning,</p>
      <p className="mt-3">
        SOH Energy is updating its manpower database for upcoming projects. Please let us know if you are available by choosing
        one option below. It takes one click.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="bg-accent px-4 py-2 font-semibold text-accent-ink">Yes, I'm available</span>
        <span className="bg-field px-4 py-2 font-semibold">Not at the moment</span>
      </div>
      <p className="mt-5 text-[13px] text-muted">
        Replies are logged to the sheet automatically. No reply after three days sends a reminder.
      </p>
    </div>
  );
}

const APPLICANTS = [
  { id: "Applicant 041", score: 92, why: "Five years in fuel logistics, BDC experience, strong references" },
  { id: "Applicant 017", score: 88, why: "Petroleum engineering degree, sales internship at an OMC" },
  { id: "Applicant 063", score: 81, why: "Commercial background, needs depot operations training" },
  { id: "Applicant 008", score: 64, why: "Relevant degree, no industry experience yet" },
];

export function Shortlist() {
  return (
    <div data-ui className="w-[82%] max-w-[34rem] bg-paper p-7 text-ink">
      <p className="text-[13px] text-muted">Shortlist · Business Development Associate · 58 CVs screened</p>
      <table className="mt-4 w-full text-left text-[14px]">
        <thead>
          <tr className="text-muted">
            <th className="pb-2 font-normal">Applicant</th>
            <th className="pb-2 font-normal">Fit</th>
            <th className="pb-2 font-normal">Why</th>
          </tr>
        </thead>
        <tbody>
          {APPLICANTS.map((a) => (
            <tr key={a.id} className="align-top">
              <td className="py-2 pr-3 font-semibold whitespace-nowrap">{a.id}</td>
              <td className="py-2 pr-3 tabular-nums">{a.score}</td>
              <td className="py-2">{a.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-[13px] text-muted">Top three get an interview invitation drafted automatically.</p>
    </div>
  );
}
