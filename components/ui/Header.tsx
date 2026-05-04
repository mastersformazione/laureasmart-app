type Props = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="w-full rounded-2xl bg-gradient-to-br from-[#21003d] via-[#140029] to-[#020014] px-6 py-8 text-white shadow-sm">
      <div className="flex min-h-[140px] flex-col justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl">
            ✦
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>

        {subtitle && (
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
