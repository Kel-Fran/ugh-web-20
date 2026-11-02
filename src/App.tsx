import { useState } from "react";

const PAGE_TYPES = ['home', 'admin', 'moderator'] as const;
type PageType = typeof PAGE_TYPES[number];

function Home() {
  return <main>home</main>
}

function Admin() {
  return <main>admin</main>
}

function Moderator() {
  return <main>moderator</main>
}

const PAGE_COMPONENTS = {
  home: Home,
  admin: Admin,
  moderator: Moderator,
} as const;

export default function App() {
  const [page, setPage] = useState<PageType>('home');
  const Page = PAGE_COMPONENTS[page];

return <>
<header>
  {PAGE_TYPES.map((p) => (
    <button key={p} onClick={() => setPage(p)}>
      {p}
    </button>
  ))}
</header>
<Page />
<footer>
  VD 13E 11/02/26
</footer>
</>
}