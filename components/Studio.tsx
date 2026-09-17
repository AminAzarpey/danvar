'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useStory, chapterIds as ids } from '@/lib/use-story';
import { assetPath } from '@/lib/asset-path';
import { useAppearance } from '@/lib/use-appearance';
import { companies, copy, Locale, stacks, team } from '@/content/studio';
import palettes from '@/content/nude-palettes.json';

export default function Studio({ locale }: { locale: Locale }) {
  const c = copy[locale],
    lang = ['en', 'fa', 'ar'].indexOf(locale);
  const { step, playing, setPlaying, reduced, setReduced, progress, go, toggle } = useStory();
  const { palette, mode, pinned, look } = useAppearance();
  const [stack, setStack] = useState(0);
  const [detail, setDetail] = useState<{
    title: string;
    text: string;
    tags?: string[];
    link?: string | null;
  } | null>(null);
  const [need, setNeed] = useState(''),
    [brief, setBrief] = useState(''),
    [saved, setSaved] = useState(false);
  const stage = useRef<HTMLDivElement>(null),
    settings = useRef<HTMLDialogElement>(null),
    profile = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // The welcome scene is the critical first paint; animate subsequent chapters.
    if (reduced || step === 0) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import('gsap').then(({ default: gsap }) => {
      if (disposed) return;
      const context = gsap.context(() => {
        gsap.fromTo(
          '.scene:not([hidden]) [data-reveal]',
          { y: 22 },
          { y: 0, duration: 0.7, stagger: 0.08, clearProps: 'all' }
        );
      }, stage);
      cleanup = () => context.revert();
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [step, reduced]);
  useEffect(() => {
    if (detail) profile.current?.showModal();
  }, [detail]);
  const wheelState = useRef({ step, go });
  useEffect(() => {
    wheelState.current = { step, go };
  });
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1000px)');
    let locked = false;
    function onWheel(event: WheelEvent) {
      if (!desktop.matches || locked) return;
      if (settings.current?.open || profile.current?.open) return;
      const target = event.target as HTMLElement;
      if (target.closest('textarea, input, .tool-panel, dialog')) return;
      if (Math.abs(event.deltaY) < 12) return;
      const { step: current, go: navigate } = wheelState.current;
      const next = event.deltaY > 0 ? current + 1 : current - 1;
      if (next < 0 || next > 4) return;
      event.preventDefault();
      locked = true;
      navigate(next);
      setTimeout(() => {
        locked = false;
      }, 700);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);
  function download() {
    const blob = new Blob([`Danvar — Project brief\n\n${need}\n\n${brief}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danvar-project-brief.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  const title = (label: string, lines: string[], intro: string) => (
    <div className="scene-heading" data-reveal>
      <p className="eyebrow">{label}</p>
      <h1>
        {lines[0]} <em>{lines[1]}</em>
      </h1>
      <p className="intro">{intro}</p>
    </div>
  );
  return (
    <div className="studio" dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <a className="skip-link" href="#main-content">
        {locale === 'en'
          ? 'Skip to content'
          : locale === 'fa'
            ? 'رفتن به محتوا'
            : 'انتقل إلى المحتوى'}
      </a>
      <header>
        <a className="brand" href={'/' + locale} aria-label="Danvar">
          <svg viewBox="0 0 100 90" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 8h30c7 0 11 3 16 8l17 17-10 10-19-18H8zM8 29c9 0 15 7 15 17v22h18c9 0 14 5 14 13H8zm20 6 28 28v18L28 54zM80 29h16L61 64V47zM96 37v24c0 7-3 12-8 17L68 89 56 77l25-21z"
            />
          </svg>
          <span>
            danvar<span className="brand-dot">.</span>
          </span>
        </a>
        <span className="descriptor">{c.descriptor}</span>
        <nav className="languages" aria-label={c.language}>
          {(['en', 'fa', 'ar'] as Locale[]).map((l) => (
            <a key={l} href={`/${l}#${ids[step]}`} aria-current={locale === l ? 'page' : undefined}>
              {l.toUpperCase()}
            </a>
          ))}
        </nav>
        <button
          className="settings-button"
          aria-label={c.choose}
          onClick={() => {
            setPlaying(false);
            settings.current?.showModal();
          }}
        >
          ◐
        </button>
      </header>
      <div className="workspace">
        <nav className="chapters" aria-label={c.chaptersLabel}>
          {c.chapters.map((name, i) => (
            <button key={name} onClick={() => go(i)} aria-current={step === i ? 'step' : undefined}>
              <span>0{i + 1}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <main
          id="main-content"
          tabIndex={-1}
          className="stage"
          ref={stage}
          onFocus={() => setPlaying(false)}
        >
          <section className="scene hero" hidden={step !== 0} aria-label={c.chapters[0]}>
            <div>
              {title(c.hello, c.title, c.intro)}
              <div className="actions" data-reveal>
                <button className="primary" onClick={() => go(1)}>
                  {c.meet} ↗
                </button>
                <button className="text-button" onClick={() => go(2)}>
                  {c.explore}
                </button>
              </div>
              <p className="small hero-foot" data-reveal>
                {c.small}
              </p>
            </div>
            <div className="notebook" data-reveal>
              <div className="notebook-top">
                <span>{c.paperLabel}</span>
                <span>↗</span>
              </div>
              <div className="paper-sketch" aria-hidden="true">
                <span />
                <span />
                <span />
                <i>✳</i>
              </div>
              {c.paper.map((p, i) => (
                <div className="paper-row" key={p}>
                  <small>0{i + 1}</small>
                  <span>{p}</span>
                  <b>{['↗', '◎', '✓'][i]}</b>
                </div>
              ))}
              <p className="small">{c.paperFooter}</p>
            </div>
          </section>
          <section className="scene" hidden={step !== 1} aria-label={c.chapters[1]}>
            {title(c.teamLabel, c.teamTitle, c.teamIntro)}
            <div className="team-grid" dir="ltr">
              {team.map((p, i) => (
                <button
                  data-reveal
                  className={'person ' + (p.id === 'amin' ? 'center-person' : '')}
                  key={p.id}
                  onClick={() =>
                    setDetail({
                      title: locale === 'en' ? p.name : p.fa,
                      text: p.experience,
                      tags: p.skills,
                      link: p.link,
                    })
                  }
                >
                  <div className="portrait">
                    {p.photo ? (
                      <Image
                        src={assetPath(p.photo)}
                        alt={locale === 'en' ? p.name : p.fa}
                        fill
                        sizes="(max-width: 640px) 45vw, 20vw"
                        className="portrait-photo"
                        priority={p.id === 'amin'}
                      />
                    ) : (
                      <span className="initials">{p.initials}</span>
                    )}
                    <span className="person-number">0{i + 1}</span>
                    <span className="portrait-arrow">↗</span>
                  </div>
                  <h2>{locale === 'en' ? p.name : p.fa}</h2>
                  <p className="role">{p.role}</p>
                  <p className="small">{p.focus}</p>
                </button>
              ))}
            </div>
          </section>
          <section className="scene" hidden={step !== 2} aria-label={c.chapters[2]}>
            {title(c.expLabel, c.expTitle, c.expIntro)}
            <div className="company-grid">
              {companies.map((co) => (
                <button
                  data-reveal
                  className="company"
                  key={co.id}
                  onClick={() =>
                    setDetail({
                      title: locale === 'en' ? co.name : co.fa,
                      text: co.people + ' — ' + co.context[lang],
                    })
                  }
                >
                  {co.logo ? (
                    <Image
                      src={assetPath(co.logo)}
                      alt={locale === 'en' ? co.name : co.fa}
                      width={85}
                      height={52}
                      sizes="85px"
                    />
                  ) : (
                    <strong>{co.name}</strong>
                  )}
                  <span>{locale === 'en' ? co.name : co.fa}</span>
                </button>
              ))}
            </div>
            <p className="small caption">{c.expNote}</p>
          </section>
          <section className="scene" hidden={step !== 3} aria-label={c.chapters[3]}>
            {title(c.stackLabel, c.stackTitle, c.stackIntro)}
            <div className="tool-layout" data-reveal>
              <div className="tool-tabs">
                {stacks.map((s, i) => (
                  <button
                    key={s.id}
                    aria-pressed={stack === i}
                    onClick={() => {
                      setStack(i);
                      setPlaying(false);
                    }}
                  >
                    <small>0{i + 1}</small>
                    {s.title[lang]}
                    <span>↗</span>
                  </button>
                ))}
              </div>
              <div className="tool-panel">
                <p className="eyebrow">{stacks[stack].title[lang]}</p>
                <div className="tags" dir="ltr">
                  {stacks[stack].items.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <p className="small">{c.people}</p>
                <p>
                  {team
                    .filter((p) => stacks[stack].people.includes(p.id))
                    .map((p) => (locale === 'en' ? p.name : p.fa))
                    .join(' · ')}
                </p>
              </div>
            </div>
          </section>
          <section className="scene contact" hidden={step !== 4} aria-label={c.chapters[4]}>
            <div>
              {title(c.contactLabel, c.contactTitle, c.contactIntro)}
              <p className="small">{c.contactNote}</p>
            </div>
            <div className="brief" data-reveal>
              <div>
                <p className="small needs-label">{c.needsLabel}</p>
                <div className="needs">
                  {c.needs.map((n) => (
                    <button
                      aria-pressed={need === n}
                      key={n}
                      onClick={() => {
                        setNeed(n);
                        setSaved(false);
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                aria-label={c.placeholder}
                placeholder={c.placeholder}
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  setSaved(false);
                }}
              />
              <div className="actions">
                <button className="primary" onClick={download} disabled={!brief.trim()}>
                  {c.download} ↗
                </button>
                <a className="text-button" href="mailto:aminazarpey@gmail.com">
                  {c.emailUs} ↗
                </a>
              </div>
              <p className="small" role="status">
                {saved ? c.downloaded : ' '}
              </p>
            </div>
          </section>
        </main>
      </div>
      <footer>
        <div className="player">
          <button aria-label={playing ? c.pause : c.play} onClick={toggle}>
            {playing ? 'Ⅱ' : '▷'}
          </button>
          <div className="progress-tracks" aria-hidden="true" ref={progress}>
            {ids.map((id, i) => (
              <span key={id}>
                <i
                  style={{ transform: `scaleX(${i < step || (i === step && !playing) ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          <span className="counter">0{step + 1} / 05</span>
          <button aria-label={c.prev} disabled={step === 0} onClick={() => go(step - 1)}>
            ←
          </button>
          <button aria-label={c.next} disabled={step === 4} onClick={() => go(step + 1)}>
            →
          </button>
        </div>
        <span className="footer-note">{c.footer}</span>
        <button className="skip" onClick={() => go(4)}>
          {c.skip} ↗
        </button>
      </footer>
      <dialog ref={settings} className="preferences" aria-label={c.settings}>
        <button className="close" onClick={() => settings.current?.close()}>
          {c.close} ×
        </button>
        <p className="eyebrow">DANVAR / YOUR SPACE</p>
        <h2>{c.settings}</h2>
        <p className="small">{c.settingsHint}</p>
        <h3>{c.theme}</h3>
        <div className="needs">
          {['system', 'light', 'dark'].map((m, i) => (
            <button key={m} aria-pressed={mode === m} onClick={() => look(palette, m, pinned)}>
              {c.modes[i]}
            </button>
          ))}
        </div>
        <h3>{c.palette}</h3>
        <div className="swatches">
          {palettes.palettes.map((p, i) => (
            <button
              key={p.id}
              aria-pressed={palette === p.id}
              onClick={() => look(p.id, mode, pinned)}
            >
              <i style={{ background: p.light.primary }} />
              {c.paletteNames[i]}
            </button>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => look(palette, mode, e.target.checked)}
          />
          {c.keep}
        </label>
        <label>
          <input
            type="checkbox"
            checked={reduced}
            onChange={(e) => {
              setReduced(e.target.checked);
              setPlaying(false);
            }}
          />
          {c.reduced}
        </label>
      </dialog>
      <dialog aria-label={detail?.title || c.profile} ref={profile} onClose={() => setDetail(null)}>
        <button className="close" onClick={() => profile.current?.close()}>
          {c.close} ×
        </button>
        <p className="eyebrow">DANVAR / PEOPLE & EXPERIENCE</p>
        <h2>{detail?.title}</h2>
        <p>{detail?.text}</p>
        {detail?.tags && (
          <div className="tags">
            {detail.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
        {detail?.link && (
          <a className="primary profile-link" href={detail.link} target="_blank" rel="noreferrer">
            {c.linkedin}
          </a>
        )}
      </dialog>
    </div>
  );
}
