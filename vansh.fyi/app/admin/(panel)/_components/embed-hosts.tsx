'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addEmbedHostAction, removeEmbedHostAction } from '../../project-actions';
import { input, panel, secondary } from './ui';

/** Hosts a project page may embed. https is always required; this list is the allow-list. */
export default function EmbedHosts({ hosts }: { hosts: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const add = () =>
    start(async () => {
      const result = await addEmbedHostAction(value);
      if (!result.ok) return setError(result.error);
      setValue('');
      setError(null);
      router.refresh();
    });

  const remove = (host: string) =>
    start(async () => {
      const result = await removeEmbedHostAction(host);
      if (!result.ok) return setError(result.error);
      setError(null);
      router.refresh();
    });

  return (
    <section className={`${panel} p-5`} aria-label="Allowed embed hosts">
      <h2 className="text-lg font-light tracking-tighter font-geist text-white">Allowed embed hosts</h2>
      <p className="mt-1 text-sm text-white/50">Project pages can only embed https URLs on these hosts. Add a host before using it in a listing.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {hosts.length === 0 && <li className="text-sm text-white/50">None yet: no page can be embedded.</li>}
        {hosts.map((host) => (
          <li key={host} className="flex items-center gap-2 rounded-full bg-white/5 py-1 pl-3 pr-1 text-sm text-white ring-1 ring-white/10">
            {host}
            <button type="button" onClick={() => remove(host)} disabled={pending} aria-label={`Remove ${host}`} className="rounded-full px-2 py-0.5 text-white/50 transition hover:bg-red-500/20 hover:text-red-300">
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="info.vansh.fyi" aria-label="New host" className={`${input} max-w-xs`} />
        <button type="button" onClick={add} disabled={pending || !value.trim()} className={secondary}>
          Add host
        </button>
      </div>
      {error && (
        <p role="alert" className={`mt-3 rounded-xl px-4 py-3 text-sm ring-1 bg-red-500/10 text-red-300 ring-red-400/30`}>
          {error}
        </p>
      )}
    </section>
  );
}
