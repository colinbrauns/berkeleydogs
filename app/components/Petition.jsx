'use client';
import { useEffect, useState } from 'react';

export default function Petition() {
  const [signatures, setSignatures] = useState([]);
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [zip, setZip] = useState(''), [reason, setReason] = useState('');
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    try { setSignatures(JSON.parse(localStorage.getItem('bd_signatures') || '[]')); } catch {}
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !zip || !consent) return;
    const entry = { name, zip, reason, ts: Date.now() };
    const next = [entry, ...signatures].slice(0, 1000);
    setSignatures(next);
    try { localStorage.setItem('bd_signatures', JSON.stringify(next)); } catch {}
    setName(''); setEmail(''); setZip(''); setReason('');
  };

  return (
    <div className="card" id="petition">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:12}}>
        <h3 style={{margin:0}}>Petition: Daily Off‑Leash Windows in Public Spaces</h3>
        <span className="badge">{signatures.length} signed</span>
      </div>
      <p className="small">
        We ask the City of Berkeley to designate daily time windows where existing fields and open spaces
        become off‑leash dog areas—safer play, predictable access, shared by the whole community.
      </p>
      <form onSubmit={submit} style={{marginTop:12}}>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="ZIP code" value={zip} onChange={e=>setZip(e.target.value)} />
        </div>
        <textarea className="input" rows={3} placeholder="Why this matters (optional)" value={reason} onChange={e=>setReason(e.target.value)} />
        <label style={{display:'flex', alignItems:'center', gap:8}}>
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span className="small">I agree to show my name & ZIP publicly.</span>
        </label>
        <div style={{display:'flex', gap:12, marginTop:12}}>
          <button type="submit" className="btn btn-primary">Sign petition</button>
          <a className="btn btn-ghost" href="https://forum.berkeleydogs.com" target="_blank">Discuss on forum</a>
        </div>
      </form>
      {signatures.length > 0 && (
        <div style={{marginTop:16}}>
          <div className="small" style={{marginBottom:8}}>Recent signatures</div>
          <div style={{display:'grid', gap:8}}>
            {signatures.slice(0,6).map((s, i) => (
              <div key={s.ts + '-' + i} style={{display:'flex', justifyContent:'space-between', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px'}}>
                <span style={{fontWeight:600}}>{s.name}</span>
                <span className="small">{s.zip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
