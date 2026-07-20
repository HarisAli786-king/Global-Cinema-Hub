import { useEffect, useRef, useState } from "react";
import { Send, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type ChatMessage = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  created_at: number;
};

const STORAGE_KEY = "gch_community_chat";

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "s1",
    author: "ReelRanger",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RR&backgroundColor=e50914&textColor=ffffff",
    text: "Just finished Neon Skyline — the rain-soaked cinematography is unreal. Anyone else seen it?",
    created_at: Date.now() - 3600_000 * 5,
  },
  {
    id: "s2",
    author: "PopcornPablo",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=1a1a1a&textColor=ffffff",
    text: "Quiet Orbit is the hidden gem of the hub. Slow burn but worth every minute.",
    created_at: Date.now() - 3600_000 * 2,
  },
  {
    id: "s3",
    author: "FrameFanatic",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FF&backgroundColor=1a1a1a&textColor=ffffff",
    text: "Any recommendations for Korean drama? I loved the picks in that row.",
    created_at: Date.now() - 3600_000,
  },
];

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {
    // ignore
  }
  const seeded = [...SEED_MESSAGES].reverse();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // ignore
  }
  return seeded;
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

type Props = {
  onRequireAuth: () => void;
};

export function CommunityChat({ onRequireAuth }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      text: text.trim(),
      created_at: Date.now(),
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    saveMessages(updated);
    setText("");
  };

  const onInputFocus = () => {
    if (!user) onRequireAuth();
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pt-24 pb-10 md:pt-28">
      <h2 className="font-display text-3xl tracking-wide text-white md:text-4xl">Community Chat</h2>
      <p className="mt-1 text-sm text-white/50">
        Discuss films & series with fellow cinema fans. Sign in to post messages.
      </p>

      <form
        onSubmit={send}
        className="sticky top-20 z-10 mt-4 flex gap-2 rounded-xl border border-white/10 bg-base-card/90 p-2 backdrop-blur"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={onInputFocus}
          placeholder={user ? "Type a message…" : "Sign in to send a message…"}
          className="flex-1 rounded-lg bg-base-elevated px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-accent-red/40"
        />
        <button
          type="submit"
          disabled={user ? !text.trim() : false}
          className="flex items-center gap-1.5 rounded-lg bg-accent-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-red-dark disabled:opacity-50"
        >
          {user ? <Send className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          <span className="hidden sm:inline">{user ? "Send" : "Sign In"}</span>
        </button>
      </form>

      <div className="mt-4 space-y-3 pb-10">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3 animate-fadeInUp">
            <img src={m.avatar} alt={m.author} className="h-9 w-9 flex-none rounded-full" />
            <div className="min-w-0 flex-1 rounded-lg bg-base-card px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">{m.author}</span>
                <span className="text-xs text-white/40">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/70">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}
