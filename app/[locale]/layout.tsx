import type { Metadata } from 'next';
import palettes from '@/content/nude-palettes.json';
import '../styles.css';
import { notFound } from 'next/navigation';
import localFont from 'next/font/local';

const latin = localFont({
  src: '../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2',
  variable: '--font-latin',
  display: 'swap',
});
const arabic = localFont({
  src: '../../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2',
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Danvar — Product design & software engineering',
  description: 'Five specialists. One thoughtful product team. Meet Danvar.',
  robots: { index: false, follow: false },
};

const init = `(()=>{const palettes=${JSON.stringify(palettes.palettes)};let saved=null,id='mist',mode='system';try{saved=JSON.parse(localStorage.getItem('danvar-look')||'null');id=saved?.palette||sessionStorage.getItem('danvar-palette');mode=saved?.mode||'system';if(!palettes.some(p=>p.id===id)){const last=localStorage.getItem('danvar-last');if(last){const pool=palettes.filter(p=>p.id!==last);id=pool[Math.floor(Math.random()*pool.length)].id}else{id='mist'}sessionStorage.setItem('danvar-palette',id);localStorage.setItem('danvar-last',id)}}catch{}const theme=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;const p=palettes.find(p=>p.id===id)||palettes[0];const root=document.documentElement;root.dataset.palette=p.id;root.dataset.mode=mode;root.dataset.theme=theme;for(const [k,v]of Object.entries(p[theme]||p.light))root.style.setProperty('--'+k,v);root.style.colorScheme=theme})()`;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['en', 'fa', 'ar'].includes(locale)) notFound();
  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: init }} />
      </head>
      <body className={`${latin.variable} ${arabic.variable}`}>
        {children}
        <noscript>
          <style>
            {
              '.scene{display:block!important;min-height:auto!important;margin:3rem 0}.player,.chapters,.settings-button{display:none!important}.stage{height:auto!important;overflow:visible!important}'
            }
          </style>
        </noscript>
      </body>
    </html>
  );
}
