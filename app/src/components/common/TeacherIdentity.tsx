import { GraduationCap } from 'lucide-react';

/** Professional account identity; callers render it only in professional views. */
export function TeacherIdentity({ username, label }: { username: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 max-w-full items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5">
      <GraduationCap aria-hidden="true" size={16} className="shrink-0 text-indigo-300" />
      <div className="min-w-0">
        <span className="block truncate text-[10px] font-semibold text-indigo-300">{label}</span>
        <bdi title={username} className="block max-w-52 truncate text-xs font-bold text-slate-100">{username}</bdi>
      </div>
    </div>
  );
}
