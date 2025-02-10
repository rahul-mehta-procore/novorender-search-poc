"use client";

import dynamic from "next/dynamic";

/**
 * Novorender relies on browser-only APIs like window,
 * we need disable server-side rendering for our component.
 */
const SceneViewer = dynamic(
  async () => await import('./components/SceneViewer'),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <SceneViewer />
    </main>
  );
}
