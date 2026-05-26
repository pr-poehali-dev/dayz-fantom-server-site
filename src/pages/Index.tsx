import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const SERVER_STATUS_URL = "https://functions.poehali.dev/53ac4386-29bb-4df3-b1d5-fc003a87ce62";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/008105f6-3e91-4af2-9be5-134840844579/files/a83e9d47-5731-4587-8d91-4319ca68ef4e.jpg";

const KILL_FEED = [
  { id: 1, shooter: "Призрак_77", victim: "NoobSurvivor", weapon: "M4A1", time: "00:12" },
  { id: 2, shooter: "DarkHunter", victim: "Мишаня_99", weapon: "SVD", time: "01:34" },
  { id: 3, shooter: "ShadowKill", victim: "BerezaLesha", weapon: "AK74", time: "02:05" },
  { id: 4, shooter: "Fantom_Pro", victim: "ZombieHater", weapon: "Blaze", time: "03:11" },
  { id: 5, shooter: "КиберВолк", victim: "RandomGuy", weapon: "MP5", time: "04:22" },
  { id: 6, shooter: "NightCrawler", victim: "Сибиряк", weapon: "Mosin", time: "05:47" },
];

const CHAT_MESSAGES = [
  { id: 1, name: "Призрак_77", msg: "Кто едет на военную базу?", color: "#00ff41" },
  { id: 2, name: "DarkHunter", msg: "Ищу группу для рейда", color: "#ff9900" },
  { id: 3, name: "ShadowKill", msg: "Трейдер в Электро пустой", color: "#fff" },
  { id: 4, name: "КиберВолк", msg: "ВНИМАНИЕ вертолёт на севере!", color: "#ff2222" },
  { id: 5, name: "Fantom_Pro", msg: "Продам C-130 за 5 золота", color: "#00ff41" },
  { id: 6, name: "Мишаня_99", msg: "Помогите новичку разобраться", color: "#88aaff" },
  { id: 7, name: "BerezaLesha", msg: "Рестарт через 10 минут", color: "#ffee00" },
  { id: 8, name: "NightCrawler", msg: "Кто видел Призрака? :)", color: "#fff" },
];

const TOP_PLAYERS = [
  { rank: 1, name: "Fantom_Pro", kills: 1847, deaths: 89, kd: "20.7", hours: 2340 },
  { rank: 2, name: "Призрак_77", kills: 1654, deaths: 112, kd: "14.8", hours: 1980 },
  { rank: 3, name: "ShadowKill", kills: 1423, deaths: 134, kd: "10.6", hours: 1760 },
  { rank: 4, name: "DarkHunter", kills: 1291, deaths: 167, kd: "7.7", hours: 1540 },
  { rank: 5, name: "КиберВолк", kills: 1088, deaths: 201, kd: "5.4", hours: 1320 },
  { rank: 6, name: "NightCrawler", kills: 987, deaths: 234, kd: "4.2", hours: 1100 },
  { rank: 7, name: "SniperFox", kills: 876, deaths: 278, kd: "3.1", hours: 980 },
  { rank: 8, name: "Сибиряк", kills: 754, deaths: 312, kd: "2.4", hours: 840 },
];

const DONATE_PACKS = [
  {
    name: "Выживший",
    price: "199₽",
    color: "green",
    items: ["Стартовый набор", "Доп. слот инвентаря", "Цветной ник", "Приоритет входа"],
    featured: false,
  },
  {
    name: "Боец",
    price: "499₽",
    color: "red",
    items: ["Всё из Выжившего", "VIP оружие-скин", "Авто-восстановление", "Тег [VIP] в чате", "Доп. точка возрождения"],
    featured: true,
  },
  {
    name: "Призрак",
    price: "999₽",
    color: "green",
    items: ["Всё из Бойца", "Уникальный камуфляж", "Персональный тайник", "Тег [FANTOM] в чате", "Доступ к закрытой зоне"],
    featured: false,
  },
];

