import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/contexts/GameContext';
import { SoundProvider } from '@/contexts/SoundContext';
import SoundSettings from '@/components/SoundSettings';

export const metadata: Metadata = {
  title: 'Social Engineering Training Game',
  description: 'Gamified OSINT password cracking practice with auto-generated profiles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SoundProvider>
          <GameProvider>
            {children}
            <SoundSettings />
          </GameProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
