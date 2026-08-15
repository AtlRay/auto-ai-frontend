import AutoAILogo from '@/components/brand/AutoAILogo';
import Wordmark from '@/components/brand/Wordmark';

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <AutoAILogo showFullName />
        <Wordmark className="text-2xl" />
        <p className="text-xs text-white/35">
          © {new Date().getFullYear()} Auto AI Technologies™. Private alpha.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