const RULES = [
  { num: "01", title: "Читы запрещены", desc: "Использование чит-программ и дюпа предметов — немедленный бан." },
  { num: "02", title: "Уважение игроков", desc: "Оскорбления, расизм и политика в чате строго запрещены!" },
  { num: "03", title: "Рейдинг", desc: "Рейд-тайм с 12:00 ПТ по 23:59 ВС! Рейд с применением С4." },
  { num: "04", title: "КВС", desc: "Кэмп возрождения запрещён. Минимум 300м от спавна." },
  { num: "05", title: "Читерские постройки", desc: "Постройки-эксплойты, мешающие геймплею, будут снесены." },
  { num: "06", title: "Реклама", desc: "Реклама других серверов запрещена в любой форме." },
];

const SECTIONS = ["Главная", "Онлайн", "Донат", "Правила", "Топ-игроки", "О сервере", "Контакты"];
const SECTION_IDS = ["hero", "online", "donate", "rules", "top", "about", "contacts"];

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(60);
  const [serverOnline, setServerOnline] = useState(true);
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
  const [killFeed, setKillFeed] = useState(KILL_FEED);
  const [serverTime, setServerTime] = useState("14:23:07");
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchServerStatus = async () => {
    try {
      const res = await fetch(SERVER_STATUS_URL);
      const data = await res.json();
      setOnlineCount(data.players ?? 0);
      setMaxPlayers(data.max_players ?? 60);
      setServerOnline(data.online ?? false);
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setServerTime(now.toTimeString().slice(0, 8));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const names = ["Выживший_X", "RedZone", "Спецназ", "БабайкаДНС", "Таёжник"];
    const msgs = ["Есть кто-нибудь?", "Меня убили!", "Иду к Чернарусу", "Сервер топ!", "Кто хочет группу?"];
    const colors = ["#00ff41", "#fff", "#ff9900", "#88aaff"];
    const interval = setInterval(() => {
      const newMsg = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setChatMessages((prev) => [newMsg, ...prev.slice(0, 9)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const shooters = ["Призрак_77", "DarkHunter", "Fantom_Pro", "КиберВолк", "ShadowKill"];
    const victims = ["NoobSurvivor", "Мишаня_99", "RandomGuy", "Сибиряк", "Survivor_42"];
    const weapons = ["M4A1", "AK74", "SVD", "Mosin", "MP5", "Winchester"];
    const interval = setInterval(() => {
      const newKill = {
        id: Date.now(),
        shooter: shooters[Math.floor(Math.random() * shooters.length)],
        victim: victims[Math.floor(Math.random() * victims.length)],
        weapon: weapons[Math.floor(Math.random() * weapons.length)],
        time: `${Math.floor(Math.random() * 59).toString().padStart(2, "0")}:${Math.floor(Math.random() * 59).toString().padStart(2, "0")}`,
      };
      setKillFeed((prev) => [newKill, ...prev.slice(0, 7)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dark-bg)", color: "#e8e8e8" }}>

      {/* NEWS TICKER */}
      <div style={{ backgroundColor: "#0d0d0d", borderBottom: "1px solid rgba(255,34,34,0.3)", height: "32px", overflow: "hidden", position: "relative" }}>
        <div className="flex items-center h-full">
          <div style={{ backgroundColor: "var(--neon-red)", padding: "0 12px", height: "100%", display: "flex", alignItems: "center", flexShrink: 0, zIndex: 2 }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>НОВОСТИ</span>
          </div>
          <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
            <div className="animate-ticker whitespace-nowrap" style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "12px", color: "#aaa", padding: "0 20px" }}>
              {serverOnline ? "🟢" : "🔴"} СЕРВЕР {serverOnline ? "ОНЛАЙН" : "ОФФЛАЙН"} — {onlineCount}/{maxPlayers} игроков &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🗺️ Карта: Chernarus+ &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🎮 Версия: DayZ 1.29 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🌐 IP: 80.82.38.165:2302 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🎁 Двойной опыт каждые выходные &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ⚡ Следующий рестарт через 2 часа
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(255,34,34,0.15)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: "60px" }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div style={{ width: "32px", height: "32px", border: "2px solid var(--neon-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "13px", color: "var(--neon-red)" }}>DZ</span>
            </div>
            <div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: 1, letterSpacing: "0.08em" }}>
                <span style={{ color: "#fff" }}>DAY</span><span style={{ color: "var(--neon-red)" }}>Z</span>{" "}
                <span style={{ color: "#fff" }}>FANTOM</span>
              </div>
              <div style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#555", fontFamily: "Share Tech Mono" }}>ВЫЖИВИ ИЛИ УМРИ</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => scrollTo(SECTION_IDS[i])}
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: activeSection === SECTION_IDS[i] ? "var(--neon-red)" : "#777",
                  padding: "4px 10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  borderBottom: activeSection === SECTION_IDS[i] ? "1px solid var(--neon-red)" : "1px solid transparent",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: "rgba(0,255,65,0.08)", border: "1px solid rgba(0,255,65,0.3)", borderRadius: "3px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="online-dot"></span>
              <span style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: serverOnline ? "var(--neon-green)" : "#ff4444" }}>{onlineCount}/{maxPlayers}</span>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ backgroundColor: "#0d0d0d", borderTop: "1px solid rgba(255,34,34,0.15)", padding: "16px" }}>
            {SECTIONS.map((s, i) => (
              <button key={s} onClick={() => scrollTo(SECTION_IDS[i])} style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "Oswald", fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaa", padding: "10px 0", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" style={{ position: "relative", height: "90vh", minHeight: "500px", overflow: "hidden" }}>
        <img src={HERO_IMAGE} alt="DayZ Fantom" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div className="hero-overlay scanlines" style={{ position: "absolute", inset: 0 }} />

        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px" }}>
          <div className="animate-slide-in-up">
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "12px", letterSpacing: "0.3em", color: "var(--neon-green)", marginBottom: "16px" }}>
              ▶ СЕРВЕР В СЕТИ ◀
            </div>
            <h1 className="animate-flicker" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "clamp(48px, 10vw, 100px)", lineHeight: 0.9, letterSpacing: "0.05em", color: "#fff", marginBottom: "8px" }}>
              DAY<span style={{ color: "var(--neon-red)", textShadow: "0 0 40px rgba(255,34,34,0.8)" }}>Z</span>
            </h1>
            <h1 style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "clamp(32px, 7vw, 72px)", lineHeight: 1, letterSpacing: "0.15em", color: "#fff", marginBottom: "24px" }}>
              <span style={{ color: "var(--neon-red)", textShadow: "0 0 30px rgba(255,34,34,0.7)" }}>FANTOM</span>
            </h1>
            <p style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "40px" }}>
              Постапокалиптическое выживание • PvP/PvE • Моды
            </p>

            <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
              {[
                { label: "Онлайн", value: `${onlineCount}/${maxPlayers}` },
                { label: "Порт", value: "2302" },
                { label: "Карта", value: "Chernarus" },
                { label: "Версия", value: "1.29" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Share Tech Mono", fontSize: "22px", color: "var(--neon-red)", textShadow: "var(--neon-red-glow)" }}>{stat.value}</div>
                  <div style={{ fontFamily: "Roboto", fontSize: "11px", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="neon-btn-red" style={{ padding: "12px 32px", fontSize: "14px" }} onClick={() => scrollTo("donate")}>
                💎 Магазин доната
              </button>
              <button className="neon-btn-green" style={{ padding: "12px 32px", fontSize: "14px" }}>
                ▶ Подключиться
              </button>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 2, textAlign: "center" }}>
          <div className="animate-blink" style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, var(--neon-red), transparent)", margin: "0 auto" }} />
        </div>
      </section>

      {/* ONLINE */}
      <section id="online" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-green)", marginBottom: "8px" }}>// LIVE DATA</div>
          <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)", color: "#fff" }}>
            СТАТУС <span style={{ color: "var(--neon-red)" }}>СЕРВЕРА</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {/* Server info */}
          <div className="dark-card" style={{ padding: "24px", borderRadius: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span className={serverOnline ? "online-dot" : ""} style={!serverOnline ? { width: 8, height: 8, borderRadius: "50%", background: "#ff4444", display: "inline-block" } : {}} />
              <h3 style={{ fontFamily: "Oswald", fontSize: "16px", letterSpacing: "0.1em", color: "#fff", margin: 0 }}>СЕРВЕР FANTOM #1</h3>
              <span style={{ marginLeft: "auto", fontFamily: "Share Tech Mono", fontSize: "10px", color: serverOnline ? "var(--neon-green)" : "#ff4444" }}>
                {serverOnline ? "● ONLINE" : "● OFFLINE"}
              </span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "Share Tech Mono", fontSize: "12px", color: "#666" }}>ИГРОКИ</span>
                <span style={{ fontFamily: "Share Tech Mono", fontSize: "12px", color: "var(--neon-green)" }}>{onlineCount}/{maxPlayers}</span>
              </div>
              <div className="server-progress">
                <div className="server-progress-fill" style={{ width: `${(onlineCount / maxPlayers) * 100}%` }} />
              </div>
            </div>
            {[
              { label: "IP", value: "80.82.38.165" },
              { label: "Порт", value: "2302" },
              { label: "Карта", value: "Chernarus+" },
              { label: "Время сервера", value: serverTime },
              { label: "Версия", value: "DayZ 1.29" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontFamily: "Roboto", fontSize: "13px", color: "#555" }}>{item.label}</span>
                <span style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: "#ccc" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Kill feed */}
          <div className="dark-card" style={{ padding: "24px", borderRadius: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Icon name="Skull" size={16} style={{ color: "var(--neon-red)" }} />
              <h3 style={{ fontFamily: "Oswald", fontSize: "16px", letterSpacing: "0.1em", color: "#fff", margin: 0 }}>ЛЕНТА УБИЙСТВ</h3>
              <span style={{ marginLeft: "auto", fontFamily: "Share Tech Mono", fontSize: "10px", color: "var(--neon-red)" }}>● LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {killFeed.map((kill) => (
                <div key={kill.id} className="chat-entry" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", background: "rgba(255,34,34,0.04)", border: "1px solid rgba(255,34,34,0.08)", borderRadius: "2px" }}>
                  <span style={{ fontFamily: "Share Tech Mono", fontSize: "10px", color: "#444", minWidth: "36px" }}>{kill.time}</span>
                  <span style={{ fontFamily: "Share Tech Mono", fontSize: "12px", fontWeight: 700, color: "var(--neon-green)" }}>{kill.shooter}</span>
                  <span style={{ color: "#555", fontSize: "10px" }}>→</span>
                  <span style={{ fontFamily: "Share Tech Mono", fontSize: "12px", color: "var(--neon-red)" }}>{kill.victim}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "Share Tech Mono", fontSize: "10px", color: "#555" }}>[{kill.weapon}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="dark-card" style={{ padding: "24px", borderRadius: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Icon name="MessageSquare" size={16} style={{ color: "var(--neon-green)" }} />
              <h3 style={{ fontFamily: "Oswald", fontSize: "16px", letterSpacing: "0.1em", color: "#fff", margin: 0 }}>ЧАТ СЕРВЕРА</h3>
              <span style={{ marginLeft: "auto", fontFamily: "Share Tech Mono", fontSize: "10px", color: "var(--neon-green)" }}>● LIVE</span>
            </div>
            <div ref={chatRef} style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-entry" style={{ padding: "6px 8px", borderLeft: `2px solid ${msg.color}50`, background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontFamily: "Share Tech Mono", fontSize: "12px", color: msg.color, fontWeight: 700 }}>{msg.name}: </span>
                  <span style={{ fontFamily: "Roboto", fontSize: "12px", color: "#888" }}>{msg.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: "1280px", margin: "0 auto" }} />

      {/* DONATE */}
      <section id="donate" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-red)", marginBottom: "8px" }}>// PREMIUM STORE</div>
          <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)", color: "#fff" }}>
            МАГАЗИН <span style={{ color: "var(--neon-red)" }}>ПРИВИЛЕГИЙ</span>
          </h2>
          <p style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "14px", color: "#555", letterSpacing: "0.1em", marginTop: "12px" }}>
            Получи преимущество над врагами — поддержи сервер
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {DONATE_PACKS.map((pack) => (
            <div
              key={pack.name}
              className="dark-card donate-card"
              style={{ padding: "32px 24px", borderRadius: "4px", border: `1px solid ${pack.featured ? "var(--neon-red)" : "rgba(255,255,255,0.06)"}`, boxShadow: pack.featured ? "var(--neon-red-glow)" : "none", position: "relative" }}
            >
              {pack.featured && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "var(--neon-red)", padding: "2px 16px", fontFamily: "Oswald", fontSize: "11px", letterSpacing: "0.15em", color: "#fff" }}>
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "24px", letterSpacing: "0.1em", color: "#fff", marginBottom: "4px" }}>{pack.name}</div>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "32px", color: pack.color === "red" ? "var(--neon-red)" : "var(--neon-green)", textShadow: pack.color === "red" ? "var(--neon-red-glow)" : "var(--neon-green-glow)" }}>{pack.price}</div>
              </div>
              <div style={{ marginBottom: "28px" }}>
                {pack.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "var(--neon-green)", fontSize: "12px" }}>✓</span>
                    <span style={{ fontFamily: "Roboto", fontSize: "13px", color: "#aaa" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button className={pack.color === "red" ? "neon-btn-red" : "neon-btn-green"} style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
                Купить
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.2em", color: "#444", marginBottom: "12px" }}>СПОСОБЫ ОПЛАТЫ</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            {["💳 Банковская карта", "📱 СБП", "🏦 ЮMoney", "💰 QIWI"].map((method) => (
              <div key={method} style={{ fontFamily: "Roboto", fontSize: "13px", color: "#555", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px" }}>{method}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: "1280px", margin: "0 auto" }} />

      {/* RULES */}
      <section id="rules" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-red)", marginBottom: "8px" }}>// SERVER RULES</div>
          <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)", color: "#fff" }}>
            ПРАВИЛА <span style={{ color: "var(--neon-red)" }}>СЕРВЕРА</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {RULES.map((rule) => (
            <div key={rule.num} className="dark-card" style={{ padding: "24px", borderRadius: "4px", display: "flex", gap: "16px" }}>
              <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "28px", color: "rgba(255,34,34,0.2)", lineHeight: 1, flexShrink: 0 }}>{rule.num}</div>
              <div>
                <h4 style={{ fontFamily: "Oswald", fontSize: "15px", letterSpacing: "0.08em", color: "#fff", marginBottom: "6px" }}>{rule.title}</h4>
                <p style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "13px", color: "#666", lineHeight: 1.6, margin: 0 }}>{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: "1280px", margin: "0 auto" }} />

      {/* TOP PLAYERS */}
      <section id="top" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-green)", marginBottom: "8px" }}>// LEADERBOARD</div>
          <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)", color: "#fff" }}>
            ТОП <span style={{ color: "var(--neon-red)" }}>ИГРОКИ</span>
          </h2>
        </div>

        <div className="dark-card" style={{ borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 80px 80px", padding: "12px 20px", borderBottom: "1px solid rgba(255,34,34,0.2)", background: "rgba(255,34,34,0.05)" }}>
            {["#", "Игрок", "Убийства", "Смерти", "K/D", "Часы"].map((h) => (
              <div key={h} style={{ fontFamily: "Oswald", fontSize: "11px", letterSpacing: "0.12em", color: "#555", textAlign: h === "Игрок" ? "left" : "center" }}>{h}</div>
            ))}
          </div>
          {TOP_PLAYERS.map((player, i) => (
            <div
              key={player.rank}
              style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 80px 80px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent", transition: "background 0.2s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,34,34,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"; }}
            >
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "14px", color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "#444", textAlign: "center" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : player.rank}
              </div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: i < 3 ? "var(--neon-green)" : "#ccc" }}>{player.name}</div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: "var(--neon-red)", textAlign: "center" }}>{player.kills}</div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: "#555", textAlign: "center" }}>{player.deaths}</div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: "#aaa", textAlign: "center" }}>{player.kd}</div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "13px", color: "#555", textAlign: "center" }}>{player.hours}ч</div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: "1280px", margin: "0 auto" }} />

      {/* ABOUT */}
      <section id="about" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-red)", marginBottom: "8px" }}>// ABOUT SERVER</div>
            <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 42px)", color: "#fff", marginBottom: "20px" }}>
              О <span style={{ color: "var(--neon-red)" }}>СЕРВЕРЕ</span>
            </h2>
            <p style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "14px", color: "#666", lineHeight: 1.8, marginBottom: "16px" }}>
              DayZ Fantom — проект для настоящих выживальщиков. Мы работаем с 2021 года и создали уникальную атмосферу постапокалиптической Чернаруси с авторскими модами и балансом.
            </p>
            <p style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "14px", color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
              Карта Namalsk с суровым климатом, уникальная экономика, торговцы и PvP-зоны делают каждый рейд незабываемым.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { icon: "Shield", label: "Анти-чит", desc: "BattlEye + собственный" },
                { icon: "Zap", label: "Аптайм", desc: "99.8% онлайн" },
                { icon: "Users", label: "Сообщество", desc: "3400+ игроков" },
                { icon: "Star", label: "Рейтинг", desc: "4.8/5 отзывы" },
              ].map((item) => (
                <div key={item.label} className="dark-card" style={{ padding: "16px", borderRadius: "4px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Icon name={item.icon as "Shield"} size={18} style={{ color: "var(--neon-red)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontFamily: "Oswald", fontSize: "13px", color: "#fff", letterSpacing: "0.05em" }}>{item.label}</div>
                    <div style={{ fontFamily: "Roboto", fontSize: "12px", color: "#555" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { value: "3+", label: "Лет работы" },
              { value: "64", label: "Слотов" },
              { value: "15+", label: "Модов" },
              { value: "24/7", label: "Поддержка" },
            ].map((stat) => (
              <div key={stat.label} className="dark-card" style={{ padding: "24px", borderRadius: "4px", textAlign: "center" }}>
                <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "40px", color: "var(--neon-red)", textShadow: "var(--neon-red-glow)" }}>{stat.value}</div>
                <div style={{ fontFamily: "Roboto", fontWeight: 300, fontSize: "12px", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: "1280px", margin: "0 auto" }} />

      {/* CONTACTS */}
      <section id="contacts" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", letterSpacing: "0.3em", color: "var(--neon-green)", marginBottom: "8px" }}>// SOCIAL & SUPPORT</div>
          <h2 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)", color: "#fff" }}>
            <span style={{ color: "var(--neon-red)" }}>КОНТАКТЫ</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
          {([
            { icon: "MessageCircle", label: "Discord", desc: "Официальный Discord сервера", color: "#5865F2", url: "https://discord.gg/NSsDKdDkBT" },
            { icon: "Send", label: "Telegram", desc: "Новости и обновления", color: "var(--neon-green)", url: "" },
            { icon: "Tv", label: "Twitch", desc: "Прямые трансляции", color: "#9146FF", url: "https://www.twitch.tv/texhag30p" },
            { icon: "HelpCircle", label: "Поддержка", desc: "Помощь и вопросы", color: "var(--neon-red)", url: "" },
          ] as { icon: string; label: string; desc: string; color: string; url: string }[]).map((contact) => (
            <div key={contact.label} className="dark-card donate-card" style={{ padding: "24px", borderRadius: "4px", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", border: `1px solid ${contact.color}40`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name={contact.icon as "Send"} size={22} style={{ color: contact.color }} />
              </div>
              <h4 style={{ fontFamily: "Oswald", fontSize: "16px", letterSpacing: "0.08em", color: "#fff", marginBottom: "6px" }}>{contact.label}</h4>
              <p style={{ fontFamily: "Roboto", fontSize: "12px", color: "#555", marginBottom: "16px" }}>{contact.desc}</p>
              <button
                className="neon-btn-red"
                style={{ padding: "8px 20px", fontSize: "12px", width: "100%", opacity: contact.url ? 1 : 0.4, cursor: contact.url ? "pointer" : "not-allowed" }}
                onClick={() => contact.url && window.open(contact.url, "_blank")}
              >
                Перейти
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,34,34,0.15)", padding: "32px 20px", textAlign: "center", backgroundColor: "#080808" }}>
        <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: "20px", letterSpacing: "0.1em", marginBottom: "8px" }}>
          <span style={{ color: "#fff" }}>DAYZ</span> <span style={{ color: "var(--neon-red)" }}>FANTOM</span>
        </div>
        <div style={{ fontFamily: "Share Tech Mono", fontSize: "11px", color: "#333", letterSpacing: "0.15em" }}>
          © 2024 DayZ Fantom • Не является официальным продуктом Bohemia Interactive
        </div>
        <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {SECTIONS.map((s, i) => (
            <button key={s} onClick={() => scrollTo(SECTION_IDS[i])} style={{ fontFamily: "Roboto", fontSize: "12px", color: "#444", background: "none", border: "none", cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}