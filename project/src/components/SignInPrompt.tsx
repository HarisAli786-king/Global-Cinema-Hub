import { useEffect, useState } from "react";
import { X, User, Users } from "lucide-react";

type Props = {
  message?: string;
  onSignIn: (userData: { name: string; gender: string }) => void;
  onClose: () => void;
};

export function SignInPrompt({ message, onSignIn, onClose }: Props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSignIn({ name: name.trim(), gender });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-accent-red/30 bg-base-card p-6 text-center shadow-2xl animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent-red/40 bg-accent-red/10 text-accent-red">
          <Users className="h-7 w-7" />
        </div>

        <h2 className="text-lg font-semibold text-white">Join Community Hub</h2>
        <p className="mt-1 text-sm text-white/60">
          {message ?? "Please enter your name and select gender to join."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-4 w-4 text-white/40" />
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-accent-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-accent-red"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-red-dark shadow-lg shadow-accent-red/30"
          >
            Join Now
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-2 w-full rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
